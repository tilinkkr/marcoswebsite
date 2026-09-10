"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";

import styles from "./team-system.module.css";

const streams = [
  ["RAHUL / FOUNDER", "VISION / DIRECTION / STANDARD", styles.vision],
  ["LINU / CEO", "OPERATIONS / COMMUNITY / EXECUTION", styles.operations],
  ["TILIN / CTO", "TECHNOLOGY / INFRASTRUCTURE / PRODUCT", styles.tech],
  ["SAHAL / TRADER + CREATOR", "TRADING / EDUCATION / CONTENT", styles.market],
] as const;

export function TeamSystem() {
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
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-team-stream]",
            section,
          );
          const core = section.querySelector<HTMLElement>("[data-team-core]");
          const reveal =
            section.querySelector<HTMLElement>("[data-team-reveal]");
          const background =
            section.querySelector<HTMLElement>("[data-team-bg]");
          if (!core || !reveal || !background || items.length !== 4) return;
          if (conditions?.reduce) {
            gsap.set([...items, core, reveal], { clearProps: "all" });
            return;
          }
          const mobile = Boolean(conditions?.mobile);
          gsap.set(items, {
            autoAlpha: 0,
            scaleX: mobile ? 1 : 0.2,
            y: mobile ? 28 : 0,
          });
          if (!mobile)
            items.forEach((item, index) =>
              gsap.set(item, { x: index % 2 === 0 ? -140 : 140 }),
            );
          gsap.set(core, { autoAlpha: 0, scale: 0.82 });
          gsap.set(reveal, { autoAlpha: 0, y: 18 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: mobile ? true : 0.7,
              invalidateOnRefresh: true,
            },
          });
          items.forEach((item, index) =>
            tl.to(
              item,
              {
                autoAlpha: 1,
                scaleX: 1,
                y: 0,
                duration: 0.18,
                ease: "power1.out",
              },
              0.1 + index * 0.09,
            ),
          );
          tl.to(
            items,
            {
              x: 0,
              y: 0,
              scale: mobile ? 0.96 : 1.03,
              duration: 0.2,
              ease: "power1.inOut",
            },
            0.53,
          )
            .to(core, { autoAlpha: 1, scale: 1, duration: 0.18 }, 0.57)
            .to(
              background,
              { scale: 1.035, duration: 0.35, ease: "none" },
              0.52,
            )
            .to(reveal, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.72)
            .to(items, { autoAlpha: 0.34, duration: 0.14 }, 0.75);
          return () => tl.kill();
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
      className={styles.sequence}
      aria-label="One desk, four functions, one system"
    >
      <div className={styles.stage}>
        <Image
          data-team-bg
          className={`${styles.bg} ${styles.desktopBg}`}
          src="/images/marcos/team/team-system-desktop.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <Image
          className={`${styles.bg} ${styles.mobileBg}`}
          src="/images/marcos/team/team-system-mobile.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.shade} />
        <p className={styles.kicker}>ONE DESK. FOUR FUNCTIONS. ONE SYSTEM.</p>
        <div className={styles.streams}>
          {streams.map(([name, meta, className]) => (
            <article
              key={name}
              data-team-stream
              className={`${styles.stream} ${className}`}
            >
              <span>{name}</span>
              <small>{meta}</small>
            </article>
          ))}
        </div>
        <div data-team-core className={styles.core}>
          <span>MARCOS</span>
        </div>
        <div data-team-reveal className={styles.reveal}>
          <p>DIFFERENT ROLES.</p>
          <strong>ONE STANDARD.</strong>
        </div>
      </div>
    </section>
  );
}
