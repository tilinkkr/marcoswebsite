"use client";

import Image from "next/image";
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
 * Scroll-triggered visual WhatsApp & Funded-Account Mentor card.
 *
 * - Opens cleanly once a visitor starts scrolling (never blocking arrival).
 * - Image-led with minimal, direct-to-the-point copy and 1-tap WhatsApp action.
 * - Frequency-capped per browser: once per session; hidden for 3 days after
 *   dismissal and 30 days after a click.
 */

const STORAGE_KEY = "markos-wa-prompt";
const SESSION_KEY = POPUP_SESSION_KEY;
const DISMISS_DAYS = 3;
const CLICKED_DAYS = 30;
const MIN_DELAY_MS = 4500;
const ENGAGED_MS = 18000;
const SCROLL_DEPTH = 0.14;
const EXCLUDED_PREFIXES = ["/admin", "/join/checkout", "/api"];

const TOPICS = [
  {
    id: "partner",
    label: "Best Funded Broker",
    message:
      "Hi MARKOS, I want to start a funded account using your verified partner link and check rules first.",
  },
  {
    id: "gmeet",
    label: "Daily Google Meet",
    message:
      "Hi MARKOS, how do I join your daily private Google Meet live trading stream?",
  },
  {
    id: "kerala-gcc",
    label: "Kerala & GCC Mallus",
    message:
      "Hi MARKOS, I'm a Malayali trader from Kerala / GCC and want to join your Malayalam & English WhatsApp community.",
  },
  {
    id: "pass-1m",
    label: "Pass in 1 Month Plan",
    message:
      "Hi MARKOS, I want mentor support and a 0.5% risk plan to pass my funded account cleanly.",
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
  return ` (Reading: "${heading.slice(0, 80)}")`;
}

export function WhatsAppCommunityPrompt() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<TopicId>("gmeet");
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
      if (window.scrollY > 360 || window.scrollY / max >= SCROLL_DEPTH) {
        fire("scroll_start");
      }
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
      <div className={styles.mediaWrap}>
        <Image
          src="/images/insights/daily-google-meet-live-trading-stream.jpg"
          alt="MARKOS live Google Meet trading desk for India, Kerala and GCC traders"
          width={640}
          height={360}
          className={styles.mediaImg}
        />
        <div className={styles.mediaOverlay} aria-hidden />
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} aria-hidden />
          LIVE DESK · KERALA · INDIA · GCC
        </span>
        <button
          type="button"
          className={styles.close}
          onClick={() => close("dismiss")}
          aria-label="Close WhatsApp invitation"
        >
          <X size={15} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className={styles.content}>
        <h2 id="wa-prompt-title" className={styles.title}>
          Trade with a live desk. Ask on WhatsApp.
        </h2>
        <p id="wa-prompt-body" className={styles.body}>
          Daily Google Meet streams for Kerala, India &amp; GCC traders. Pick a
          topic and tap below.
        </p>

        <div className={styles.topicGrid} role="group" aria-label="Quick topic">
          {TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.topicBtn}
              aria-pressed={item.id === topic}
              onClick={() => {
                setTopic(item.id);
                track("whatsapp_prompt_topic", { topic: item.id });
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

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
            <MessageCircle size={17} strokeWidth={2.1} aria-hidden />
            <span>Message MARKOS on WhatsApp</span>
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
              <ShieldCheck size={15} strokeWidth={2} aria-hidden />
              <span>Start Funded Account ({FEATURED_PARTNER.name})</span>
              <ArrowUpRight size={14} aria-hidden />
            </a>
          ) : null}
        </div>

        <div className={styles.footerRow}>
          <p className={styles.fineprint}>
            +91 91875 87488 · Free to ask · Disclosed partner link.
          </p>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => close("dismiss")}
          >
            Later
          </button>
        </div>
      </div>
    </aside>
  );
}
