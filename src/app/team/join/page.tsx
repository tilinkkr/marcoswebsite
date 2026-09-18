import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TeamApplicationForm } from "@/components/forms/TeamApplicationForm";
import styles from "@/app/public-pages.module.css";
export const metadata: Metadata = {
  title: "Build with MARCOS",
  description:
    "Tell MARCOS how you can contribute across trading, content, technology, design, operations or community.",
  alternates: { canonical: "/team/join" },
};
export default function TeamJoinPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>TEAM / OPEN REQUEST</p>
          <h1 className={styles.title}>
            ADD TO
            <br />
            THE SYSTEM.
          </h1>
          <p className={styles.lede}>
            This is not a job listing. It is a direct line for people who
            believe they can contribute meaningfully to MARCOS.
          </p>
        </section>
        <section className={styles.section}>
          <TeamApplicationForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
