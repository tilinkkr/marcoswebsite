"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { initializePostHog } from "@/lib/analytics/posthog";
import { isFundedIntentPath, POPUP_SESSION_KEY } from "@/lib/popups";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./whatsapp-community-prompt.module.css";

/*
 * Minimal split-layout course card + glassmorphic WhatsApp CTA.
 *
 * - Image on the left showing the live trading course / Google Meet desk.
 * - Zero fluff on the right: direct need headline + glassmorphic WhatsApp button
 *   with the official WhatsApp logo.
 * - Opens cleanly once the visitor starts scrolling; frequency-capped per session.
 */

const STORAGE_KEY = "markos-wa-prompt";
const SESSION_KEY = POPUP_SESSION_KEY;
const DISMISS_DAYS = 3;
const CLICKED_DAYS = 30;
const MIN_DELAY_MS = 4500;
const ENGAGED_MS = 18000;
const SCROLL_DEPTH = 0.14;
const EXCLUDED_PREFIXES = ["/admin", "/join/checkout", "/api"];

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
    // Storage may be blocked; sessionStorage still prevents repeats.
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
  const [context, setContext] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const excluded =
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    (Boolean(FEATURED_PARTNER) && isFundedIntentPath(pathname));

  const show = useCallback((trigger: string) => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Continue without session cap.
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

  const href = getWhatsAppUrl(
    `Hi MARKOS, please share today's strategy, funded-account course details and daily Google Meet timing.${context}`,
  );

  return (
    <aside
      ref={dialogRef}
      className={styles.dialog}
      role="dialog"
      aria-modal="false"
      aria-labelledby="wa-prompt-title"
      data-lenis-prevent
    >
      <div className={styles.mediaCol}>
        <Image
          src="/images/insights/daily-google-meet-live-trading-stream.jpg"
          alt="MARKOS live funded-account trading course and daily Google Meet desk"
          width={480}
          height={360}
          className={styles.mediaImg}
        />
        <span className={styles.liveTag}>
          <span className={styles.liveDot} aria-hidden />
          LIVE COURSE
        </span>
      </div>

      <div className={styles.bodyCol}>
        <button
          type="button"
          className={styles.close}
          onClick={() => close("dismiss")}
          aria-label="Close WhatsApp invitation"
        >
          <X size={14} strokeWidth={2.2} aria-hidden />
        </button>

        <h2 id="wa-prompt-title" className={styles.title}>
          Get Today&apos;s Strategy &amp; Live Desk
        </h2>

        <WhatsAppLink
          className={styles.glassBtn}
          href={href}
          placement="community_prompt_split"
          target="_blank"
          rel="noreferrer"
          onClick={() => close("clicked")}
        >
          <WhatsAppIcon size={19} className={styles.waIcon} />
          <span>WhatsApp Us</span>
        </WhatsAppLink>
      </div>
    </aside>
  );
}
