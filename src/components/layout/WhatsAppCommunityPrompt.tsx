"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, ShieldCheck, X } from "lucide-react";

import { FEATURED_PARTNER } from "@/config/funded-partners";
import { initializePostHog } from "@/lib/analytics/posthog";
import { isFundedIntentPath, POPUP_SESSION_KEY } from "@/lib/popups";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./whatsapp-community-prompt.module.css";

/*
 * Engagement-triggered WhatsApp & Funded-Account Mentor invitation.
 *
 * - Never on arrival: opens only after genuine scroll depth, time on page,
 *   or desktop exit intent so it stays Google-compliant and non-intrusive.
 * - Frequency-capped per browser: once per session; hidden for 3 days after
 *   dismissal and 30 days after a click.
 * - Uses a clean 2-column grid of high-intent cards so visitors pick their
 *   exact goal in one tap without feeling spammed.
 */

const STORAGE_KEY = "markos-wa-prompt";
const SESSION_KEY = POPUP_SESSION_KEY;
const DISMISS_DAYS = 3;
const CLICKED_DAYS = 30;
const MIN_DELAY_MS = 9000;
const ENGAGED_MS = 28000;
const SCROLL_DEPTH = 0.42;
const EXCLUDED_PREFIXES = ["/admin", "/join/checkout", "/api"];

const TOPICS = [
  {
    id: "partner",
    kicker: "OUR PARTNER LINK",
    label: "Start a funded account",
    message:
      "Hi MARKOS, I want to open a funded account using your verified partner link and get mentor guidance on drawdown rules.",
  },
  {
    id: "pass-1m",
    kicker: "MENTOR SUPPORT",
    label: "1-month passing plan",
    message:
      "Hi MARKOS, I need structured mentor support and a 1-month risk plan to pass my funded account honestly.",
  },
  {
    id: "gmeet",
    kicker: "LIVE DAILY STREAM",
    label: "Google Meet trading desk",
    message:
      "Hi MARKOS, how do I join your daily private Google Meet live trading stream for passing funded accounts?",
  },
  {
    id: "nasdaq",
    kicker: "FUTURES & GOLD",
    label: "NASDAQ (MNQ) & XAUUSD",
    message:
      "Hi MARKOS, I trade NASDAQ (MNQ/NQ), futures, or XAUUSD from India/GCC/UK/USA. Can you share your session timings?",
  },
  {
    id: "kerala",
    kicker: "MALAYALAM GROUP",
    label: "Kerala WhatsApp desk",
    message:
      "Hi MARKOS, I'm looking for the Kerala Malayalam forex & funded-account WhatsApp community. How can I join?",
  },
  {
    id: "global",
    kicker: "INDIA · GCC · UK · USA",
    label: "Safest prop firm rules",
    message:
      "Hi MARKOS, I'm comparing BrightFunded, FundingPips, FTMO & Alpha Capital from my region. Which rules should I check first?",
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
  const [topic, setTopic] = useState<TopicId>("partner");
  const [context, setContext] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (excluded || open) return;
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
      <div className={styles.topBar}>
        <p className={styles.eyebrow}>
          <span className={styles.liveDot} aria-hidden />
          MARKOS LIVE DESK · INDIA · KERALA · GCC · UK · USA
        </p>
        <button
          type="button"
          className={styles.close}
          onClick={() => close("dismiss")}
          aria-label="Close WhatsApp invitation"
        >
          <X size={16} strokeWidth={1.9} aria-hidden />
        </button>
      </div>

      <h2 id="wa-prompt-title" className={styles.title}>
        Pass your funded account with a real mentor desk.
      </h2>
      <p id="wa-prompt-body" className={styles.body}>
        Pick what you need below and message our team directly on WhatsApp — or
        start your funded account through our verified partner link.
      </p>

      <fieldset className={styles.topics}>
        <legend className={styles.legend}>
          CHOOSE YOUR GOAL (PREFILLS WHATSAPP)
        </legend>
        <div className={styles.topicGrid}>
          {TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.topicCard}
              aria-pressed={item.id === topic}
              onClick={() => {
                setTopic(item.id);
                track("whatsapp_prompt_topic", { topic: item.id });
              }}
            >
              <span className={styles.topicKicker}>{item.kicker}</span>
              <strong className={styles.topicLabel}>{item.label}</strong>
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <WhatsAppLink
          ref={primaryRef}
          className={styles.primary}
          href={href}
          placement={`community_prompt:${selected.id}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => close("clicked")}
        >
          <MessageCircle size={18} strokeWidth={2} aria-hidden />
          <span>Message Mentor on WhatsApp</span>
          <ArrowUpRight size={15} aria-hidden />
        </WhatsAppLink>

        {FEATURED_PARTNER ? (
          <a
            className={styles.partnerAction}
            href={FEATURED_PARTNER.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => {
              track("whatsapp_prompt_partner_click", {
                partner: FEATURED_PARTNER?.name ?? "partner",
              });
              close("clicked");
            }}
          >
            <ShieldCheck size={16} strokeWidth={1.9} aria-hidden />
            <span>
              Start Funded Account ({FEATURED_PARTNER.name}) — Our Link
            </span>
            <ArrowUpRight size={14} aria-hidden />
          </a>
        ) : null}
      </div>

      <div className={styles.footerRow}>
        <p className={styles.fineprint}>
          Free to ask · +91 91875 87488 · Disclosed partner link · Education
          only.
        </p>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => close("dismiss")}
        >
          Later
        </button>
      </div>
    </aside>
  );
}
