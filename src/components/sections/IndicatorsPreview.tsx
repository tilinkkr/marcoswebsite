"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { indicatorFeatures, indicatorProduct } from "@/config/products";
import { getGSAP } from "@/lib/animations/gsap";

import styles from "./indicators-preview.module.css";

export function IndicatorsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { gsap } = getGSAP();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width:1024px)",
          tablet: "(min-width:768px) and (max-width:1023px)",
          mobile: "(max-width:767px)",
          reduced: "(prefers-reduced-motion:reduce)",
        },
        ({ conditions }) => {
          const reduced = Boolean(conditions?.reduced);
          const mobile = Boolean(conditions?.mobile);
          const art = section.querySelector<HTMLElement>(
            "[data-indicator-art]",
          );
          const noise = gsap.utils.toArray<SVGPathElement>(
            "[data-noise]",
            section,
          );
          const signal = section.querySelector<SVGPathElement>("[data-signal]");
          const message = section.querySelector<HTMLElement>(
            "[data-indicator-message]",
          );
          const see = section.querySelector<HTMLElement>("[data-see]");
          const card = section.querySelector<HTMLElement>(
            "[data-indicator-card]",
          );
          const strike = section.querySelector<HTMLElement>(
            "[data-indicator-strike]",
          );
          if (!art || !signal || !message || !see || !card || !strike) return;
          if (reduced) {
            gsap.set([art, signal, message, see, card, strike], {
              clearProps: "all",
            });
            gsap.set(noise, { autoAlpha: 0.18 });
            return;
          }

          if (mobile) {
            gsap.set(art, { scale: 1.01, filter: "brightness(.74)" });
            gsap.set(noise, { autoAlpha: 0.07 });
            gsap.set(signal, { strokeDasharray: 1400, strokeDashoffset: 0 });
            gsap.set(message, { display: "none" });
            gsap.set(see, { color: "#c97941" });
            gsap.set(card, { autoAlpha: 1, x: 0, y: 0 });
            gsap.set(strike, { scaleX: 1, transformOrigin: "left center" });

            const mobileTimeline = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            });

            mobileTimeline.fromTo(
              card,
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.62 },
            );

            return () => mobileTimeline.kill();
          }

          gsap.set(message, { autoAlpha: 0, y: 24 });
          gsap.set(see, { color: "#6b6a65" });
          gsap.set(card, {
            autoAlpha: 0,
            x: 32,
            y: 0,
          });
          gsap.set(strike, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(signal, { strokeDasharray: 1400, strokeDashoffset: 1400 });
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.22,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              art,
              { scale: 1.1, filter: "brightness(.45)" },
              { scale: 1, filter: "brightness(.82)", duration: 0.28 },
            )
            .to(noise, { autoAlpha: 0.08, stagger: 0.018, duration: 0.2 }, 0.26)
            .to(signal, { strokeDashoffset: 0, duration: 0.26 }, 0.34)
            .to(noise, { autoAlpha: 0, duration: 0.16 }, 0.48)
            .to(message, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.54)
            .to(
              see,
              {
                color: "#c97941",
                textShadow: "0 0 28px rgba(166,41,50,.45)",
                duration: 0.12,
              },
              0.67,
            )
            .to(message, { autoAlpha: 0, y: -18, duration: 0.12 }, 0.75)
            .to(card, { autoAlpha: 1, x: 0, y: 0, duration: 0.17 }, 0.78)
            .to(strike, { scaleX: 1, duration: 0.1 }, 0.88)
            .to({}, { duration: 0.05 });
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
      data-testid="indicators-preview"
      aria-labelledby="indicator-preview-title"
    >
      <div className={styles.stage}>
        <picture className={styles.art} data-indicator-art>
          <source
            media="(max-width:767px)"
            srcSet="/images/marcos/indicators/indicator-chamber-mobile.webp"
          />
          <img
            src="/images/marcos/indicators/indicator-chamber-desktop.webp"
            alt=""
          />
        </picture>
        <div className={styles.shade} aria-hidden />
        <svg
          className={styles.chart}
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          aria-hidden
        >
          {Array.from({ length: 6 }, (_, index) => (
            <path
              key={index}
              data-noise
              d={`M0 ${330 - index * 34} C160 ${210 + index * 18}, 260 ${390 - index * 20}, 430 ${210 + index * 6} S720 ${110 + index * 25}, 1000 ${60 + index * 18}`}
            />
          ))}
          <path
            data-signal
            className={styles.signal}
            d="M0 335 C135 310, 205 355, 310 268 S490 298, 585 202 S730 235, 1000 72"
          />
        </svg>
        <div className={styles.message} data-indicator-message>
          <p>MARCOS / MARKET CLARITY</p>
          <h2 id="indicator-preview-title">
            AN INDICATOR SHOULDN&apos;T TELL YOU WHAT TO THINK.
            <br />
            <span data-see>IT SHOULD HELP YOU SEE.</span>
          </h2>
        </div>
        <article className={styles.card} data-indicator-card>
          <p className={styles.eyebrow}>MARCOS / INDICATOR 01</p>
          <h3>{indicatorProduct.name}</h3>
          <p className={styles.tagline}>
            LESS NOISE.
            <br />
            MORE CONTEXT.
          </p>
          <ul>
            {indicatorFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className={styles.price}>
            <span className={styles.old}>
              ${indicatorProduct.originalPrice}
              <i data-indicator-strike />
            </span>
            <strong>${indicatorProduct.offerPrice}</strong>
            <small>{indicatorProduct.discountPercent}% OFF</small>
          </div>
          <Link href="/indicators">
            EXPLORE INDICATOR <ArrowUpRight size={17} aria-hidden />
          </Link>
        </article>
      </div>
    </section>
  );
}
