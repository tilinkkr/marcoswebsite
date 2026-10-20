import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MoreIndex } from "@/components/more/MoreIndex";
import styles from "@/app/public-pages.module.css";
export const metadata: Metadata = {
  title: "More",
  description:
    "Explore MARKOS trading education, team profiles, the trading process, membership details, indicators, FAQs, contact routes, and risk information.",
  alternates: { canonical: "/more" },
};
export default function MorePageThis() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>MARKOS / MORE</p>
          <h1 className={styles.title}>
            KNOW THE PEOPLE.
            <br />
            UNDERSTAND THE SYSTEM.
            <br />
            STUDY THE PROCESS.
          </h1>
          <p className={styles.lede}>
            Everything behind MARKOS — our story, resources, answers and ways to
            reach us.
          </p>
        </section>
        <section className={styles.section}>
          <MoreIndex />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
