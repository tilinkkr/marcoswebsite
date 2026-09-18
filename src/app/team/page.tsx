import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TeamSystem } from "@/components/team/TeamSystem";
import shared from "@/app/public-pages.module.css";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the people responsible for MARCOS strategy, operations, technology and trading education.",
  alternates: { canonical: "/team" },
};
const people = [
  [
    "RAHUL RAJA",
    "FOUNDER",
    "Rahul sets the direction for MARCOS — shaping the community, its standards and the long-term vision behind the platform.",
  ],
  [
    "LINU",
    "CEO",
    "Linu leads operations and execution across MARCOS, turning the vision into a community and product that can scale.",
  ],
  [
    "TILIN",
    "CTO",
    "Tilin leads MARCOS technology — from the product experience and backend systems to the tools that support the community.",
  ],
  [
    "SAHAL",
    "CONTENT & COMMUNITY",
    "Sahal supports MARCOS through market-focused content, communication and community interaction.",
  ],
] as const;
export default function TeamPage() {
  return (
    <div className={shared.page}>
      <SiteHeader />
      <main className={shared.main}>
        <section className={shared.hero}>
          <p className={shared.eyebrow}>THE PEOPLE BEHIND MARCOS</p>
          <h1 className={shared.title}>
            DIFFERENT ROLES.
            <br />
            ONE STANDARD.
          </h1>
          <p className={shared.lede}>
            MARCOS is built across strategy, operations, technology, content and
            community accountability.
          </p>
        </section>
        <TeamSystem />
        <section
          className={`${shared.section} ${styles.profiles}`}
          aria-labelledby="profiles-title"
        >
          <div>
            <p className={shared.sectionLabel}>04 / THE TEAM</p>
            <h2 id="profiles-title" className={shared.sectionTitle}>
              HUMAN
              <br />
              ACCOUNTABILITY.
            </h2>
          </div>
          <div className={styles.grid}>
            {people.map(([name, role, copy], i) => (
              <article key={name} className={styles.profile}>
                <span>0{i + 1}</span>
                <p>{role}</p>
                <h3>{name}</h3>
                <div className={styles.rule} />
                <p className={styles.copy}>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.recruit}>
          <p className={shared.eyebrow}>WANT TO BUILD WITH MARCOS?</p>
          <h2>
            IF YOU THINK
            <br />
            YOU CAN ADD
            <br />
            TO THE SYSTEM,
            <br />
            <em>TELL US HOW.</em>
          </h2>
          <p>
            We&apos;re always open to hearing from traders, builders, creators
            and operators who believe they can contribute meaningfully to
            MARCOS.
          </p>
          <Link className={shared.cta} href="/team/join">
            SEND A REQUEST →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
