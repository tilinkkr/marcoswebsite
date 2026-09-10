"use client";

import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./modern-trader.module.css";

const ASSET_ROOT = "/images/marcos/modern-trader";

const { props: desktopArtworkProps } = getImageProps({
  src: `${ASSET_ROOT}/marcos-modern-trader-desktop.webp`,
  alt: "A monumental dark-stone trader studying the market at a minimal laptop workstation.",
  width: 1672,
  height: 941,
  sizes: "100vw",
  loading: "lazy",
});

const { props: mobileArtworkProps } = getImageProps({
  src: `${ASSET_ROOT}/marcos-modern-trader-mobile.webp`,
  alt: "",
  width: 941,
  height: 1672,
  sizes: "100vw",
});

export function ModernTrader() {
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
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const mobile = Boolean(conditions?.mobile);
          const reduceMotion = Boolean(conditions?.reduceMotion);
          const scene = section.querySelector<HTMLElement>(
            "[data-trader-scene]",
          );
          const atmosphere = section.querySelector<HTMLElement>(
            "[data-trader-atmosphere]",
          );
          const light = section.querySelector<HTMLElement>(
            "[data-trader-light]",
          );
          const screen = section.querySelector<HTMLElement>(
            "[data-trader-screen]",
          );
          const eyebrow = section.querySelector<HTMLElement>(
            "[data-trader-eyebrow]",
          );
          const lines = gsap.utils.toArray<HTMLElement>(
            "[data-trader-line]",
            section,
          );
          const body = section.querySelector<HTMLElement>("[data-trader-body]");
          const cta = section.querySelector<HTMLElement>("[data-trader-cta]");

          if (
            !scene ||
            !atmosphere ||
            !light ||
            !screen ||
            !eyebrow ||
            lines.length !== 4 ||
            !body ||
            !cta
          )
            return;

          if (reduceMotion) {
            gsap.set(
              [scene, atmosphere, light, screen, eyebrow, lines, body, cta],
              { clearProps: "all" },
            );
            return;
          }

          gsap.set(scene, {
            autoAlpha: mobile ? 0.58 : 0.08,
            scale: mobile ? 1.04 : 1.08,
            yPercent: mobile ? -2 : 1,
          });
          gsap.set(atmosphere, { autoAlpha: 0.28, scale: 1 });
          gsap.set(light, { autoAlpha: 0.08, xPercent: 24, scale: 0.86 });
          gsap.set(screen, { autoAlpha: 0 });
          gsap.set([eyebrow, body, cta], { autoAlpha: 0, y: 16 });
          gsap.set(lines, { yPercent: 108, autoAlpha: 1 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: mobile ? true : isLowPower ? 0.35 : 0.72,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel("arrival", 0)
            .to(
              atmosphere,
              { autoAlpha: 0.58, scale: 1.025, duration: 0.28 },
              "arrival",
            )
            .to(
              light,
              {
                autoAlpha: mobile ? 0.35 : 0.52,
                xPercent: 4,
                scale: 1,
                duration: 0.34,
              },
              "arrival+=0.08",
            )
            .addLabel("discovery", 0.15)
            .to(
              scene,
              {
                autoAlpha: mobile ? 0.9 : 0.94,
                scale: mobile ? 1.015 : 1.025,
                yPercent: mobile ? -0.5 : -1,
                duration: 0.36,
              },
              "discovery",
            )
            .to(screen, { autoAlpha: 0.34, duration: 0.2 }, "discovery+=0.18")
            .addLabel("copy", mobile ? 0.48 : 0.53)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.08 }, "copy")
            .to(lines[0], { yPercent: 0, duration: 0.08 }, "copy+=0.035")
            .to(lines[1], { yPercent: 0, duration: 0.08 }, "copy+=0.085")
            .to(lines[2], { yPercent: 0, duration: 0.08 }, "copy+=0.16")
            .to(lines[3], { yPercent: 0, duration: 0.08 }, "copy+=0.21")
            .addLabel("discipline", mobile ? 0.72 : 0.76)
            .to(
              scene,
              { scale: 1.01, yPercent: 0, duration: 0.18 },
              "discipline",
            )
            .to(
              light,
              { autoAlpha: mobile ? 0.42 : 0.58, xPercent: -2, duration: 0.18 },
              "discipline",
            )
            .to(
              body,
              { autoAlpha: 1, y: 0, duration: 0.1 },
              "discipline+=0.035",
            )
            .to(
              cta,
              { autoAlpha: 1, y: 0, duration: 0.09 },
              "discipline+=0.105",
            )
            .addLabel("hold", 0.9)
            .to(screen, { autoAlpha: 0.26, duration: 0.1 }, "hold");

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
      aria-labelledby="modern-trader-title"
    >
      <div className={styles.stage}>
        <div className={styles.atmosphere} data-trader-atmosphere aria-hidden>
          <Image
            src={`${ASSET_ROOT}/marcos-modern-trader-atmosphere.webp`}
            alt=""
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.scene} data-trader-scene>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={mobileArtworkProps.srcSet}
            />
            <img {...desktopArtworkProps} alt={desktopArtworkProps.alt} />
          </picture>
        </div>
        <div className={styles.redLight} data-trader-light aria-hidden />
        <div className={styles.screenGlow} data-trader-screen aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow} data-trader-eyebrow>
            MARCOS / THE CRAFT
          </p>
          <h2 id="modern-trader-title" className={styles.headline}>
            <span className={styles.mask}>
              <span data-trader-line>THE TOOLS</span>
            </span>
            <span className={styles.mask}>
              <span data-trader-line>CHANGE.</span>
            </span>
            <span className={styles.mask}>
              <span data-trader-line>THE DISCIPLINE</span>
            </span>
            <span className={styles.mask}>
              <span data-trader-line>DOESN&apos;T.</span>
            </span>
          </h2>
          <div className={styles.body} data-trader-body>
            <p>Markets evolve. Platforms evolve. Strategies evolve.</p>
            <p>
              The traders who improve keep studying, reviewing, adapting and
              managing themselves when the market gets loud.
            </p>
            <p>MARCOS exists to make that process less isolated.</p>
          </div>
          <Link className={styles.cta} href="#membership" data-trader-cta>
            MEET THE COMMUNITY{" "}
            <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
