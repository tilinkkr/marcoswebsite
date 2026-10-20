import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TeamSystem } from "@/components/team/TeamSystem";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import shared from "@/app/public-pages.module.css";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the people responsible for MARKOS strategy, operations, technology and trading education.",
  alternates: { canonical: "/team" },
};
export default function TeamPage() {
  return (
    <div className={shared.page}>
      <SiteHeader />
      <main className={shared.main}>
        <section className={shared.hero}>
          <p className={shared.eyebrow}>THE PEOPLE BEHIND MARKOS</p>
          <h1 className={shared.title}>
            DIFFERENT ROLES.
            <br />
            ONE STANDARD.
          </h1>
          <p className={shared.lede}>
            MARKOS is built across strategy, operations, technology, content and
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
            {MARCOS_AUTHORS.map((person, i) => (
              <article key={person.slug} className={styles.profile}>
                <span>0{i + 1}</span>
                <p>{person.role.toUpperCase()}</p>
                <h3>
                  <Link href={authorPath(person.slug)}>
                    {person.name.toUpperCase()}
                  </Link>
                </h3>
                <div className={styles.rule} />
                <p className={styles.copy}>{person.bio}</p>
                <Link
                  className={styles.profileLink}
                  href={authorPath(person.slug)}
                >
                  VIEW ACCOUNTABILITY PROFILE →
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.recruit}>
          <p className={shared.eyebrow}>WANT TO BUILD WITH MARKOS?</p>
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
            MARKOS.
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
