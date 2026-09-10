import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { membershipBenefits, membershipProduct } from "@/config/products";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Build a more deliberate trading process through MARCOS community, education, risk frameworks and review.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "MARCOS Membership",
    description:
      "A serious environment for traders building process, discipline and market understanding.",
    url: "/join",
  },
};

export default function JoinPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARCOS, I'd like to know more about joining the community.",
  );
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARCOS / MEMBERSHIP</p>
            <h1>
              BUILD YOUR PROCESS
              <br />
              <span>
                AROUND PEOPLE
                <br />
                DOING THE SAME.
              </span>
            </h1>
            <p className={styles.lede}>
              Community, education, market discussion, risk frameworks and
              structured improvement.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>TWO WAYS IN</p>
            <h2>CHOOSE THE NEXT CONVERSATION.</h2>
          </div>
          <div className={styles.paths}>
            <article className={styles.path}>
              <p className={styles.label}>OPTION 01 / MARCOS MEMBERSHIP</p>
              <h3>
                ENTER THE
                <br />
                COMMUNITY.
              </h3>
              <div className={styles.price}>
                <del>${membershipProduct.originalPrice}</del>
                <strong>${membershipProduct.offerPrice}</strong>
                <small>{membershipProduct.discountPercent}% OFFER</small>
              </div>
              <Link className={styles.action} href="/join/checkout">
                CONTINUE TO MEMBERSHIP <ArrowUpRight size={17} aria-hidden />
              </Link>
            </article>
            <article className={styles.path}>
              <p className={styles.label}>OPTION 02 / QUESTIONS FIRST?</p>
              <h3>
                TALK TO
                <br />
                MARCOS.
              </h3>
              <p>
                Ask what the membership includes and decide without pressure.
              </p>
              {whatsapp ? (
                <a
                  className={`${styles.action} ${styles.actionMuted}`}
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WHATSAPP US <ArrowUpRight size={17} aria-hidden />
                </a>
              ) : (
                <span
                  className={`${styles.action} ${styles.actionMuted}`}
                  aria-disabled="true"
                >
                  WHATSAPP NUMBER PENDING
                </span>
              )}
            </article>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>WHAT MEMBERSHIP SUPPORTS</p>
            <h2>A PLACE TO STUDY, EXECUTE, REVIEW AND IMPROVE.</h2>
          </div>
          <ul className={styles.benefits}>
            {membershipBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.legal}>
            MARCOS provides education and community, not financial advice or
            guaranteed outcomes. Billing frequency, refund and cancellation
            terms remain subject to approved business policy and legal review.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
