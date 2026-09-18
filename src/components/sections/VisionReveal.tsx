"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./vision-reveal.module.css";

const ASSET_ROOT = "/images/marcos/vision";

export function VisionReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { isLowPower } = useAnimationPreferences();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const { gsap, ScrollTrigger } = getGSAP();
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
          const isMobile = Boolean(conditions?.mobile);
          const isTablet = Boolean(conditions?.tablet);
          const reduceMotion = Boolean(conditions?.reduceMotion);
          const topLayer =
            section.querySelector<HTMLElement>("[data-vision-top]");
          const bottomLayer = section.querySelector<HTMLElement>(
            "[data-vision-bottom]",
          );
          const seam = section.querySelector<HTMLElement>("[data-vision-seam]");
          const atmosphere = section.querySelector<HTMLElement>(
            "[data-vision-atmosphere]",
          );
          const art = section.querySelector<HTMLElement>("[data-vision-art]");
          const gaze = section.querySelector<HTMLElement>("[data-vision-gaze]");
          const opening = section.querySelector<HTMLElement>(
            "[data-vision-opening]",
          );
          const eyebrow = section.querySelector<HTMLElement>(
            "[data-vision-eyebrow]",
          );
          const headlineLines = gsap.utils.toArray<HTMLElement>(
            "[data-vision-headline-line]",
            section,
          );
          const body = section.querySelector<HTMLElement>("[data-vision-body]");
          const meta = section.querySelector<HTMLElement>("[data-vision-meta]");
          const cta = section.querySelector<HTMLElement>("[data-vision-cta]");

          if (
            !topLayer ||
            !bottomLayer ||
            !seam ||
            !atmosphere ||
            !art ||
            !gaze ||
            !opening ||
            !eyebrow ||
            headlineLines.length !== 2 ||
            !body ||
            !meta ||
            !cta
          ) {
            return;
          }

          if (reduceMotion) {
            gsap.set(topLayer, { yPercent: isMobile ? -30 : -36 });
            gsap.set(bottomLayer, { yPercent: isMobile ? 30 : 36 });
            gsap.set(seam, { autoAlpha: 0.08 });
            gsap.set(art, {
              xPercent: isMobile ? 5 : 7,
              scale: 1.03,
            });
            gsap.set(gaze, {
              clipPath: "circle(18% at 76% 47%)",
              autoAlpha: 1,
            });
            gsap.set(opening, { autoAlpha: 0 });
            gsap.set([eyebrow, body, meta, cta], { autoAlpha: 1, y: 0 });
            gsap.set(headlineLines, { autoAlpha: 1, yPercent: 0, rotateX: 0 });
            return;
          }

          if (isMobile) {
            gsap.set([topLayer, bottomLayer, gaze], { display: "none" });
            gsap.set(atmosphere, { autoAlpha: 0.34, scale: 1 });
            gsap.set(art, { autoAlpha: 1, scale: 1.02, yPercent: 0 });
            gsap.set(seam, { autoAlpha: 0.14, scaleX: 1 });
            gsap.set(opening, { display: "none" });
            gsap.set([eyebrow, body, meta, cta, ...headlineLines], {
              clearProps: "all",
            });
            return;
          }

          gsap.set([topLayer, bottomLayer], {
            transformOrigin: isMobile ? "50% 50%" : "50% 50%",
            force3D: true,
          });
          gsap.set([art, atmosphere], { force3D: !isLowPower });
          gsap.set(gaze, {
            clipPath: "circle(0% at 76% 47%)",
            autoAlpha: 1,
          });
          gsap.set(opening, { autoAlpha: 1, y: 0 });
          gsap.set([eyebrow, body, meta, cta], { autoAlpha: 0, y: 18 });
          gsap.set(headlineLines, {
            autoAlpha: 1,
            yPercent: 112,
            rotateX: 4,
            transformOrigin: "50% 100%",
          });

          const foregroundTravel = isTablet ? 43 : 50;
          const timeline = gsap.timeline({
            defaults: { ease: "power1.inOut" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * (isTablet ? 2.35 : 3.2)}`,
              pin: stage,
              pinSpacing: true,
              // Lenis already eases the physical scroll position. A numeric
              // scrub adds a second lag layer and makes the story catch up
              // only after the user stops scrolling.
              scrub: true,
              anticipatePin: 1,
              refreshPriority: 100,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel("pressure", 0)
            .to(
              opening,
              { autoAlpha: 0, y: -18, duration: 0.1, ease: "power1.out" },
              "pressure+=0.02",
            )
            .to(
              [topLayer, bottomLayer],
              { scale: isMobile ? 1.008 : 1.015, duration: 0.15 },
              "pressure",
            )
            .to(
              atmosphere,
              {
                scale: isLowPower ? 1.02 : isMobile ? 1.015 : 1.07,
                yPercent: isLowPower || isMobile ? 0 : -0.6,
                duration: 0.2,
              },
              "pressure",
            )
            .to(
              art,
              {
                scale: isMobile ? 1.012 : 1.04,
                yPercent: isMobile ? -0.4 : -1.2,
                duration: 0.18,
              },
              "pressure",
            )
            .to(seam, { autoAlpha: 0.34, scaleX: 1.08, duration: 0.14 }, 0.04)
            .addLabel("break", 0.15)
            .to(
              topLayer,
              {
                yPercent: -foregroundTravel,
                scale: isMobile ? 1.012 : 1.025,
                rotationZ: isLowPower || isMobile ? 0 : -0.18,
                duration: 0.29,
                ease: "power2.inOut",
              },
              "break",
            )
            .to(
              bottomLayer,
              {
                yPercent: foregroundTravel,
                scale: isMobile ? 1.008 : 1.015,
                rotationZ: isLowPower || isMobile ? 0 : 0.12,
                duration: 0.3,
                ease: "power2.inOut",
              },
              "break+=0.015",
            )
            .to(seam, { autoAlpha: 0.08, scaleX: 1.18, duration: 0.2 }, 0.24)
            .addLabel("reveal", 0.3)
            .to(
              art,
              {
                yPercent: isMobile ? -1.5 : -5,
                scale: isMobile ? 1.02 : 1.065,
                duration: 0.25,
                ease: "power1.out",
              },
              "reveal",
            )
            .to(
              atmosphere,
              {
                yPercent: isLowPower || isMobile ? 0 : -2,
                scale: isLowPower ? 1.02 : isMobile ? 1.018 : 1.08,
                duration: 0.28,
              },
              "reveal",
            )
            .addLabel("gaze", 0.45)
            .to(
              gaze,
              {
                clipPath: "circle(18% at 76% 47%)",
                duration: 0.2,
                ease: "power1.inOut",
              },
              "gaze",
            )
            .addLabel("shift", 0.55)
            .to(
              art,
              {
                xPercent: isMobile ? 2 : 8,
                yPercent: isMobile ? -2 : -4,
                scale: isMobile ? 1.022 : 1.09,
                duration: 0.2,
                ease: "power2.inOut",
              },
              "shift",
            )
            .addLabel("copy", 0.65)
            .to(
              eyebrow,
              { autoAlpha: 1, y: 0, letterSpacing: "0.18em", duration: 0.07 },
              "copy",
            )
            .to(
              headlineLines[0],
              { yPercent: 0, rotateX: 0, duration: 0.09, ease: "power2.out" },
              "copy+=0.045",
            )
            .to(
              headlineLines[1],
              { yPercent: 0, rotateX: 0, duration: 0.1, ease: "power2.out" },
              "copy+=0.115",
            )
            .to(body, { autoAlpha: 1, y: 0, duration: 0.08 }, "copy+=0.16")
            .to(meta, { autoAlpha: 1, y: 0, duration: 0.06 }, "copy+=0.195")
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.06 }, "copy+=0.215")
            .addLabel("hold", 0.88)
            .to(
              art,
              { scale: isMobile ? 1.024 : 1.092, duration: 0.08 },
              "hold",
            )
            .to(
              atmosphere,
              {
                yPercent: isLowPower || isMobile ? 0 : -2.2,
                duration: 0.08,
              },
              "hold",
            )
            .addLabel("release", 0.96)
            .to(
              atmosphere,
              {
                yPercent: isLowPower || isMobile ? 0 : -2.35,
                duration: 0.04,
              },
              "release",
            );

          return () => timeline.kill();
        },
      );
    }, section);

    let refreshTimer = 0;
    const refreshAfterOrientation = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    window.addEventListener("orientationchange", refreshAfterOrientation);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("orientationchange", refreshAfterOrientation);
      media.revert();
      context.revert();
    };
  }, [isLowPower]);

  return (
    <section
      ref={sectionRef}
      className={styles.story}
      aria-labelledby="vision-reveal-title"
      data-testid="vision-reveal"
    >
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.atmosphere} data-vision-atmosphere aria-hidden>
          <Image
            src={`${ASSET_ROOT}/marcos-market-atmosphere.webp`}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.cover}
          />
        </div>

        <div className={styles.art} data-vision-art aria-hidden>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={`${ASSET_ROOT}/marcos-vision-mobile.webp`}
            />
            <img
              src={`${ASSET_ROOT}/marcos-eye-base.webp`}
              alt=""
              className={styles.artImage}
              fetchPriority="high"
            />
          </picture>
          <div className={styles.gaze} data-vision-gaze>
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={`${ASSET_ROOT}/marcos-vision-mobile.webp`}
              />
              <img
                src={`${ASSET_ROOT}/marcos-eye-right.webp`}
                alt=""
                className={styles.artImage}
                loading="eager"
              />
            </picture>
          </div>
        </div>

        <div className={styles.seam} data-vision-seam aria-hidden />

        <div
          className={`${styles.layer} ${styles.topLayer}`}
          data-vision-top
          aria-hidden
        >
          <Image
            src={`${ASSET_ROOT}/marcos-layer-top.webp`}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.layerImage}
          />
        </div>
        <div
          className={`${styles.layer} ${styles.bottomLayer}`}
          data-vision-bottom
          aria-hidden
        >
          <Image
            src={`${ASSET_ROOT}/marcos-layer-bottom.webp`}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.layerImage}
          />
        </div>

        <div className={styles.opening} data-vision-opening>
          <p className={styles.openingEyebrow}>BEFORE THE MARKET MOVES</p>
          <h1 className={styles.openingHeadline}>
            <span>MOST TRADERS SEE THE CHART.</span>
            <span>FEW SEE WHAT MOVES IT.</span>
          </h1>
          <p className={styles.openingPrompt}>
            Scroll slowly. Clarity is on the other side.
          </p>
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow} data-vision-eyebrow>
            <span aria-hidden />
            MARCOS / THE TRADING COMMUNITY
          </p>
          <h2 id="vision-reveal-title" className={styles.headline}>
            <span className={styles.lineMask}>
              <span data-vision-headline-line>SEE THE MARKET</span>
            </span>
            <span className={styles.lineMask}>
              <span data-vision-headline-line>DIFFERENTLY.</span>
            </span>
          </h2>
          <div className={styles.body} data-vision-body>
            <p>Trading alone leaves you with one perspective.</p>
            <p>
              MARCOS brings traders together through structure, shared analysis,
              risk discipline and community — helping members work toward
              becoming funded traders.
            </p>
          </div>
          <p className={styles.meta} data-vision-meta>
            LEARN / TRADE / IMPROVE / GET FUNDED
          </p>
          <Link
            className={styles.cta}
            href="/join"
            prefetch={false}
            data-vision-cta
          >
            <span>ENTER MARCOS</span>
            <span className={styles.arrow} aria-hidden>
              →
            </span>
          </Link>
        </div>

        <p className={styles.scrollCue} aria-hidden>
          SCROLL TO BREAK THROUGH
        </p>
      </div>
    </section>
  );
}
