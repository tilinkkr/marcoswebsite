import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { indicatorFeatures, indicatorProduct } from "@/config/products";

import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Trading Indicators",
  description:
    "Explore a MARKOS analytical indicator designed to add market context without replacing trader judgment.",
  alternates: { canonical: "/indicators" },
  openGraph: {
    title: "MARKOS Trading Tools",
    description: "See more without adding noise.",
    url: "/indicators",
  },
};

const rails = [
  [
    "WHAT IT IS",
    "A configurable visual aid for discretionary market analysis.",
  ],
  [
    "WHAT IT SHOWS",
    "Market context, structure and cleaner chart relationships.",
  ],
  [
    "HOW MARKOS USES IT",
    "As one input inside a wider preparation, risk and review process.",
  ],
  [
    "WHO IT'S FOR",
    "Traders who want context while keeping decisions in their own hands.",
  ],
  [
    "WHAT IT DOES NOT DO",
    "It does not guarantee outcomes, predict with certainty or execute trades.",
  ],
  [
    "PLATFORM DETAILS",
    "Check the current product or checkout details for supported platform and access requirements before placing an order. Ask MARKOS through the Contact page if anything is unclear.",
  ],
  [
    "INSTALLATION",
    "Access and installation guidance will follow manual payment verification.",
  ],
  [
    "ACCESS & INSTALLATION",
    "After payment is submitted, the order is reviewed manually. Access and installation instructions are provided after verification; contact MARKOS with your order reference if you need help.",
  ],
] as const;

export default function IndicatorsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / TRADING TOOLS</p>
            <h1>
              SEE MORE
              <br />
              <span>
                WITHOUT
                <br />
                ADDING NOISE.
              </span>
            </h1>
            <p className={styles.lede}>
              A trading indicator should support judgment, not replace it.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.productGrid}>
            <div
              className={styles.productVisual}
              role="img"
              aria-label="Institutional market analysis instrument"
            />
            <article className={styles.productInfo}>
              <p className={styles.label}>MARKOS / INDICATOR 01</p>
              <h2>{indicatorProduct.name}</h2>
              <p>
                Less noise. More context. A restrained analytical layer designed
                to make structure easier to read without pretending to know what
                happens next.
              </p>
              <p>
                The tool is intended to support a discretionary workflow: review
                the chart, define the setup and risk independently, and decide
                whether the conditions meet your own rules. It does not place
                trades or make decisions on your behalf.
              </p>
              <div className={styles.price}>
                <del>${indicatorProduct.originalPrice}</del>
                <strong>${indicatorProduct.offerPrice}</strong>
                <small>{indicatorProduct.discountPercent}% OFF</small>
              </div>
              <ul className={styles.benefits}>
                {indicatorFeatures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                className={styles.action}
                href="/join/checkout?product=indicator"
              >
                GET ACCESS <ArrowUpRight size={17} aria-hidden />
              </Link>
            </article>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>PRODUCT FIELD NOTES</p>
            <h2>USEFUL CONTEXT. HUMAN DECISION.</h2>
          </div>
          <div className={styles.rails}>
            {rails.map(([title, copy]) => (
              <article className={styles.rail} key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className={styles.legal}>
            MARKOS tools assist analysis only. They do not remove trading risk
            or guarantee profits, funding, evaluation success or any market
            outcome.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
