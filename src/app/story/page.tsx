import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck, X } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./story.module.css";

export const metadata: Metadata = {
  title: "Our Story: Why We Built MARKOS for India, Kerala & GCC Traders",
  description:
    "How MARKOS started in Kerala to replace Telegram signal noise and illegal account passers with daily live Google Meet streams, 0.5% risk rules, and real mentor review across India & the GCC.",
  alternates: { canonical: "/story" },
};

const PILLARS = [
  {
    num: "01",
    tag: "THE PROBLEM WE SAW",
    title: "Good traders kept blowing accounts in silence.",
    body: "Across Kerala, Bangalore, Mumbai and the Gulf, hardworking traders were paying ₹10,000 to ₹50,000 for prop-firm evaluations, then losing them in week one because they had no live desk, no daily stop rule, and only noisy Telegram signal groups for company.",
  },
  {
    num: "02",
    tag: "THE KERALA & GCC BRIDGE",
    title: "Built for Malayali & Indian evening schedules.",
    body: "Most serious traders in Dubai, Abu Dhabi, Riyadh, Doha, Kuwait, Muscat and Kerala work full-time jobs. We aligned our live Google Meet rooms around the exact London to New York overlap (6:30 PM IST / 5:00 PM Dubai GST) so working professionals can study live order flow after office hours.",
  },
  {
    num: "03",
    tag: "THE DAILY GOOGLE MEET LOOP",
    title: "Plan, observe live, size at 0.5%, and review honestly.",
    body: "Instead of hiding losing days behind edited profit screenshots, every MARKOS weekday session walks through pre-market levels on XAUUSD, Forex and NASDAQ (MNQ), defines stop-loss invalidation before entry, and grades every trade on rule discipline.",
  },
  {
    num: "04",
    tag: "NO SHORTCUTS, NO LOGIN SHARING",
    title: "Pass in your own name so you keep every payout.",
    body: "Account-passing bots and login-sharing services break prop-firm rules and trigger payout bans. Our standard is simple: build real execution discipline with live mentor support so every evaluation you pass belongs 100% to your skill.",
  },
] as const;

const WHAT_WE_ARE = [
  "A weekday live Google Meet desk for India, Kerala, GCC, UK & USA traders",
  "Honest prop-firm rule audits across BrightFunded, FundingPips, FTMO & Alpha Capital",
  "Fixed 0.25% to 0.5% risk sizing for XAUUSD (Gold), Forex & NASDAQ (MNQ)",
  "Plain-language guidance in English and Malayalam from real desk operators",
  "Transparent partner links clearly marked with rel=\"sponsored\" disclosures",
];

const WHAT_WE_ARE_NOT = [
  "Not a SEBI-registered investment adviser or guaranteed-return signal room",
  "Not a third-party account passer or login-sharing service",
  "Not a broker taking client capital deposits or managing personal accounts",
  "Never promising 3-day passes, risk-free profits, or overnight wealth",
];

export default function StoryPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I just read your story and want to learn how your daily Google Meet desk and community work.",
  );

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>MARKOS / OUR STORY</p>
              <h1>
                BUILT FOR TRADERS
                <br />
                <span>TIRED OF NOISE.</span>
              </h1>
              <p className={styles.lede}>
                MARKOS started with one frustration: too many disciplined people
                in Kerala, India and the GCC were burning real money on hype
                signals and blown prop challenges. We built the live room we
                wished existed on day one.
              </p>
              <div className={styles.heroStats}>
                <div>
                  <strong>10+ YRS</strong>
                  <span>LEAD DESK EXPERIENCE</span>
                </div>
                <div>
                  <strong>0.5% CAP</strong>
                  <span>FIXED RISK STANDARD</span>
                </div>
                <div>
                  <strong>MON - FRI</strong>
                  <span>LIVE GOOGLE MEET</span>
                </div>
                <div>
                  <strong>EN / ML</strong>
                  <span>INDIA, KERALA &amp; GCC</span>
                </div>
              </div>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/images/insights/passed-funded-account-1-month-mentor-guide.jpg"
                alt="MARKOS mentors reviewing structured risk charts during a live desk session"
                width={1280}
                height={720}
                preload
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <p className={styles.label}>HOW WE GOT HERE</p>
            <h2>FOUR PRINCIPLES THAT SHAPE EVERY SESSION.</h2>
          </header>
          <div className={styles.pillarGrid}>
            {PILLARS.map((item) => (
              <article key={item.num} className={styles.pillarCard}>
                <div className={styles.pillarTop}>
                  <span>{item.num}</span>
                  <strong>{item.tag}</strong>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <p className={styles.label}>RADICAL TRANSPARENCY</p>
            <h2>WHAT MARKOS IS, AND WHAT IT WILL NEVER BE.</h2>
          </header>
          <div className={styles.compareGrid}>
            <article className={`${styles.compareCard} ${styles.compareYes}`}>
              <span className={styles.compareBadgeYes}>WHAT WE DELIVER</span>
              <ul>
                {WHAT_WE_ARE.map((point) => (
                  <li key={point}>
                    <Check size={16} aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className={`${styles.compareCard} ${styles.compareNo}`}>
              <span className={styles.compareBadgeNo}>OUR HARD LINES</span>
              <ul>
                {WHAT_WE_ARE_NOT.map((point) => (
                  <li key={point}>
                    <X size={16} aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <div>
              <p className={styles.label}>NEXT STEP</p>
              <h2>READY TO REPLACE GUESSWORK WITH A LIVE DESK?</h2>
              <p className={styles.ctaCopy}>
                Ask our team anything free on WhatsApp (+91 91875 87488), review
                our $100 Founding Pass, or open your evaluation via our verified
                partner link.
              </p>
            </div>
            <div className={styles.ctaButtons}>
              <WhatsAppLink
                className={styles.btnGreen}
                href={whatsapp}
                placement="story-bottom-wa"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                <WhatsAppIcon size={17} />
                MESSAGE ON WHATSAPP
                <ArrowUpRight size={15} aria-hidden />
              </WhatsAppLink>
              {FEATURED_PARTNER ? (
                <a
                  className={styles.btnRed}
                  href={FEATURED_PARTNER.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <ShieldCheck size={17} aria-hidden />
                  START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()})
                  <ArrowUpRight size={15} aria-hidden />
                </a>
              ) : null}
              <Link className={styles.btnRed} href="/join">
                EXPLORE $100 MEMBERSHIP
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
          <p className={styles.legal}>
            Educational community only. Trading forex, gold (XAUUSD), NASDAQ
            (MNQ) and prop-firm evaluations carries real risk of loss. Read our{" "}
            <Link href="/risk-disclosure">risk disclosure</Link> and{" "}
            <Link href="/team">meet the team</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
