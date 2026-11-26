"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";

import { FEATURED_PARTNER } from "@/config/funded-partners";
import { initializePostHog } from "@/lib/analytics/posthog";
import {
  isFundedIntentPath,
  markPopupShown,
  popupAlreadyShown,
} from "@/lib/popups";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./funded-offer-prompt.module.css";

/*
 * Funded-account partner offer, shown only on pages where visitors are
 * already researching funded accounts.
 *
 * Non-blocking slide-up card (not a full-screen interstitial): the page stays
 * readable and scrollable, which keeps it within Google's guidance on
 * intrusive interstitials on mobile. Opens after engagement, once per
 * session, and is suppressed for days after a dismissal or click.
 */

const STORAGE_KEY = "markos-funded-offer";
const DISMISS_DAYS = 2;
const CLICKED_DAYS = 14;
const MIN_DELAY_MS = 8000;
const ENGAGED_MS = 18000;
const SCROLL_DEPTH = 0.3;

function hiddenUntil(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function hideFor(days: number) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + days * 86_400_000),
    );
  } catch {
    // ignore
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
      partner: FEATURED_PARTNER?.name,
      ...props,
    });
  } catch {
    // Analytics must never block the offer.
  }
}

export function FundedOfferPrompt() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const eligible = Boolean(FEATURED_PARTNER) && isFundedIntentPath(pathname);

  useEffect(() => {
    if (!eligible || open) return;
    if (navigator.webdriver) return;
    if (hiddenUntil() > Date.now() || popupAlreadyShown()) return;

    const start = performance.now();
    let fired = false;
    const fire = (trigger: string) => {
      if (fired || performance.now() - start < MIN_DELAY_MS) return;
      if (popupAlreadyShown()) return;
      fired = true;
      cleanup();
      markPopupShown();
      setOpen(true);
      track("funded_offer_shown", { trigger });
    };
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / max >= SCROLL_DEPTH) fire("scroll_depth");
    };
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") fire("time_on_page");
    }, ENGAGED_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [eligible, open, pathname]);

  const close = useCallback((reason: "dismiss" | "clicked") => {
    hideFor(reason === "clicked" ? CLICKED_DAYS : DISMISS_DAYS);
    if (reason === "dismiss") track("funded_offer_dismissed");
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.setAttribute("data-offer-open", "true");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close("dismiss");
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-offer-open");
    };
  }, [open, close]);

  if (!open || !FEATURED_PARTNER) return null;

  const whatsapp = getWhatsAppUrl(
    `Hi MARKOS, I'm thinking of taking a ${FEATURED_PARTNER.name} funded account. Can you help me choose the right challenge and prepare?`,
  );

  return (
    <aside
      className={styles.card}
      role="dialog"
      aria-modal="false"
      aria-labelledby="offer-title"
      data-lenis-prevent
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={() => close("dismiss")}
        aria-label="Close funded account offer"
      >
        <X size={16} strokeWidth={2} aria-hidden />
      </button>

      <div className={styles.badge}>
        <span className={styles.spark} aria-hidden />
        PARTNER OFFER · {FEATURED_PARTNER.name.toUpperCase()}
      </div>

      <h2 id="offer-title" className={styles.title}>
        Ready to trade a <em>funded account?</em>
      </h2>
      <p className={styles.body}>
        Start your {FEATURED_PARTNER.name} challenge through MARKOS, and get
        the community&apos;s help with your risk plan before day one.
      </p>

      <ul className={styles.points}>
        <li>Forex &amp; gold (XAUUSD) challenges</li>
        <li>Prepare with Malayali traders in Kerala &amp; the GCC</li>
      </ul>

      <a
        className={styles.primary}
        href={FEATURED_PARTNER.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => {
          track("funded_offer_click");
          close("clicked");
        }}
      >
        Take a funded account now
        <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
      </a>
      <WhatsAppLink
        className={styles.secondary}
        href={whatsapp}
        placement="funded-offer"
        target="_blank"
        rel="noreferrer"
        onClick={() => close("clicked")}
      >
        <MessageCircle size={15} strokeWidth={2} aria-hidden />
        Not sure? Ask us first on WhatsApp
      </WhatsAppLink>

      <p className={styles.fineprint}>
        Partner link. MARKOS may earn a commission. Challenges are paid
        evaluations; most traders don&apos;t pass and no payout is guaranteed.
      </p>
    </aside>
  );
}
