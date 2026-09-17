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

const brandLetters = "MARCOS".split("");

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const { gsap } = getGSAP();
    const context = gsap.context(() => {
      const light = footer.querySelector<HTMLElement>("[data-footer-light]");
      const word = footer.querySelector<HTMLElement>("[data-footer-word]");
      const letters = footer.querySelectorAll<HTMLElement>("[data-footer-letter]");
      const ruler = footer.querySelector<HTMLElement>("[data-footer-ruler]");
      if (
        !light ||
        !word ||
        letters.length === 0 ||
        !ruler ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      gsap.set(letters, {
        autoAlpha: isMobile ? 0.34 : 0.18,
        yPercent: isMobile ? 12 : 30,
        rotateX: isMobile ? 0 : -18,
        transformOrigin: "50% 100%",
      });
      gsap.set(light, { backgroundPosition: "118% 50%", autoAlpha: 0 });
      gsap.set(word, { autoAlpha: 1 });
      gsap.set(ruler, { scaleX: 0, transformOrigin: "50% 50%" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 88%",
          end: "bottom bottom",
          scrub: isMobile ? 0.35 : 0.55,
        },
      });

      timeline
        .to(
          letters,
          {
            autoAlpha: isMobile ? 0.72 : 0.82,
            yPercent: 0,
            rotateX: 0,
            stagger: isMobile ? 0.025 : 0.045,
            duration: 0.52,
            ease: "power3.out",
          },
          0,
        )
        .to(
          word,
          {
            color: isMobile
              ? "rgba(232,225,215,0.28)"
              : "rgba(232,225,215,0.32)",
            textShadow:
              "0 0 2.4rem rgba(201,121,65,0.18), 0 0 4rem rgba(112,23,34,0.12)",
            duration: 0.52,
            ease: "power2.out",
          },
          0.12,
        )
        .to(ruler, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.1)
        .to(
          light,
          {
            autoAlpha: 1,
            backgroundPosition: "8% 50%",
            duration: 0.75,
            ease: "none",
          },
          0.16,
        )
        .to(
          letters,
          {
            autoAlpha: isMobile ? 0.82 : 0.9,
            duration: 0.22,
            stagger: isMobile ? 0.015 : 0.025,
          },
          0.72,
        );

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
          {brandLetters.map((letter) => (
            <span key={letter} data-footer-letter>
              {letter}
            </span>
          ))}
        </span>
        <span className={styles.wordLight} data-footer-light aria-hidden>
          MARCOS
        </span>
        <span className={styles.ruler} data-footer-ruler aria-hidden />
      </div>
      <div className={styles.bottom}>
        <span>© 2026 MARCOS</span>
        <span>PROCESS OVER PROMISES.</span>
      </div>
    </footer>
  );
}
