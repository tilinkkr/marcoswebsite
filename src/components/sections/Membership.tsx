"use client";

import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { getGSAP } from "@/lib/animations/gsap";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./membership.module.css";

const benefits = [
  "Daily private Google Meet live trading stream (IST & GST)",
  "1-on-1 mentor guidance to pass your funded account honestly",
  "Live XAUUSD (Gold), Forex & NASDAQ (MNQ) context reviews",
  "Prop-firm rules audit (BrightFunded, FundingPips, FTMO, Alpha)",
  "Global WhatsApp community: India, Kerala, UAE/GCC, UK, USA & Australia",
  "Fixed 0.5% risk sizing & drawdown survival blueprint",
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
          gsap.set([currentPrice, offer, items, cta], { autoAlpha: 1, y: 0 });

          if (mobile) {
            gsap.set(strike, { scaleX: 1, transformOrigin: "left center" });
            return;
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              end: "top 18%",
              scrub: true,
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
          Join MARKOS and build your process around traders focused on learning,
          execution, risk and improvement.
        </p>
      </div>

      <div className={styles.offerCard}>
        <div className={styles.offerTopline}>
          <span>MARKOS ACCESS</span>
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
            THE FULL MARKOS LOOP.
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
          <div className={styles.ctaRow} data-membership-cta>
            {FEATURED_PARTNER ? (
              <a
                className={styles.partnerCta}
                href={FEATURED_PARTNER.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <ShieldCheck size={17} strokeWidth={2} aria-hidden />
                START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()}){" "}
                <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden />
              </a>
            ) : null}
            <WhatsAppLink
              className={styles.whatsappCta}
              href={getWhatsAppUrl(
                "Hi MARKOS, I want to start a funded account via your partner link and learn about your $100 founding pass + daily Google Meet mentor stream.",
              )}
              placement="home-membership"
              data-whatsapp-primary
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} strokeWidth={2} aria-hidden />
              ASK MENTOR ON WHATSAPP
            </WhatsAppLink>
            <Link className={styles.cta} href="/join" prefetch={false}>
              JOIN MARKOS — $100{" "}
              <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden />
            </Link>
          </div>
          {FEATURED_PARTNER ? (
            <p className={styles.partnerDisclosure}>
              Partner disclosure: Starting an evaluation via our{" "}
              {FEATURED_PARTNER.name} partner link supports MARKOS via a
              referral commission at zero extra cost to you.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
