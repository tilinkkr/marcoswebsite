"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";

import styles from "./site-footer.module.css";

const groups = [
  {
    label: "EXPLORE",
    links: [
      ["HOME", "/"],
      ["JOIN MARCOS", "/join"],
      ["INDICATORS", "/indicators"],
      ["TEAM", "/team"],
    ],
  },
  {
    label: "MARCOS",
    links: [
      ["OUR STORY", "/story"],
      ["INSIGHTS", "/insights"],
      ["CONTACT", "/contact"],
      ["FAQ", "/faq"],
    ],
  },
  {
    label: "LEGAL",
    links: [
      ["PRIVACY", "/privacy"],
      ["TERMS", "/terms"],
      ["RISK DISCLOSURE", "/risk-disclosure"],
    ],
  },
];

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const { gsap } = getGSAP();
    const context = gsap.context(() => {
      const light = footer.querySelector<HTMLElement>("[data-footer-light]");
      const word = footer.querySelector<HTMLElement>("[data-footer-word]");
      if (
        !light ||
        !word ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      gsap.set(light, { backgroundPosition: "115% 50%", autoAlpha: 0.5 });
      gsap.set(word, { autoAlpha: 0.38 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });
      timeline
        .to(word, { autoAlpha: 0.52, duration: 0.25 })
        .to(
          light,
          {
            autoAlpha: 1,
            backgroundPosition: "-15% 50%",
            duration: 0.62,
            ease: "none",
          },
          0.22,
        )
        .to(word, { autoAlpha: 0.58, duration: 0.18 }, 0.78);
      return () => timeline.kill();
    }, footer);
    return () => context.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.top}>
        <p>JOIN THE FLOOR.</p>
        <Link href="/join" prefetch={false}>
          JOIN MARCOS <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>
      <div className={styles.links}>
        {groups.map((group) => (
          <nav key={group.label} aria-label={group.label}>
            <p>{group.label}</p>
            {group.links.map(([label, href]) => (
              <Link key={label} href={href} prefetch={false}>
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <p className={styles.risk}>
        Trading involves substantial risk and is not suitable for every person.
        MARCOS provides education and community—not financial advice or
        guaranteed outcomes.
      </p>
      <div className={styles.wordWrap} aria-label="MARCOS">
        <span className={styles.word} data-footer-word aria-hidden>
          MARCOS
        </span>
        <span className={styles.wordLight} data-footer-light aria-hidden>
          MARCOS
        </span>
      </div>
      <div className={styles.bottom}>
        <span>© 2026 MARCOS</span>
        <span>PROCESS OVER PROMISES.</span>
      </div>
    </footer>
  );
}
