"use client";

import { useLayoutEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

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

    const visibleCtas = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleCtas.add(entry.target);
          else visibleCtas.delete(entry.target);
        }
        setPrimaryCtaVisible(visibleCtas.size > 0);
      },
      { threshold: 0.01 },
    );

    const updateInitialVisibility = () => {
      for (const cta of primaryCtas) {
        const bounds = cta.getBoundingClientRect();
        const isVisible =
          bounds.bottom > 0 &&
          bounds.right > 0 &&
          bounds.top < window.innerHeight &&
          bounds.left < window.innerWidth;
        if (isVisible) visibleCtas.add(cta);
      }
      setPrimaryCtaVisible(visibleCtas.size > 0);
    };

    updateInitialVisibility();
    primaryCtas.forEach((cta) => observer.observe(cta));
    return () => observer.disconnect();
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
      <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
      <span>WHATSAPP</span>
    </WhatsAppLink>
  );
}
