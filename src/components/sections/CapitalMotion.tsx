"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FEATURED_PARTNER } from "@/config/funded-partners";
import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./capital-motion.module.css";

const CapitalNotesCanvas = dynamic(
  () => import("@/components/three/CapitalNotesCanvas"),
  { ssr: false, loading: () => null },
);

const ASSET_ROOT = "/images/marcos/capital-motion";

type CapitalNoteProps = {
  className: string;
  file: string;
  name: string;
  preload?: boolean;
  width?: number;
  height?: number;
};

function CapitalNote({
  className,
  file,
  name,
  preload = false,
  width = 920,
  height = 620,
}: CapitalNoteProps) {
  return (
    <div className={`${styles.note} ${className}`} data-capital-note={name}>
      <Image
        src={`${ASSET_ROOT}/${file}`}
        alt=""
        width={width}
        height={height}
        sizes="(max-width: 767px) 72vw, 44vw"
        preload={preload}
        unoptimized
        aria-hidden
      />
    </div>
  );
}

export function CapitalMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef(0);
  const { isLowPower, reducedMotion } = useAnimationPreferences();
  const [mountWebGL, setMountWebGL] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const handleWebGLReady = useCallback(() => {
    setWebglReady(true);
  }, []);

  // Lazily activate the Three.js 3D note canvas only on desktop when the
  // section nears the viewport so mobile & initial FCP stay ultra-fast.
  useEffect(() => {
    if (isLowPower || reducedMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMountWebGL(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isLowPower, reducedMotion]);

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
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const mobile = Boolean(conditions?.mobile);
          const reduceMotion = Boolean(conditions?.reduceMotion);
          const background = section.querySelector<HTMLElement>(
            "[data-capital-background]",
          );
          const redLight =
            section.querySelector<HTMLElement>("[data-capital-red]");
          const farOne = section.querySelector<HTMLElement>(
            '[data-capital-note="far-01"]',
          );
          const farTwo = section.querySelector<HTMLElement>(
            '[data-capital-note="far-02"]',
          );
          const midOne = section.querySelector<HTMLElement>(
            '[data-capital-note="mid-01"]',
          );
          const midTwo = section.querySelector<HTMLElement>(
            '[data-capital-note="mid-02"]',
          );
          const heroOne = section.querySelector<HTMLElement>(
            '[data-capital-note="hero-01"]',
          );
          const heroTwo = section.querySelector<HTMLElement>(
            '[data-capital-note="hero-02"]',
          );
          const transition = section.querySelector<HTMLElement>(
            '[data-capital-note="transition"]',
          );
          const eyebrow = section.querySelector<HTMLElement>(
            "[data-capital-eyebrow]",
          );
          const allLines = gsap.utils.toArray<HTMLElement>(
            "[data-capital-line]",
            section,
          );
          const lines = mobile
            ? [allLines[4], allLines[5], allLines[6], allLines[6]]
            : allLines.slice(0, 4);
          const body = section.querySelector<HTMLElement>(
            "[data-capital-body]",
          );
          const meta = section.querySelector<HTMLElement>(
            "[data-capital-meta]",
          );
          const cta = section.querySelector<HTMLElement>("[data-capital-cta]");
          const ghost = section.querySelector<HTMLElement>(
            "[data-capital-ghost]",
          );
          const attraction = section.querySelector<HTMLElement>(
            '[data-capital-phase="attraction"]',
          );
          const pressure = section.querySelector<HTMLElement>(
            '[data-capital-phase="pressure"]',
          );

          if (
            !background ||
            !redLight ||
            !farOne ||
            !farTwo ||
            !midOne ||
            !midTwo ||
            !heroOne ||
            !heroTwo ||
            !transition ||
            !eyebrow ||
            lines.length === 0 ||
            !body ||
            !meta ||
            !cta ||
            !ghost ||
            !attraction ||
            !pressure
          ) {
            return;
          }

          const notes = [farOne, farTwo, midOne, midTwo, heroOne, heroTwo];

          if (reduceMotion) {
            gsap.set(
              [
                background,
                redLight,
                heroOne,
                eyebrow,
                lines,
                body,
                meta,
                cta,
                ghost,
                attraction,
                pressure,
              ],
              {
                clearProps: "all",
              },
            );
            gsap.set([farOne, farTwo, midOne, midTwo, heroTwo, transition], {
              display: "none",
            });
            gsap.set([attraction, pressure], { display: "none" });
            return;
          }

          if (mobile) {
            const mobileNotes = [midOne, midTwo, heroOne];

            gsap.set([farOne, farTwo, heroTwo], { display: "none" });
            gsap.set(background, { autoAlpha: 0.58, scale: 1.02 });
            gsap.set(redLight, { autoAlpha: 0.32, scale: 1, xPercent: 0 });
            gsap.set(midOne, {
              autoAlpha: 0.6,
              xPercent: 16,
              yPercent: 8,
              scale: 0.9,
              rotationZ: -8,
              force3D: true,
            });
            gsap.set(midTwo, {
              autoAlpha: 0.54,
              xPercent: -14,
              yPercent: -8,
              scale: 0.84,
              rotationZ: 11,
              force3D: true,
            });
            gsap.set(heroOne, {
              autoAlpha: 0.72,
              xPercent: 7,
              yPercent: -6,
              scale: 1.06,
              rotationZ: -7,
              force3D: true,
            });
            gsap.set(transition, {
              display: "none",
            });
            gsap.set([eyebrow, body, meta, cta], { autoAlpha: 1, y: 0 });
            gsap.set(lines, { yPercent: 0, rotateX: 0, autoAlpha: 1 });
            gsap.set(ghost, { autoAlpha: 0.045, xPercent: 0 });
            gsap.set([attraction, pressure], { display: "none" });

            const mobileTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            });

            mobileTimeline.fromTo(
              [background, redLight, ...mobileNotes, ghost],
              { y: 18 },
              {
                y: 0,
                duration: 0.7,
                stagger: 0.04,
                ease: "power2.out",
              },
            );

            return () => mobileTimeline.kill();
          }

          gsap.set(background, { autoAlpha: 0.62, scale: 1 });
          gsap.set(redLight, { autoAlpha: 0.22, scale: 0.96, xPercent: 6 });
          gsap.set(notes, { autoAlpha: 0, force3D: true });
          gsap.set(transition, {
            autoAlpha: 0.78,
            xPercent: 34,
            yPercent: -48,
            scale: 0.94,
            rotationZ: 11,
            force3D: true,
          });
          // Copy stays readable at every scrub position; only the artwork
          // moves, so a fast scroll never strands a half-revealed headline.
          gsap.set([eyebrow, body, meta, cta], { autoAlpha: 1, y: 0 });
          gsap.set(lines, { yPercent: 0, rotateX: 0, autoAlpha: 1 });
          gsap.set(ghost, { autoAlpha: 0, xPercent: -2 });
          gsap.set(attraction, { autoAlpha: 1, y: 0 });
          gsap.set(pressure, { autoAlpha: 0, y: 12 });

          // One forward sequence over a 0–1 timeline. Each note is owned by
          // one tween per phase and phases never overlap, so nothing is
          // pulled in two directions at once. Sine easing keeps scrubbed
          // motion continuous instead of snapping at phase boundaries.
          const timeline = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              // A short catch-up smooths wheel steps when Lenis is off
              // (low-power devices) and is imperceptible when it is on.
              scrub: 0.35,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                scrollProgressRef.current = self.progress;
              },
            },
          });

          timeline
            // 0.00: the hand-off note from the hero clears, notes arrive.
            .to(
              transition,
              {
                xPercent: 8,
                yPercent: -14,
                scale: 1.18,
                autoAlpha: 0,
                duration: 0.14,
                ease: "sine.out",
              },
              0,
            )
            .to(background, { autoAlpha: 0.8, duration: 0.14 }, 0)
            .to(redLight, { autoAlpha: 0.45, scale: 1, duration: 0.2 }, 0)
            .fromTo(
              farOne,
              { autoAlpha: 0, scale: 0.62, xPercent: 18, yPercent: 4 },
              {
                autoAlpha: 0.6,
                scale: 0.72,
                xPercent: 10,
                yPercent: -6,
                duration: 0.14,
              },
              0.02,
            )
            .fromTo(
              farTwo,
              { autoAlpha: 0, scale: 0.5, xPercent: -2 },
              { autoAlpha: 0.5, scale: 0.6, xPercent: -8, duration: 0.14 },
              0.05,
            )
            .fromTo(
              midOne,
              { autoAlpha: 0, scale: 0.74, yPercent: 10 },
              { autoAlpha: 0.82, scale: 0.84, yPercent: 0, duration: 0.16 },
              0.06,
            )
            .fromTo(
              midTwo,
              { autoAlpha: 0, scale: 0.68, yPercent: -8 },
              { autoAlpha: 0.76, scale: 0.78, yPercent: 0, duration: 0.16 },
              0.09,
            )
            .fromTo(
              heroOne,
              { autoAlpha: 0, scale: 0.82, yPercent: 8 },
              { autoAlpha: 0.94, scale: 0.92, yPercent: 0, duration: 0.18 },
              0.1,
            )
            .fromTo(
              heroTwo,
              { autoAlpha: 0, scale: 0.74, yPercent: -6 },
              { autoAlpha: 0.86, scale: 0.84, yPercent: 0, duration: 0.18 },
              0.13,
            )
            // 0.31: the field drifts and rotates; phase copy swaps.
            .to(attraction, { autoAlpha: 0, y: -10, duration: 0.06 }, 0.36)
            .to(pressure, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.4)
            .to(
              farOne,
              {
                xPercent: -24,
                yPercent: -22,
                scale: 0.98,
                rotationZ: 13,
                duration: 0.33,
              },
              0.31,
            )
            .to(
              farTwo,
              {
                xPercent: 26,
                yPercent: 20,
                scale: 0.84,
                rotationZ: -16,
                duration: 0.33,
              },
              0.31,
            )
            .to(
              midOne,
              {
                xPercent: 26,
                yPercent: -26,
                scale: 1.12,
                rotationZ: -6,
                rotationY: -14,
                duration: 0.33,
              },
              0.31,
            )
            .to(
              midTwo,
              {
                xPercent: -30,
                yPercent: 22,
                scale: 1.18,
                rotationZ: 24,
                duration: 0.33,
              },
              0.31,
            )
            .to(
              heroTwo,
              {
                xPercent: 22,
                yPercent: -18,
                scale: 1.12,
                rotationZ: -8,
                duration: 0.33,
              },
              0.31,
            )
            .to(
              heroOne,
              {
                xPercent: -10,
                yPercent: 8,
                scale: 1.06,
                rotationZ: 5,
                rotationY: -8,
                duration: 0.33,
              },
              0.31,
            )
            .to(background, { scale: 1.05, duration: 0.5 }, 0.31)
            .to(
              redLight,
              { autoAlpha: 0.75, scale: 1.05, xPercent: 0, duration: 0.3 },
              0.4,
            )
            // 0.64: the outer notes fly past the camera and clear.
            .to(
              [farOne, farTwo],
              { autoAlpha: 0, scale: 1.25, duration: 0.14, ease: "sine.in" },
              0.64,
            )
            .to(
              midOne,
              {
                xPercent: 58,
                yPercent: -42,
                scale: 1.5,
                autoAlpha: 0,
                duration: 0.16,
                ease: "sine.in",
              },
              0.64,
            )
            .to(
              midTwo,
              {
                xPercent: -58,
                yPercent: 40,
                scale: 1.55,
                autoAlpha: 0,
                duration: 0.16,
                ease: "sine.in",
              },
              0.66,
            )
            .to(
              heroTwo,
              {
                xPercent: 50,
                yPercent: -34,
                scale: 1.6,
                autoAlpha: 0,
                duration: 0.16,
                ease: "sine.in",
              },
              0.68,
            )
            .to(pressure, { autoAlpha: 0, y: -10, duration: 0.06 }, 0.7)
            // 0.70: the hero note settles as the final image, so the
            // section ends on a composed frame instead of an empty one.
            .to(
              heroOne,
              {
                xPercent: 26,
                yPercent: -10,
                scale: 1.18,
                rotationZ: 9,
                rotationY: -4,
                autoAlpha: 0.7,
                duration: 0.24,
              },
              0.7,
            )
            .to(ghost, { autoAlpha: 0.06, xPercent: 0, duration: 0.14 }, 0.74)
            .to(
              redLight,
              { autoAlpha: 0.85, scale: 1.075, duration: 0.2 },
              0.76,
            )
            .to(background, { scale: 1.07, duration: 0.2 }, 0.8);

          return () => timeline.kill();
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [isLowPower]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="capital-motion-title"
      data-testid="capital-motion"
    >
      <div className={styles.stage}>
        <div
          className={styles.background}
          data-capital-background
          aria-hidden
        />
        <div className={styles.redLight} data-capital-red aria-hidden>
          <Image
            src={`${ASSET_ROOT}/red-atmosphere.webp`}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.backgroundImage}
          />
        </div>
        {mountWebGL ? (
          <div className={styles.webglLayer} aria-hidden>
            <CapitalNotesCanvas
              scrollProgressRef={scrollProgressRef}
              onReady={handleWebGLReady}
            />
          </div>
        ) : null}
        <div
          className={`${styles.depthField} ${webglReady ? styles.depthFieldHidden : ""}`}
          aria-hidden
        >
          <CapitalNote
            className={styles.farOne}
            file="note-far-01.webp"
            name="far-01"
          />
          <CapitalNote
            className={styles.farTwo}
            file="note-far-02.webp"
            name="far-02"
          />
          <CapitalNote
            className={styles.midOne}
            file="note-mid-01.webp"
            name="mid-01"
          />
          <CapitalNote
            className={styles.midTwo}
            file="note-mid-02.webp"
            name="mid-02"
          />
          <CapitalNote
            className={styles.heroOne}
            file="note-hero-01.webp"
            name="hero-01"
            width={1280}
            height={760}
          />
          <CapitalNote
            className={styles.heroTwo}
            file="note-hero-02.webp"
            name="hero-02"
            width={1280}
            height={760}
          />
        </div>

        <div className={styles.phaseRail} aria-live="off">
          <article data-capital-phase="attraction">
            <span>01 / ATTRACTION</span>
            <p>Capital gets attention. Process decides what survives.</p>
          </article>
          <article data-capital-phase="pressure">
            <span>02 / PRESSURE</span>
            <p>When speed increases, risk discipline becomes the edge.</p>
          </article>
        </div>

        <p className={styles.ghostWord} data-capital-ghost aria-hidden>
          CONTROL
        </p>

        <div className={styles.copy}>
          <p className={styles.eyebrow} data-capital-eyebrow>
            MARKOS / DISCIPLINE OVER IMPULSE
          </p>
          <h2
            id="capital-motion-title"
            className={styles.headline}
            aria-label="Capital is easy to chase. Control is harder."
          >
            <span className={`${styles.lineMask} ${styles.desktopLine}`}>
              <span data-capital-line>CAPITAL IS EASY</span>
            </span>
            <span className={`${styles.lineMask} ${styles.desktopLine}`}>
              <span data-capital-line>TO CHASE.</span>
            </span>
            <span className={`${styles.lineMask} ${styles.desktopLine}`}>
              <span data-capital-line>CONTROL IS</span>
            </span>
            <span className={`${styles.lineMask} ${styles.desktopLine}`}>
              <span data-capital-line>HARDER.</span>
            </span>
            <span className={`${styles.lineMask} ${styles.mobileLine}`}>
              <span data-capital-line>DON&apos;T CHASE</span>
            </span>
            <span className={`${styles.lineMask} ${styles.mobileLine}`}>
              <span data-capital-line>CAPITAL.</span>
            </span>
            <span className={`${styles.lineMask} ${styles.mobileLine}`}>
              <span data-capital-line>CONTROL IT.</span>
            </span>
          </h2>
          <div className={styles.body} data-capital-body>
            <p>
              <strong>How MARKOS helps you pass funded accounts:</strong> daily
              live Google Meet execution rooms, 0.5% fixed-risk rules, and
              1-on-1 mentor review, built for Forex, Gold (XAUUSD) &amp;
              NASDAQ (MNQ) traders.
            </p>
            <p>
              Start a verified evaluation through our partner link or join our
              $100 founding pass so you never risk challenge fees blind.
            </p>
          </div>
          <p className={styles.meta} data-capital-meta>
            PARTNER LINK / DAILY GMEET / MENTOR SUPPORT / 0.5% RISK DISCIPLINE
          </p>
          <div className={styles.ctaGroup} data-capital-cta>
            {FEATURED_PARTNER ? (
              <a
                className={styles.partnerCta}
                href={FEATURED_PARTNER.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()}){" "}
                <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden />
              </a>
            ) : null}
            <Link className={styles.cta} href="/join" prefetch={false}>
              SEE $100 FOUNDING PLAN{" "}
              <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden />
            </Link>
          </div>
          {FEATURED_PARTNER ? (
            <p className={styles.partnerNote}>
              Disclosed partner link · MARKOS may earn a commission at zero
              extra cost to you.
            </p>
          ) : null}
        </div>

        <CapitalNote
          className={styles.transitionNote}
          file="note-transition.webp"
          name="transition"
          width={1280}
          height={720}
        />
        <div className={styles.grain} aria-hidden />
      </div>
    </section>
  );
}
