import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { membershipBenefits, membershipProduct } from "@/config/products";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./join.module.css";

export const metadata: Metadata = {
  title: "Join MARKOS ($100 Founding Pass): Daily Google Meet & Mentor Desk",
  description:
    "Join MARKOS for $100 (50% off $200): weekday live Google Meet streams, 0.5% funded-account risk rules, XAUUSD & NASDAQ (MNQ) reviews for India, Kerala & GCC traders.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "Join MARKOS ($100 Founding Pass) | MARKOS",
    description:
      "Daily private Google Meet trading stream, mentor review, and funded-account risk discipline for India, Kerala & GCC traders.",
    url: "/join",
  },
};

const ROADMAP = [
  {
    week: "WEEK 01",
    title: "Rule Audit & 0.5% Risk Lock",
    copy: "We check your prop-firm drawdown rules (static vs trailing), lock your exact lot-size table for XAUUSD / FX / MNQ, and set a hard 1% daily stop.",
  },
  {
    week: "WEEK 02",
    title: "Daily Live Google Meet Execution",
    copy: "Join our weekday London to New York overlap sessions (6:30 PM IST / 5:00 PM Dubai GST) to see pre-market levels, invalidation points, and when NOT to trade.",
  },
  {
    week: "WEEK 03",
    title: "Honest Trade-Log & Mistake Review",
    copy: "Share your real trades for direct mentor critique. Fix early entries, over-leveraging, and revenge clicks before they erase your drawdown buffer.",
  },
  {
    week: "WEEK 04",
    title: "Consistent Challenge Execution",
    copy: "Run your calm 0.5% risk loop across 15 to 20 sessions with community accountability across India, Kerala, UAE/GCC, UK & USA.",
  },
] as const;

const SESSION_CLOCK = [
  { region: "Kerala & India (IST)", london: "1:30 PM IST", prime: "6:30 PM - 9:30 PM IST" },
  { region: "Dubai, UAE & Oman (GST)", london: "12:00 PM GST", prime: "5:00 PM - 8:00 PM GST" },
  { region: "Saudi, Qatar, Kuwait & Bahrain (AST)", london: "11:00 AM AST", prime: "4:00 PM - 7:00 PM AST" },
  { region: "United Kingdom (GMT)", london: "8:00 AM GMT", prime: "1:00 PM - 4:00 PM GMT" },
  { region: "USA & Canada Eastern (EST)", london: "3:00 AM EST", prime: "8:00 AM - 11:00 AM EST" },
] as const;

const JOIN_FAQS = [
  {
    q: "What is included in the $100 MARKOS Founding Pass?",
    a: "You get access to our weekday private Google Meet live trading streams, funded-account rule and drawdown checklists, XAUUSD / Forex / NASDAQ (MNQ) decision reviews, indicator access, and our English & Malayalam trader community across India, Kerala and the GCC.",
  },
  {
    q: "Can I ask questions on WhatsApp before paying $100?",
    a: "Yes. Message +91 91875 87488 on WhatsApp first. Our team explains the current Google Meet schedule and answers questions in English or Malayalam with zero sales pressure.",
  },
  {
    q: "Do I need a funded account before joining MARKOS?",
    a: "No. Many members join on demo first so they stop wasting evaluation fees. When you are ready to start a challenge, you can open one through our verified BrightFunded partner link or any prop firm whose rules you verify.",
  },
  {
    q: "Does MARKOS guarantee challenge passes or profits?",
    a: "Never. MARKOS is an educational trading community, not a SEBI-registered adviser or signal provider. Trading carries substantial risk of loss and every execution decision stays 100% yours.",
  },
] as const;

