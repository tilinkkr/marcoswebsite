"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";

import styles from "./membership.module.css";

const benefits = [
  "Community discussion",
  "Live weekday screen shares",
  "Trade reasoning and review",
  "Risk and process education",
  "Prop-evaluation learning environment",
];

export function Membership() {
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
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const mobile = Boolean(conditions?.mobile);
          const reduceMotion = Boolean(conditions?.reduceMotion);
          const oldPrice =
            section.querySelector<HTMLElement>("[data-old-price]");
          const strike = section.querySelector<HTMLElement>(
            "[data-price-strike]",
          );
          const currentPrice = section.querySelector<HTMLElement>(
            "[data-current-price]",
          );
          const offer = section.querySelector<HTMLElement>("[data-offer]");
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-benefit]",
            section,
          );
          const cta = section.querySelector<HTMLElement>(
            "[data-membership-cta]",
          );

          if (
            !oldPrice ||
            !strike ||
            !currentPrice ||
            !offer ||
            !cta ||
            items.length === 0
          )
            return;

          if (reduceMotion) {
            gsap.set([oldPrice, strike, currentPrice, offer, items, cta], {
              clearProps: "all",
            });
            return;
          }

          gsap.set(strike, { scaleX: 0, transformOrigin: "left center" });
          gsap.set([currentPrice, offer, items, cta], { autoAlpha: 0, y: 18 });

          if (mobile) {
            const mobileTimeline = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            });

            mobileTimeline
              .to(oldPrice, { autoAlpha: 0.55, duration: 0.18 })
              .to(strike, { scaleX: 1, duration: 0.22 }, 0.08)
              .to(currentPrice, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.18)
              .to(offer, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.3)
              .to(
                items,
                { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.045 },
                0.4,
              )
              .to(cta, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.68);

            return () => mobileTimeline.kill();
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              end: "top 18%",
              scrub: 0.45,
              once: false,
            },
          });

          timeline
            .to(oldPrice, { autoAlpha: 0.55, duration: 0.16 })
            .to(strike, { scaleX: 1, duration: 0.18 }, 0.1)
            .to(currentPrice, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.2)
            .to(offer, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.32)
            .to(
              items,
              { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.045 },
              0.42,
            )
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.68);

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
      id="membership"
      className={styles.section}
      aria-labelledby="membership-title"
    >
      <div className={styles.intro}>
        <p className={styles.eyebrow}>YOUR PLACE ON THE FLOOR</p>
        <h2 id="membership-title" className={styles.headline}>
          <span>STOP TRADING</span>
          <span>IN ISOLATION.</span>
        </h2>
        <p className={styles.introCopy}>
          Join MARCOS and build your process around traders focused on learning,
          execution, risk and improvement.
        </p>
      </div>

      <div className={styles.offerCard}>
        <div className={styles.offerTopline}>
          <span>MARCOS ACCESS</span>
          <span>FOUNDING ACCESS</span>
        </div>
        <div className={styles.pricePanel}>
          <div className={styles.priceBlock}>
            <div className={styles.oldPrice} data-old-price>
              <span>$200</span>
              <i data-price-strike />
            </div>
            <p className={styles.currentPrice} data-current-price>
              $100
            </p>
            <p className={styles.offerLabel} data-offer>
              50% ACCESS OFFER
            </p>
          </div>
          <p className={styles.priceContext}>
            ONE MEMBERSHIP.
            <br />
            THE FULL MARCOS LOOP.
          </p>
        </div>
        <div className={styles.offerDetails}>
          <p className={styles.offerCopy}>
            Everything you need to stop learning alone and start building a more
            deliberate process.
          </p>
          <ul className={styles.benefits}>
            {benefits.map((benefit) => (
              <li key={benefit} data-benefit>
                <Check size={15} strokeWidth={1.8} aria-hidden />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p className={styles.disclaimer}>
            NO SIGNAL PROMISES. NO GUARANTEED OUTCOMES. JUST A BETTER
            ENVIRONMENT TO BUILD YOUR PROCESS.
          </p>
          <Link
            className={styles.cta}
            href="/join"
            prefetch={false}
            data-membership-cta
          >
            JOIN MARCOS — $100{" "}
            <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
