import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { TeamSystem } from "@/components/team/TeamSystem";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import shared from "@/app/public-pages.module.css";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: {
    absolute:
      "Team MARKOS: Rahul Raja, Linu Babu, Tilin Bijoy & Sahal | Trading Desk",
  },
  description:
    "Meet the real traders and builders behind MARKOS across strategy, prop-firm safety, technology, AI workflows, and Malayalam/English education for India, Kerala & GCC.",
  alternates: { canonical: "/team" },
};

const STANDARDS = [
  {
    code: "01 / LIVE EXECUTION",
    title: "Named Mentors, Real Accountability",
    copy: "Every live Google Meet session and published guide carries a real team byline, never anonymous handles or hidden admins.",
  },
  {
    code: "02 / PROP-FIRM AUDITS",
    title: "Written Rules Over Affiliate Hype",
    copy: "We check static vs trailing drawdown clauses, payout rails (Rise/wire), and India/GCC eligibility before discussing any firm.",
  },
  {
    code: "03 / BILINGUAL ACCESS",
    title: "Built for Kerala, India & Global GCC",
    copy: "Members ask questions in English or Malayalam across Kochi, Bangalore, Dubai, Riyadh, Doha, London and New York.",
  },
] as const;

export default function TeamPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi Team MARKOS, I want to speak with your mentors about funded-account prep and daily live Google Meet sessions.",
  );

  return (
    <div className={shared.page}>
      <SiteHeader />
      <main className={shared.main}>
        <section className={shared.hero}>
          <p className={shared.eyebrow}>THE PEOPLE BEHIND MARKOS</p>
          <h1 className={shared.title}>
            REAL TRADERS.
            <br />
            NAMED ACCOUNTABILITY.
          </h1>
          <p className={shared.lede}>
            MARKOS is led by traders, operators, and engineers across Kerala,
            India and the GCC. Every guide, drawdown checklist, and weekday
            Google Meet stream is backed by real people you can message directly.
          </p>
          <div className={styles.heroBar}>
            <span>10+ YRS DESK LEADERSHIP</span>
            <span>ENGLISH &amp; MALAYALAM SUPPORT</span>
            <span>ZERO ANONYMOUS SIGNAL ADMINS</span>
          </div>
        </section>

        <TeamSystem />

        <section
          className={`${shared.section} ${styles.profiles}`}
          aria-labelledby="profiles-title"
        >
          <div className={styles.profilesHeader}>
            <div>
              <p className={shared.sectionLabel}>04 / THE LEADERSHIP DESK</p>
              <h2 id="profiles-title" className={shared.sectionTitle}>
                HUMAN
                <br />
                ACCOUNTABILITY.
              </h2>
            </div>
            <p className={styles.profilesIntro}>
              Click any team member below to inspect their full accountability
              profile, focus areas, and published guides on MARKOS Insights.
            </p>
          </div>

          <div className={styles.grid}>
            {MARCOS_AUTHORS.map((person, i) => (
              <article key={person.slug} className={styles.profile}>
                <div className={styles.profileTop}>
                  <span>0{i + 1}</span>
                  <p>{person.role.toUpperCase()}</p>
                </div>
                <h3>
                  <Link href={authorPath(person.slug)}>
                    {person.name.toUpperCase()}
                  </Link>
                </h3>
                <p className={styles.focusLine}>{person.focus}</p>
                <div className={styles.rule} />
                <p className={styles.copy}>{person.bio}</p>
                <div className={styles.tagList}>
                  {person.knowsAbout.map((topic) => (
                    <span key={topic} className={styles.tag}>
                      {topic}
                    </span>
                  ))}
                </div>
                <Link
                  className={styles.profileLink}
                  href={authorPath(person.slug)}
                >
                  VIEW ACCOUNTABILITY PROFILE
                  <ArrowUpRight size={14} aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.standardsSection}>
          <div className={styles.standardsGrid}>
            {STANDARDS.map((item) => (
              <article key={item.code} className={styles.standardCard}>
                <span>{item.code}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.recruit}>
          <p className={shared.eyebrow}>TALK TO US OR BUILD WITH US</p>
          <h2>
            READY TO LEARN
            <br />
            OR ADD TO
            <br />
            <em>THE SYSTEM?</em>
          </h2>
          <p>
            Message our team directly on WhatsApp (+91 91875 87488) if you want
            to join our daily trading room, or send a request if you are a
            trader, builder, or educator who can strengthen MARKOS.
          </p>
          <div className={styles.recruitActions}>
            <WhatsAppLink
              className={styles.btnGreen}
              href={whatsapp}
              placement="team-bottom-wa"
              target="_blank"
              rel="noreferrer"
              data-whatsapp-primary
            >
              <WhatsAppIcon size={17} />
              MESSAGE TEAM ON WHATSAPP
              <ArrowUpRight size={15} aria-hidden />
            </WhatsAppLink>
            <Link className={styles.btnRed} href="/team/join">
              APPLY TO BUILD WITH MARKOS
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
