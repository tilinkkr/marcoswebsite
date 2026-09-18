"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";

import styles from "./marcos-method.module.css";

const principles = [
  {
    number: "01",
    phase: "PLAN",
    title: "READ THE SESSION",
    description:
      "Start with market context, important levels, invalidation and a defined amount of risk before execution begins.",
    outcome: "A CLEAR SESSION PLAN",
  },
  {
    number: "02",
    phase: "WATCH",
    title: "SEE DECISIONS LIVE",
    description:
      "Watch our Tradovate screen on Kick and hear entries, exits, stops and market decisions explained as they happen.",
    outcome: "REAL-TIME CONTEXT",
  },
  {
    number: "03",
    phase: "REVIEW",
    title: "BREAK DOWN EXECUTION",
    description:
      "Study what followed the plan, what changed under pressure and which decisions deserve another look with the community.",
    outcome: "HONEST FEEDBACK",
  },
  {
    number: "04",
    phase: "REFINE",
    title: "RETURN BETTER",
    description:
      "Carry the useful lesson into the next session and keep repeating the loop until discipline becomes your default.",
    outcome: "A STRONGER PROCESS",
  },
];

export function MarcosMethod() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const { gsap } = getGSAP();
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-method-card]",
        section,
      );
      const line = section.querySelector<HTMLElement>("[data-method-line]");
      if (!line || cards.length === 0) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([cards, line], { clearProps: "all" });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      gsap.set(cards, { autoAlpha: 0.42, y: 24 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      if (isMobile) {
        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        mobileTimeline.to(line, { scaleX: 1, duration: 0.45, ease: "none" }).to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.12,
        );

        return () => mobileTimeline.kill();
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 74%",
          end: "bottom 56%",
          scrub: true,
        },
      });

      timeline.to(line, { scaleX: 1, duration: 0.3, ease: "none" }).to(
        cards,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.1,
          ease: "power2.out",
        },
        0.08,
      );

      return () => timeline.kill();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="marcos-method-title"
      data-testid="marcos-method"
    >
      <div className={styles.redField} aria-hidden />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>THE MARCOS METHOD</p>
            <h2 id="marcos-method-title" className={styles.headline}>
              <span>ONE SESSION.</span>
              <span>ONE REPEATABLE LOOP.</span>
            </h2>
          </div>
          <div className={styles.introduction}>
            <p>
              MARCOS turns a trading day into a process you can understand,
              observe, review and improve—not a signal to copy.
            </p>
            <p className={styles.loop}>PLAN / WATCH / REVIEW / REFINE</p>
          </div>
        </header>

        <div className={styles.progressLine} data-method-line aria-hidden />
        <div className={styles.grid}>
          {principles.map((principle) => (
            <article
              className={styles.principle}
              key={principle.number}
              data-method-card
            >
              <div className={styles.cardTopline}>
                <span>{principle.number}</span>
                <span>{principle.phase}</span>
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
              <p className={styles.outcome}>{principle.outcome}</p>
            </article>
          ))}
        </div>

        <div className={styles.footerRow}>
          <p>THE LOOP REPEATS. THE PROCESS GETS SHARPER.</p>
          <Link className={styles.cta} href="/method" prefetch={false}>
            EXPLORE THE MARCOS METHOD{" "}
            <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
