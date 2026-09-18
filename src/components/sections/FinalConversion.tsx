"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";

import styles from "./final-conversion.module.css";

const steps = [
  ["01", "STUDY.", "Understand the setup before risking capital."],
  ["02", "EXECUTE.", "Follow the plan when the market gets loud."],
  ["03", "REVIEW.", "Examine the decision—not only the result."],
  ["04", "IMPROVE.", "Bring one useful lesson into the next session."],
] as const;

export function FinalConversion() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const { gsap } = getGSAP();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const words = gsap.utils.toArray<HTMLElement>(
            "[data-final-word]",
            section,
          );
          const lockup = section.querySelector<HTMLElement>(
            "[data-final-lockup]",
          );
          const content = section.querySelector<HTMLElement>(
            "[data-final-content]",
          );
          const beam = section.querySelector<HTMLElement>("[data-final-beam]");
          if (!lockup || !content || !beam || words.length !== 4) return;

          if (conditions?.reduce) {
            gsap.set([words, lockup, content, beam], { clearProps: "all" });
            return;
          }

          const mobile = Boolean(conditions?.mobile);
          gsap.set(words, { autoAlpha: 0.38, x: mobile ? -8 : -18 });
          gsap.set(lockup, { autoAlpha: 0.08, scale: 0.96 });
          gsap.set(content, { autoAlpha: 0.68, y: 18 });
          gsap.set(beam, { scaleX: 0.12, transformOrigin: "left center" });

          if (mobile) {
            const mobileTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            });

            words.forEach((word, index) => {
              mobileTimeline.to(
                word,
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.24,
                  ease: "power2.out",
                },
                index * 0.08,
              );
            });

            mobileTimeline
              .to(words, { autoAlpha: 0.7, duration: 0.16 }, 0.38)
              .to(
                lockup,
                {
                  autoAlpha: 0.2,
                  scale: 1,
                  duration: 0.22,
                  ease: "power2.out",
                },
                0.42,
              )
              .to(beam, { scaleX: 1, duration: 0.26, ease: "none" }, 0.44)
              .to(content, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.48);

            return () => mobileTimeline.kill();
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              end: "bottom 48%",
              scrub: true,
            },
          });

          words.forEach((word, index) => {
            timeline.to(
              word,
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.2,
                ease: "power2.out",
              },
              index * 0.13,
            );
          });

          timeline
            .to(words, { autoAlpha: 0.7, duration: 0.16 }, 0.55)
            .to(
              lockup,
              {
                autoAlpha: 0.22,
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              },
              0.58,
            )
            .to(beam, { scaleX: 1, duration: 0.24, ease: "none" }, 0.6)
            .to(content, { autoAlpha: 1, y: 0, duration: 0.24 }, 0.64);

          return () => timeline.kill();
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="final-conversion-title"
      data-testid="final-conversion"
    >
      <div className={styles.beam} data-final-beam aria-hidden />
      <div className={styles.inner}>
        <div className={styles.processPanel}>
          <p className={styles.panelLabel}>THE MARCOS LOOP / EVERY SESSION</p>
          <div className={styles.verbRail}>
            {steps.map(([number, verb, description]) => (
              <article key={verb} data-final-word>
                <span>{number}</span>
                <strong>{verb}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className={styles.lockup} data-final-lockup aria-hidden>
            MARCOS.
          </p>
        </div>

        <div className={styles.content} data-final-content>
          <p className={styles.eyebrow}>MARCOS / YOUR MOVE</p>
          <h2 id="final-conversion-title" className={styles.headline}>
            <span>THE MARKET</span>
            <span>WILL KEEP MOVING.</span>
            <span>SO SHOULD</span>
            <span>YOUR PROCESS.</span>
          </h2>
          <p className={styles.copy}>
            Study deliberately. Manage risk. Review honestly. Improve with
            people doing the same.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/join" prefetch={false}>
              JOIN MARCOS — $100 <ArrowRight size={18} aria-hidden />
            </Link>
            <Link className={styles.secondary} href="#community">
              EXPLORE THE COMMUNITY
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
