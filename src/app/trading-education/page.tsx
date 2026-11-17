import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Trading Education in India",
  description:
    "See what MARKOS trading education covers: market context, risk concepts, evaluation-rule research, decision review and trading process basics.",
  alternates: { canonical: "/trading-education" },
};

const topics = [
  "Market context and reading a trading session",
  "Risk concepts, position discipline, and drawdown awareness",
  "Planning, execution, journaling, and post-session review",
  "How to read prop-evaluation rules without assuming a payout",
  "Using indicators as context—not as guaranteed instructions",
  "Trading psychology and learning from process, not only outcomes",
];

export default function TradingEducationPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, could you share the current trading education topics, learning format, and fees?",
  );

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / TRADING EDUCATION</p>
            <h1>
              BUILD A PROCESS.
              <br />
              <span>UNDERSTAND THE RISK.</span>
            </h1>
            <p className={styles.lede}>
              MARKOS education focuses on how traders study a session, plan,
              manage risk, review execution, and learn together. Ask us for the
              current format and topics before joining; availability can vary.
            </p>
            {whatsapp ? (
              <WhatsAppLink
                className={styles.action}
                href={whatsapp}
                placement="trading-education-landing"
                target="_blank"
                rel="noreferrer"
              >
                ASK ABOUT MARKOS EDUCATION{" "}
                <ArrowUpRight size={17} aria-hidden />
              </WhatsAppLink>
            ) : null}
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>LEARNING AREAS</p>
            <h2>UNDERSTAND THE DECISION BEFORE THE RESULT.</h2>
          </div>
          <ul className={styles.benefits}>
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <p className={styles.legal}>
            These are educational areas, not a promise of a fixed curriculum,
            personal recommendations, profits, evaluation success, or payout.
            Confirm current membership details directly with MARKOS.
          </p>
          <div className={styles.paths}>
            <article className={styles.path}>
              <p className={styles.label}>READ AT YOUR OWN PACE</p>
              <h3>START WITH THE GUIDES.</h3>
              <p>
                Read sourced explainers on evaluation rules, funded accounts,
                market basics, and risk-aware decision-making.
              </p>
              <Link className={styles.action} href="/insights">
                EXPLORE INSIGHTS <ArrowUpRight size={17} aria-hidden />
              </Link>
            </article>
            <article className={styles.path}>
              <p className={styles.label}>LEARN WITH OTHER TRADERS</p>
              <h3>SEE THE COMMUNITY FORMAT.</h3>
              <p>
                Review what membership includes and ask any questions before
                deciding whether it fits your learning needs.
              </p>
              <Link className={styles.action} href="/trading-community">
                ABOUT THE COMMUNITY <ArrowUpRight size={17} aria-hidden />
              </Link>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
