"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { getGSAP } from "@/lib/animations/gsap";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";

import styles from "./vision-reveal.module.css";

const ASSET_ROOT = "/images/marcos/vision";

export function VisionReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loadedLayers = useRef(0);

  // The eye artwork stays hidden until both torn-paper layers have painted,
  // so the uncovered eye never flashes before the paper covers it.
  const markLayerLoaded = () => {
    loadedLayers.current += 1;
    if (loadedLayers.current >= 2) {
      sectionRef.current?.setAttribute("data-vision-layers", "");
    }
  };
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

          const foregroundTravel = isTablet ? 44 : 52;
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
            .addLabel("pressure", 0)
            .to(
              opening,
              { autoAlpha: 0, y: -22, duration: 0.14, ease: "power1.out" },
              "pressure",
            )
            .to(
              [topLayer, bottomLayer],
              { scale: 1.012, duration: 0.08 },
              "pressure",
            )
            .to(
              atmosphere,
              {
                scale: isLowPower ? 1.02 : 1.06,
                yPercent: isLowPower ? 0 : -0.6,
                duration: 0.16,
              },
              "pressure",
            )
            .to(
              art,
              {
                scale: 1.035,
                yPercent: -1,
                duration: 0.16,
              },
              "pressure",
            )
            .to(seam, { autoAlpha: 0.34, scaleX: 1.08, duration: 0.12 }, 0.02)
            .addLabel("break", 0.08)
            .to(
              topLayer,
              {
                yPercent: -foregroundTravel,
                scale: 1.025,
                rotationZ: isLowPower ? 0 : -0.18,
                duration: 0.32,
                ease: "power2.inOut",
              },
              "break",
            )
            .to(
              bottomLayer,
              {
                yPercent: foregroundTravel,
                scale: 1.015,
                rotationZ: isLowPower ? 0 : 0.12,
                duration: 0.32,
                ease: "power2.inOut",
              },
              "break+=0.01",
            )
            .to(seam, { autoAlpha: 0.08, scaleX: 1.18, duration: 0.2 }, 0.18)
            .addLabel("reveal", 0.24)
            .to(
              art,
              {
                yPercent: -4,
                scale: 1.065,
                duration: 0.26,
                ease: "power1.out",
              },
              "reveal",
            )
            .to(
              atmosphere,
              {
                yPercent: isLowPower ? 0 : -2,
                scale: isLowPower ? 1.02 : 1.08,
                duration: 0.28,
              },
              "reveal",
            )
            .addLabel("gaze", 0.36)
            .to(
              gaze,
              {
                clipPath: "circle(18% at 76% 47%)",
                duration: 0.22,
                ease: "power1.inOut",
              },
              "gaze",
            )
            .addLabel("shift", 0.48)
            .to(
              art,
              {
                xPercent: 8,
                yPercent: -4,
                scale: 1.09,
                duration: 0.22,
                ease: "power2.inOut",
              },
              "shift",
            )
            .addLabel("copy", 0.2)
            .to(
              eyebrow,
              { autoAlpha: 1, y: 0, letterSpacing: "0.18em", duration: 0.09 },
              "copy",
            )
            .to(
              headlineLines[0],
              { yPercent: 0, rotateX: 0, duration: 0.12, ease: "power2.out" },
              "copy+=0.02",
            )
            .to(
              headlineLines[1],
              { yPercent: 0, rotateX: 0, duration: 0.12, ease: "power2.out" },
              "copy+=0.06",
            )
            .to(body, { autoAlpha: 1, y: 0, duration: 0.1 }, "copy+=0.1")
            .to(meta, { autoAlpha: 1, y: 0, duration: 0.08 }, "copy+=0.14")
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.08 }, "copy+=0.16")
            .addLabel("hold", 0.65)
            .to(art, { scale: 1.092, duration: 0.1 }, "hold")
            .to(
              atmosphere,
              {
                yPercent: isLowPower ? 0 : -2.2,
                duration: 0.1,
              },
              "hold",
            );

          return () => timeline.kill();
        },
      );
    }, section);

    // GSAP now owns the initial states, so the CSS pre-hydration guard that
    // hides the second-scene copy can release (see vision-reveal.module.css).
    section.setAttribute("data-vision-ready", "");

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
                media="(min-width: 768px)"
                srcSet={`${ASSET_ROOT}/marcos-eye-right.webp`}
              />
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
                className={styles.artImage}
                loading="lazy"
                decoding="async"
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
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={`${ASSET_ROOT}/marcos-layer-top.webp`}
            />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt=""
              onLoad={markLayerLoaded}
              className={styles.layerImage}
              decoding="async"
            />
          </picture>
        </div>
        <div
          className={`${styles.layer} ${styles.bottomLayer}`}
          data-vision-bottom
          aria-hidden
        >
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={`${ASSET_ROOT}/marcos-layer-bottom.webp`}
            />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt=""
              onLoad={markLayerLoaded}
              className={styles.layerImage}
              decoding="async"
            />
          </picture>
        </div>

        <div className={styles.opening} data-vision-opening>
          <div className={styles.openingTop}>
            <p className={styles.openingEyebrow}>
              <span className={styles.eyebrowLine} aria-hidden />
              BEFORE THE MARKET MOVES · DAILY LIVE GOOGLE MEET DESK
            </p>
            {/* The slogan stays the visual centerpiece; the literal description is
                the H1 so search engines, AI Overviews and screen readers capture
                the offer cleanly in Section 1. */}
            <p className={styles.openingHeadline}>
              <span>MOST TRADERS SEE THE CHART.</span>
              <span>FEW SEE WHAT MOVES IT.</span>
            </p>
            <h1 className={styles.openingPrompt}>
              An India-first trading community for education, daily live Google
              Meet streams, funded-account preparation &amp; risk discipline.
            </h1>
          </div>

          <div className={styles.openingDock}>
            <div className={styles.aeoDockCard}>
              <span className={styles.aeoLabel}>WHAT IS A FUNDED ACCOUNT?</span>
              <p className={styles.aeoSummary}>
                Pass rule-based prop-firm drawdown checks (FundingPips, FTMO,
                Alpha Capital) to earn profit splits without risking large
                savings. Learn to pass honestly on our daily private Google Meet
                stream across India, UAE &amp; GCC.
              </p>
            </div>

            <div className={styles.openingActions}>
              <WhatsAppLink
                className={styles.openingWhatsapp}
                href={getWhatsAppUrl(
                  "Hi MARKOS, I want to know about your daily Google Meet live trading stream and funded-account community.",
                )}
                placement="home-opening-hero"
                data-whatsapp-primary
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.liveDot} aria-hidden />
                <span>ASK ON WHATSAPP</span>
                <span className={styles.ctaArrow} aria-hidden>
                  ↗
                </span>
              </WhatsAppLink>
              <Link
                className={styles.openingGuide}
                href="/funded-account-guide"
                prefetch={false}
              >
                <span>FUNDED RULES GUIDE</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow} data-vision-eyebrow>
            <span aria-hidden />
            MARKOS / DAILY LIVE GOOGLE MEET TRADING COMMUNITY
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
            <p>
              <strong>What is a funded account?</strong> A rule-based prop-firm
              account where you prove drawdown discipline to earn profit splits
              without risking personal savings.
            </p>
            <p>
              MARKOS runs a daily private &amp; paid Google Meet live trading
              stream for traders in India, UAE &amp; GCC — combining XAUUSD gold
              execution, prop-firm rule breakdowns, and honest trade review.
            </p>
          </div>
          <p className={styles.meta} data-vision-meta>
            DAILY GOOGLE MEET / FUNDED ACCOUNT PASSING / XAUUSD / RISK DISCIPLINE
          </p>
          <div className={styles.actions} data-vision-cta>
            <WhatsAppLink
              className={styles.whatsappCta}
              href={getWhatsAppUrl(
                "Hi MARKOS, I'd like to join the daily live Google Meet trading stream and learn about membership.",
              )}
              placement="home-hero"
              data-whatsapp-primary
              target="_blank"
              rel="noreferrer"
            >
              <span>MESSAGE ON WHATSAPP</span>
              <span aria-hidden>↗</span>
            </WhatsAppLink>
            <Link className={styles.cta} href="/join" prefetch={false}>
              <span>EXPLORE MEMBERSHIP ($100)</span>
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>

        <p className={styles.scrollCue} aria-hidden>
          SCROLL TO BREAK THROUGH
        </p>
      </div>
    </section>
  );
}