export default function JoinPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I want to know more about the $100 Founding Pass and today's daily Google Meet live trading session.",
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/join")}#faq`,
    mainEntity: JOIN_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>MARKOS / FOUNDING MEMBERSHIP</p>
              <h1>
                STOP TRADING ALONE.
                <br />
                <span>JOIN THE LIVE DESK.</span>
              </h1>
              <p className={styles.lede}>
                Weekday private Google Meet live streams, 0.5% fixed-risk
                discipline, and real mentor review for India, Kerala, UAE/GCC,
                UK and USA traders preparing for funded accounts.
              </p>
              <div className={styles.heroCtas}>
                <Link className={styles.btnRed} href="/join/checkout">
                  JOIN MARKOS (${membershipProduct.offerPrice})
                  <ArrowUpRight size={16} aria-hidden />
                </Link>
                <WhatsAppLink
                  className={styles.btnGreen}
                  href={whatsapp}
                  placement="join-hero-wa"
                  target="_blank"
                  rel="noreferrer"
                  data-whatsapp-primary
                >
                  <WhatsAppIcon size={17} />
                  ASK ON WHATSAPP FIRST
                  <ArrowUpRight size={15} aria-hidden />
                </WhatsAppLink>
              </div>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/images/studio/markos-mentor-chart-session.webp"
                alt="MARKOS mentor breaking down live candlestick market structure with community traders"
                width={1440}
                height={960}
                preload
                sizes="(max-width: 960px) 100vw, 46vw"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <p className={styles.label}>THREE WAYS TO START</p>
            <h2>PICK THE EXACT PATH THAT FITS YOU TODAY.</h2>
          </header>

          <div className={styles.pathsGrid}>
            <article className={`${styles.pathCard} ${styles.pathFeatured}`}>
              <span className={styles.pathTag}>OPTION 01 / MOST POPULAR</span>
              <h3>MARKOS Founding Pass</h3>
              <div className={styles.priceRow}>
                <del>${membershipProduct.originalPrice}</del>
                <strong>${membershipProduct.offerPrice}</strong>
                <span>{membershipProduct.discountPercent}% OFF</span>
              </div>
              <p>
                Full access to our daily private Google Meet live streams,
                mentor review, risk sheets, and India/Kerala/GCC community.
              </p>
              <ul className={styles.miniList}>
                {membershipBenefits.slice(0, 5).map((benefit) => (
                  <li key={benefit}>
                    <Check size={14} aria-hidden />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link className={styles.btnRedFull} href="/join/checkout">
                CONTINUE TO CHECKOUT (${membershipProduct.offerPrice})
                <ArrowUpRight size={16} aria-hidden />
              </Link>
            </article>

            {FEATURED_PARTNER ? (
              <article className={styles.pathCard}>
                <span className={styles.pathTag}>OPTION 02 / PARTNER LINK</span>
                <h3>Start a Funded Account</h3>
                <p>
                  Need a clean prop-firm evaluation for Forex, XAUUSD Gold or
                  US100 NASDAQ? Start via MARKOS&apos;s verified{" "}
                  {FEATURED_PARTNER.name} partner link, then ask our mentors to
                  audit your daily drawdown math before trade #1.
                </p>
                <small className={styles.disclosure}>
                  Disclosed affiliate link: MARKOS may earn a partner commission
                  at zero extra cost to you.
                </small>
                <a
                  className={styles.btnRedFull}
                  href={FEATURED_PARTNER.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <ShieldCheck size={16} aria-hidden />
                  START VIA {FEATURED_PARTNER.name.toUpperCase()}
                  <ArrowUpRight size={15} aria-hidden />
                </a>
              </article>
            ) : null}

            <article className={styles.pathCard}>
              <span className={styles.pathTagGreen}>
                OPTION 03 / FREE TO ASK
              </span>
              <h3>Talk to Our Team First</h3>
              <p>
                Unsure which prop firm fits India, Kerala, Dubai/UAE, Saudi,
                Qatar, UK or USA? Message our team directly on WhatsApp (+91
                91875 87488) in English or Malayalam before spending a rupee.
              </p>
              <WhatsAppLink
                className={styles.btnGreenFull}
                href={whatsapp}
                placement="membership-question"
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={17} />
                MESSAGE ON WHATSAPP
                <ArrowUpRight size={15} aria-hidden />
              </WhatsAppLink>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <p className={styles.label}>YOUR FIRST 30 DAYS</p>
            <h2>HOW MEMBERS BUILD FUNDED-ACCOUNT DISCIPLINE.</h2>
          </header>
          <div className={styles.roadmapGrid}>
            {ROADMAP.map((step) => (
              <article key={step.week} className={styles.roadmapCard}>
                <span>{step.week}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <p className={styles.label}>LIVE SESSION CLOCK</p>
            <h2>BUILT FOR INDIA, KERALA, GCC, UK &amp; USA HOURS.</h2>
          </header>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Region / Time Zone</th>
                  <th scope="col">London Open</th>
                  <th scope="col">Prime Gold &amp; NASDAQ Window</th>
                </tr>
              </thead>
              <tbody>
                {SESSION_CLOCK.map((row) => (
                  <tr key={row.region}>
                    <td>{row.region}</td>
                    <td>{row.london}</td>
                    <td>{row.prime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.faqList}>
            {JOIN_FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <p className={styles.legal}>
            MARKOS provides trading education and community, not SEBI-registered
            investment advice or guaranteed outcomes. Review our{" "}
            <Link href="/risk-disclosure">risk disclosure</Link> and{" "}
            <Link href="/terms">terms</Link> before checkout.
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
