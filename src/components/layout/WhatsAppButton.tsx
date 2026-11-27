"use client";

import { useLayoutEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./whatsapp-button.module.css";

export function WhatsAppButton() {
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(false);
  const href = getWhatsAppUrl(
    "Hi MARKOS, I'd like details about membership, education and pricing.",
  );

  useLayoutEffect(() => {
    const primaryCtas = Array.from(
      document.querySelectorAll<HTMLElement>("[data-whatsapp-primary]"),
    );
    if (!primaryCtas.length || !("IntersectionObserver" in window)) return;

    const isActuallyVisible = (el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.1) {
        return false;
      }
      const bounds = el.getBoundingClientRect();
      return (
        bounds.width > 0 &&
        bounds.height > 0 &&
        bounds.bottom > 0 &&
        bounds.right > 0 &&
        bounds.top < window.innerHeight &&
        bounds.left < window.innerWidth
      );
    };

    const refresh = () => {
      setPrimaryCtaVisible(primaryCtas.some(isActuallyVisible));
    };

    const observer = new IntersectionObserver(refresh, { threshold: 0.01 });
    refresh();
    primaryCtas.forEach((cta) => observer.observe(cta));
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return (
    <WhatsAppLink
      className={styles.button}
      data-suppressed={primaryCtaVisible || undefined}
      aria-hidden={primaryCtaVisible || undefined}
      tabIndex={primaryCtaVisible ? -1 : undefined}
      href={href}
      placement="floating"
      target="_blank"
      rel="noreferrer"
      aria-label="Message MARKOS on WhatsApp"
    >
      <WhatsAppIcon size={19} />
      <span>WHATSAPP</span>
    </WhatsAppLink>
  );
}
