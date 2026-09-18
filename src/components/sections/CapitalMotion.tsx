"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./capital-motion.module.css";

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
  const { isLowPower } = useAnimationPreferences();

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

          gsap.set(background, { autoAlpha: 0.22, scale: 1 });
          gsap.set(redLight, { autoAlpha: 0, scale: 0.94, xPercent: 8 });
          gsap.set(notes, { autoAlpha: 0, force3D: true });
          gsap.set(transition, {
            autoAlpha: 0.78,
            xPercent: 34,
            yPercent: -48,
            scale: 0.94,
            rotationZ: 11,
            rotationX: -4,
            rotationY: 14,
            force3D: true,
          });
          gsap.set([eyebrow, body, meta, cta], { autoAlpha: 0, y: 20 });
          gsap.set(lines, { yPercent: 112, rotateX: 5, autoAlpha: 1 });
          gsap.set(ghost, { autoAlpha: 0, xPercent: -2 });
          gsap.set(attraction, { autoAlpha: 1, y: 0 });
          gsap.set(pressure, { autoAlpha: 0, y: 12 });

          const timeline = gsap.timeline({
            defaults: { ease: "power1.inOut" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel("handoff", 0)
            .to(
              transition,
              {
                xPercent: 2,
                yPercent: -8,
                scale: 1.24,
                autoAlpha: 0,
                duration: 0.16,
                ease: "power1.out",
              },
              "handoff",
            )
            .to(
              background,
              { autoAlpha: 0.64, scale: 1.012, duration: 0.09 },
              "handoff",
            )
            .addLabel("arrival", 0.04)
            .to(
              farOne,
              {
                autoAlpha: 0.54,
                scale: 0.7,
                xPercent: 12,
                yPercent: -8,
                duration: 0.15,
              },
              "arrival",
            )
            .to(
              farTwo,
              {
                autoAlpha: mobile ? 0 : 0.42,
                scale: 0.58,
                xPercent: -8,
                duration: 0.15,
              },
              "arrival+=0.055",
            )
            .addLabel("suspension", 0.12)
            .to(
              midOne,
              { autoAlpha: 0.78, scale: 0.82, duration: 0.16 },
              "suspension",
            )
            .to(
              midTwo,
              { autoAlpha: 0.72, scale: 0.76, duration: 0.16 },
              "suspension+=0.035",
            )
            .to(
              heroOne,
              { autoAlpha: 0.94, scale: 0.9, duration: 0.18 },
              "suspension+=0.085",
            )
            .to(
              heroTwo,
              { autoAlpha: mobile ? 0 : 0.84, scale: 0.82, duration: 0.18 },
              "suspension+=0.11",
            )
            .addLabel("rotation", 0.22)
            .to(
              attraction,
              { autoAlpha: 0, y: -10, duration: 0.09 },
              "rotation",
            )
            .to(
              pressure,
              { autoAlpha: 1, y: 0, duration: 0.11 },
              "rotation+=0.05",
            )
            .to(
              farOne,
              {
                xPercent: -18,
                yPercent: -18,
                scale: 0.92,
                rotationZ: 13,
                rotationY: -11,
                duration: 0.25,
              },
              "rotation",
            )
            .to(
              farTwo,
              {
                xPercent: 20,
                yPercent: 15,
                scale: 0.78,
                rotationZ: -18,
                rotationX: 7,
                duration: 0.25,
              },
              "rotation",
            )
            .to(
              midOne,
              {
                xPercent: 18,
                yPercent: -20,
                scale: 1.04,
                rotationZ: -6,
                rotationY: -16,
                duration: 0.26,
              },
              "rotation",
            )
            .to(
              midTwo,
              {
                xPercent: -25,
                yPercent: 18,
                scale: 1.1,
                rotationZ: 22,
                rotationX: 8,
                duration: 0.26,
              },
              "rotation",
            )
            .to(
              heroOne,
              {
                xPercent: -12,
                yPercent: 10,
                scale: 1.08,
                rotationZ: 5,
                rotationY: -8,
                duration: 0.27,
              },
              "rotation",
            )
            .to(
              heroTwo,
              {
                xPercent: 16,
                yPercent: -14,
                scale: 1.06,
                rotationZ: -7,
                rotationX: -6,
                duration: 0.27,
              },
              "rotation",
            )
            .addLabel("flight", 0.35)
            .to(background, { scale: 1.065, duration: 0.24 }, "flight")
            .to(
              farOne,
              { xPercent: -48, yPercent: -30, scale: 1.18, duration: 0.25 },
              "flight",
            )
            .to(
              farTwo,
              { xPercent: 52, yPercent: 34, scale: 1.08, duration: 0.25 },
              "flight",
            )
            .to(
              midOne,
              {
                xPercent: 62,
                yPercent: -46,
                scale: 1.48,
                rotationY: -28,
                duration: 0.25,
              },
              "flight",
            )
            .to(
              midTwo,
              {
                xPercent: -64,
                yPercent: 42,
                scale: 1.55,
                rotationZ: 34,
                duration: 0.25,
              },
              "flight",
            )
            .to(
              heroTwo,
              {
                xPercent: 54,
                yPercent: -38,
                scale: 1.62,
                rotationZ: 12,
                duration: 0.25,
              },
              "flight",
            )
            .addLabel("intensity", 0.48)
            .to(
              redLight,
              {
                autoAlpha: mobile ? 0.5 : 0.7,
                scale: 1.04,
                xPercent: 0,
                duration: 0.22,
              },
              "intensity",
            )
            .addLabel("approach", 0.56)
            .set(
              transition,
              { xPercent: -34, yPercent: 30, scale: 1.05, rotationZ: -12 },
              "approach+=0.045",
            )
            .to(
              heroOne,
              {
                xPercent: mobile ? 18 : 44,
                yPercent: mobile ? -22 : -38,
                scale: mobile ? 1.72 : 2.05,
                rotationZ: 13,
                rotationY: -18,
                duration: 0.17,
                ease: "power2.in",
              },
              "approach",
            )
            .to(
              transition,
              {
                autoAlpha: 1,
                xPercent: -34,
                yPercent: 30,
                scale: mobile ? 1.15 : 1.05,
                duration: 0.1,
              },
              "approach+=0.055",
            )
            .addLabel("wipe", 0.65)
            .to(pressure, { autoAlpha: 0, y: -10, duration: 0.08 }, "wipe")
            .to(
              transition,
              {
                xPercent: mobile ? 18 : 24,
                yPercent: mobile ? -12 : -18,
                scale: mobile ? 3.2 : 3.75,
                rotationZ: 8,
                rotationY: -7,
                duration: 0.105,
                ease: "power2.inOut",
              },
              "wipe",
            )
            .to(
              notes,
              { autoAlpha: 0, duration: 0.08, stagger: 0.005 },
              "wipe+=0.045",
            )
            .addLabel("message", 0.7)
            .to(
              transition,
              {
                autoAlpha: 0,
                xPercent: 78,
                yPercent: -55,
                duration: 0.075,
                ease: "power1.out",
              },
              "message",
            )
            .to(
              ghost,
              { autoAlpha: 0.055, xPercent: 0, duration: 0.08 },
              "message+=0.015",
            )
            .to(
              eyebrow,
              { autoAlpha: 1, y: 0, duration: 0.045 },
              "message+=0.015",
            )
            .to(
              lines[0],
              { yPercent: 0, rotateX: 0, duration: 0.055, ease: "power2.out" },
              "message+=0.025",
            )
            .to(
              lines[1],
              { yPercent: 0, rotateX: 0, duration: 0.055, ease: "power2.out" },
              "message+=0.05",
            )
            .addLabel("settle", 0.77)
            .to(
              lines[2],
              { yPercent: 0, rotateX: 0, duration: 0.05, ease: "power2.out" },
              "settle",
            )
            .to(
              redLight,
              {
                autoAlpha: mobile ? 0.58 : 0.82,
                scale: 1.075,
                duration: 0.055,
              },
              "settle+=0.025",
            )
            .to(
              lines[3],
              { yPercent: 0, rotateX: 0, duration: 0.05, ease: "power2.out" },
              "settle+=0.025",
            )
            .to(body, { autoAlpha: 1, y: 0, duration: 0.045 }, "settle+=0.04")
            .to(meta, { autoAlpha: 1, y: 0, duration: 0.04 }, "settle+=0.06")
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.04 }, "settle+=0.08")
            .addLabel("release", 0.92)
            .to(background, { scale: 1.07, duration: 0.08 }, "release")
            .to(redLight, { xPercent: -1.5, duration: 0.08 }, "release");

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
        <div className={styles.depthField} aria-hidden>
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
            preload
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
            MARCOS / DISCIPLINE OVER IMPULSE
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
            <p>Funding isn&apos;t the finish line.</p>
            <p>
              The traders who last learn to protect capital, control risk and
              execute with discipline — especially when the market gets loud.
            </p>
          </div>
          <p className={styles.meta} data-capital-meta>
            RISK / PROCESS / DISCIPLINE / CONSISTENCY
          </p>
          <Link
            className={styles.cta}
            href="/join"
            prefetch={false}
            data-capital-cta
          >
            BUILD YOUR EDGE{" "}
            <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden />
          </Link>
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
