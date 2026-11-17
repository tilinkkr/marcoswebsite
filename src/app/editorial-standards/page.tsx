import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Editorial Standards and Corrections",
  description:
    "How MARKOS identifies authorship and review, handles corrections, cites sources, and distinguishes automated checks from human review.",
  alternates: { canonical: "/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / EDITORIAL STANDARDS</p>
            <h1>
              CLEAR SOURCES.
              <br />
              <span>REAL ACCOUNTABILITY.</span>
            </h1>
            <p className={styles.lede}>
              MARKOS is responsible for the material it publishes. This page
              explains who is credited, what our review labels mean, and how to
              report an error.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>WHO / HOW / CORRECTIONS</p>
            <h2>THE LABEL SHOULD MATCH THE WORK.</h2>
          </div>
          <div className={styles.paths}>
            <article className={styles.path}>
              <p className={styles.label}>01 / AUTHORS</p>
              <h3>BYLINES ARE EVIDENCE, NOT DECORATION.</h3>
              <p>
                An article credited to a person links to that person’s public
                MARKOS profile. We do not infer trading results, licences,
                credentials, or specialist experience from a job title.
              </p>
              <Link className={styles.action} href="/team">
                MEET THE TEAM <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article className={styles.path}>
              <p className={styles.label}>02 / REVIEW</p>
              <h3>HUMAN AND AUTOMATED CHECKS ARE DISTINCT.</h3>
              <p>
                A named reviewer is shown only when a person reviewed the
                article. “AI-assisted; no human review” means automated checks
                were recorded, not that a person approved the article.
              </p>
              <Link className={styles.action} href="/insights">
                READ MARKOS INSIGHTS <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>REPORT A CORRECTION</p>
            <h2>HELP US CHECK THE EXACT CLAIM.</h2>
          </div>
          <ul className={styles.benefits}>
            <li>Include the article URL and the exact sentence in question.</li>
            <li>Link to a primary or authoritative source where possible.</li>
            <li>
              We assess reports and correct material errors when verified.
            </li>
            <li>
              Updated pages show their updated date; no response time is
              promised.
            </li>
          </ul>
          <p className={styles.legal}>
            MARKOS publishes educational material, not personalised financial,
            legal, or tax advice. Automated checks can miss errors. Third-party
            rules and official guidance may change; readers should verify
            current information at its source.
          </p>
          <Link className={styles.action} href="/contact">
            CONTACT MARKOS ABOUT A CORRECTION <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
