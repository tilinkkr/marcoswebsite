"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { FEATURED_PARTNER } from "@/config/funded-partners";
import { initializePostHog } from "@/lib/analytics/posthog";
import { isFundedIntentPath, POPUP_SESSION_KEY } from "@/lib/popups";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./whatsapp-community-prompt.module.css";

/*
 * Engagement-triggered WhatsApp invitation.
 *
 * - Never on arrival: Google treats arrival interstitials on mobile as
 *   intrusive, and cold visitors convert poorly. It opens after real
 *   engagement (scroll depth or time on page) or desktop exit intent.
 * - Frequency-capped per browser: once per session; hidden for 3 days after
 *   "Maybe later" and 30 days after a WhatsApp click.
 * - The prefilled message reflects the chosen topic and the page the visitor
 *   was reading, so the team knows the context of the first message.
 */

const STORAGE_KEY = "markos-wa-prompt";
// Shared with the funded offer so only one popup appears per session.
const SESSION_KEY = POPUP_SESSION_KEY;
const DISMISS_DAYS = 3;
const CLICKED_DAYS = 30;
const MIN_DELAY_MS = 9000;
const ENGAGED_MS = 28000;
const SCROLL_DEPTH = 0.42;
const EXCLUDED_PREFIXES = ["/admin", "/join/checkout", "/api"];

const TOPICS = [
  {
    id: "gmeet",
    label: "Daily Google Meet stream",
    message:
      "Hi MARKOS, I want to know how your daily private Google Meet live trading stream for passing funded accounts works.",
  },
  {
    id: "funded",
    label: "Pass my funded account",
    message:
      "Hi MARKOS, I'm preparing for a funded-account challenge. Can you explain how your community and risk plan help?",
  },
  {
    id: "choose",
    label: "Safest prop firm / payouts",
    message:
      "Hi MARKOS, I'm trying to choose a safe prop firm (FundingPips / FTMO / Alpha Capital) from India or GCC. What should I check first?",
  },
  {
    id: "link",
    label: "Link MT5 / TradingView",
    message:
      "Hi MARKOS, I need help linking my funded account to TradingView, MT5 or Tradovate and setting up my risk plan.",
  },
  {
    id: "gold",
    label: "Free 30-day XAUUSD plan",
    message:
      "Hi MARKOS, please send me the free 30-day XAUUSD gold practice plan and community details.",
  },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

function readHiddenUntil(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Number(JSON.parse(raw).hiddenUntil) || 0 : 0;
  } catch {
    return 0;
  }
}

function hideFor(days: number) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ hiddenUntil: Date.now() + days * 86_400_000 }),
    );
  } catch {
    // Storage may be blocked; the session flag still limits repeats.
  }
}

function track(event: string, props: Record<string, unknown> = {}) {
  if (
    !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    !process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    return;
  }
  try {
    initializePostHog().capture(event, {
      page_path: window.location.pathname,
      ...props,
    });
  } catch {
    // Analytics must never block the WhatsApp path.
  }
}

function pageContext(): string {
  // innerText keeps the visual line breaks (<br>) as spaces.
  const heading = (
    document.querySelector<HTMLElement>("main h1")?.innerText ?? ""
  )
    .replace(/\s+/g, " ")
    .trim();
  if (!heading || window.location.pathname === "/") return "";
  return ` (I was reading: "${heading.slice(0, 90)}")`;
}

export function WhatsAppCommunityPrompt() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<TopicId>("gmeet");
  const [context, setContext] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Funded-intent pages show the partner offer instead (it also links to
  // WhatsApp), so the two popups never compete.
  const excluded =
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    (Boolean(FEATURED_PARTNER) && isFundedIntentPath(pathname));

  const show = useCallback((trigger: string) => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Continue without the session cap.
    }
    if (readHiddenUntil() > Date.now()) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setContext(pageContext());
    setOpen(true);
    track("whatsapp_prompt_shown", { trigger });
  }, []);

  // Engagement triggers.
  useEffect(() => {
    if (excluded || open) return;
    // Automated browsers (tests, crawlers) never see the invitation.
    if (navigator.webdriver) return;
    if (readHiddenUntil() > Date.now()) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // ignore
    }

    const start = performance.now();
    let fired = false;
    const fire = (trigger: string) => {
      if (fired || performance.now() - start < MIN_DELAY_MS) return;
      fired = true;
      cleanup();
      show(trigger);
    };

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / max >= SCROLL_DEPTH) fire("scroll_depth");
    };
    const onExit = (event: MouseEvent) => {
      if (event.clientY <= 0 && !event.relatedTarget) fire("exit_intent");
    };
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") fire("time_on_page");
    }, ENGAGED_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(pointer: fine)").matches;
    if (desktop) document.addEventListener("mouseout", onExit);

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onExit);
    }
    return cleanup;
  }, [excluded, open, pathname, show]);

  const close = useCallback((reason: "dismiss" | "clicked") => {
    hideFor(reason === "clicked" ? CLICKED_DAYS : DISMISS_DAYS);
    if (reason === "dismiss") track("whatsapp_prompt_dismissed");
    setOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  // Non-blocking keyboard escape handler without stealing scroll focus
  // (focusing a fixed dialog mid-scroll caused Lenis/browser scroll jumps).
  useEffect(() => {
    if (!open) return;
    document.documentElement.setAttribute("data-wa-prompt-open", "true");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close("dismiss");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-wa-prompt-open");
    };
  }, [open, close]);

  if (excluded || !open) return null;

  const selected = TOPICS.find((item) => item.id === topic) ?? TOPICS[0];
  const href = getWhatsAppUrl(`${selected.message}${context}`);

  return (
    <aside
      ref={dialogRef}
      className={styles.dialog}
      role="dialog"
      aria-modal="false"
      aria-labelledby="wa-prompt-title"
      aria-describedby="wa-prompt-body"
      data-lenis-prevent
    >
      <button
        type="button"
        className={styles.close}
        onClick={() => close("dismiss")}
        aria-label="Close WhatsApp invitation"
      >
        <X size={18} strokeWidth={1.8} aria-hidden />
      </button>

      <p className={styles.eyebrow}>
        <span className={styles.liveDot} aria-hidden />
        DAILY GOOGLE MEET · INDIA, UAE &amp; GCC
      </p>
      <h2 id="wa-prompt-title" className={styles.title}>
        Join our daily live trading stream. Ask on WhatsApp.
      </h2>
      <p id="wa-prompt-body" className={styles.body}>
        Get straight answers on funded accounts, prop-firm rules (FundingPips,
        FTMO, Alpha Capital), or our private weekday Google Meet sessions.
      </p>

      <fieldset className={styles.topics}>
        <legend className={styles.legend}>Pick your question (1-tap reply)</legend>
        {TOPICS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.chip}
            aria-pressed={item.id === topic}
            onClick={() => {
              setTopic(item.id);
              track("whatsapp_prompt_topic", { topic: item.id });
            }}
          >
            {item.label}
          </button>
        ))}
      </fieldset>

      <WhatsAppLink
        ref={primaryRef}
        className={styles.primary}
        href={href}
        placement={`community_prompt:${selected.id}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => close("clicked")}
      >
        <MessageCircle size={20} strokeWidth={1.9} aria-hidden />
        Message MARKOS on WhatsApp
      </WhatsAppLink>

      <button
        type="button"
        className={styles.secondary}
        onClick={() => close("dismiss")}
      >
        Maybe later
      </button>

      <p className={styles.fineprint}>
        Free to ask · Real team reply · Education only — no profit promises.
      </p>
    </aside>
  );
}
