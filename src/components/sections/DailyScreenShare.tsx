"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { useEffect, useRef } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./daily-screen-share.module.css";

const headlineLines = [
  ["WE", "SHARE", "OUR"],
  ["TRADOVATE", "SCREEN"],
  ["LIVE", "ON", "KICK."],
  ["EVERY", "WEEKDAY."],
];

export function DailyScreenShare() {
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
          const isMobile = Boolean(conditions?.mobile);
          const reduceMotion = Boolean(conditions?.reduceMotion);
          const backdrop = section.querySelector<HTMLElement>(
            "[data-share-backdrop]",
          );
          const bridge = section.querySelector<HTMLElement>(
            "[data-share-bridge]",
          );
          const eyebrow = section.querySelector<HTMLElement>(
            "[data-share-eyebrow]",
          );
          const words = gsap.utils.toArray<HTMLElement>(
            "[data-share-word]",
            section,
          );
          const body = section.querySelector<HTMLElement>("[data-share-body]");
          const status = section.querySelector<HTMLElement>(
            "[data-share-status]",
          );
          const cta = section.querySelector<HTMLElement>("[data-share-cta]");

          if (
            !backdrop ||
            !bridge ||
            !eyebrow ||
            words.length === 0 ||
            !body ||
            !status ||
            !cta
          ) {
            return;
          }

          if (reduceMotion) {
            gsap.set([backdrop, bridge, eyebrow, words, body, status, cta], {
              clearProps: "all",
            });
            return;
          }

          if (isMobile) {
            gsap.set(words, { autoAlpha: 1, yPercent: 0 });
            const mobileTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            });

            mobileTimeline.fromTo(
              [eyebrow, body, status, cta],
              { autoAlpha: 0, y: 18 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.48,
                stagger: 0.07,
                ease: "power1.out",
              },
            );
            return () => mobileTimeline.kill();
          }

          gsap.set(bridge, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(backdrop, {
            autoAlpha: 0.18,
            scale: isLowPower ? 1.02 : 1.08,
            yPercent: isLowPower ? 0 : -3,
          });
          gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
          gsap.set(words, {
            autoAlpha: isLowPower ? 0.18 : 0.1,
            yPercent: isLowPower ? 72 : 112,
            rotateX: isLowPower ? 0 : 7,
            transformOrigin: "50% 100%",
          });
          gsap.set([body, status, cta], { autoAlpha: 0, y: 20 });

          const timeline = gsap.timeline({
            defaults: { ease: "power1.inOut" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom bottom",
              scrub: isLowPower ? 0.12 : 0.22,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel("handoff", 0)
            .to(bridge, { scaleX: 1, duration: 0.22 }, "handoff")
            .to(
              backdrop,
              {
                autoAlpha: 0.72,
                scale: 1.025,
                yPercent: isLowPower ? 0 : 1,
                duration: 0.58,
              },
              "handoff",
            )
            .addLabel("context", 0.18)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.14 }, "context")
            .addLabel("statement", 0.26)
            .to(
              words,
              {
                autoAlpha: 1,
                yPercent: 0,
                rotateX: 0,
                duration: 0.34,
                stagger: 0.035,
                ease: "power2.out",
              },
              "statement",
            )
            .addLabel("proof", 0.68)
            .to(body, { autoAlpha: 1, y: 0, duration: 0.13 }, "proof")
            .to(status, { autoAlpha: 1, y: 0, duration: 0.11 }, "proof+=0.09")
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.1 }, "proof+=0.16")
            .addLabel("settle", 0.9)
            .to(
              backdrop,
              {
                scale: 1.018,
                yPercent: isLowPower ? 0 : 1.3,
                duration: 0.1,
              },
              "settle",
            );

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
      id="community"
      className={styles.section}
      aria-labelledby="daily-screen-share-title"
      data-testid="daily-screen-share"
    >
      <div className={styles.stage}>
        <div className={styles.backdrop} data-share-backdrop aria-hidden>
          <Image
            src="/images/marcos/how-it-works/marcos-live-session.webp"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.backdropImage}
          />
        </div>
        <div className={styles.scrim} aria-hidden />

        <div className={styles.bridgeWrap} aria-hidden>
          <span className={styles.bridgeLabel}>VISION / PRACTICE</span>
          <span className={styles.bridge} data-share-bridge />
          <span className={styles.bridgeIndex}>02</span>
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow} data-share-eyebrow>
            HOW IT WORKS
          </p>
          <h2
            id="daily-screen-share-title"
            className={styles.headline}
            aria-label="We share our Tradovate screen live on Kick. Every weekday."
          >
            {headlineLines.map((line, lineIndex) => (
              <span className={styles.wordLine} key={lineIndex} aria-hidden>
                {line.map((word) => (
                  <span className={styles.wordMask} key={word}>
                    <span
                      className={
                        word === "KICK." ? styles.platformWord : undefined
                      }
                      data-share-word
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <div className={styles.body} data-share-body>
            <p>No delayed recaps. No hiding the difficult sessions.</p>
            <p>
              Watch the Tradovate chart we trade — entries, exits, stops, and
              the reasoning behind each decision — shared live on Kick every
              weekday.
            </p>
          </div>

          <div className={styles.status} data-share-status>
            <Radio size={15} strokeWidth={1.8} aria-hidden />
            <span className={styles.live}>LIVE</span>
            <span>TRADOVATE</span>
            <i aria-hidden />
            <span>KICK</span>
            <i aria-hidden />
            <span>WEEKDAYS</span>
          </div>

          <Link
            className={styles.cta}
            href="/join"
            prefetch={false}
            data-share-cta
          >
            ENTER THE LIVE DESK
            <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
