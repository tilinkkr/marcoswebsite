import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "@/app/public-pages.module.css";
export function EditorialPage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lede}>{lede}</p>
        </section>
        <section className={styles.section}>
          <div className={styles.prose}>{children}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
