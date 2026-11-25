import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { INDIA_CITIES } from "@/config/india-cities";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";
import local from "../gcc/gcc.module.css";

const title =
  "Funded Trading Groups Near Me in India — Bangalore, Mumbai, Delhi & More";
const description =
  "Searching for funded firms groups in Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata or Kochi? Join MARKOS's daily live Google Meet funded-account community on WhatsApp.";

export const metadata: Metadata = {
  title: { absolute: `${title} | MARKOS` },
  description,
  alternates: { canonical: "/india" },
  openGraph: { title: `${title} | MARKOS`, description, url: "/india" },
};

const faqs = [
  {
    q: "How do I find legitimate funded trading groups near me in India?",
    a: "Look for a community with transparent weekday live sessions (such as Google Meet screen sharing), written risk management rules, honest RBI/FEMA disclosures, and zero 'guaranteed pass' or account-management offers. MARKOS serves traders across Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, Kochi, and Kerala.",
  },
  {
    q: "Why is a daily Google Meet live trading stream better than an offline 'passing group'?",
    a: "Offline passing groups that trade your funded challenge for you usually breach prop-firm IP and third-party trading rules — getting accounts terminated at payout review. A daily private Google Meet live stream teaches you the execution and drawdown discipline to pass and keep your own funded account.",
  },
  {
    q: "What time are MARKOS live sessions in Indian Standard Time (IST)?",
    a: "Sessions focus on active London and London–New York overlap windows (roughly 1:30 PM – 4:30 PM IST and 6:30 PM – 9:30 PM IST in winter), making them accessible for both full-time traders and working professionals across India.",
  },
  {
    q: "Can beginners in India join MARKOS before buying a funded account?",
    a: "Yes — in fact, learning drawdown rules, lot sizing, and XAUUSD/forex structure before paying an evaluation fee saves beginners from blowing challenges in the first week. Message us on WhatsApp (+91 91875 87488) to ask how it works.",
  },
];

export default function IndiaHubPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I'm searching for a funded trading group in India and want details on your daily Google Meet live stream.",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/india")}#webpage`,
        url: absoluteUrl("/india"),
        name: title,
        description,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
        hasPart: INDIA_CITIES.map((city) => ({
          "@type": "WebPage",
          name: `Funded Account Trading Community in ${city.name}`,
          url: absoluteUrl(`/india/${city.slug}`),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "India Trading Communities",
            item: absoluteUrl("/india"),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              MARKOS / INDIA · FUNDED GROUPS NEAR ME
            </p>
            <h1>Funded account trading groups across India&apos;s prime cities</h1>
            <p className={styles.lede}>
              Looking for funded firms groups in Bangalore, Mumbai, Delhi NCR,
              Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, or Kochi? MARKOS
              connects serious Indian traders in one daily private Google Meet
              live trading stream — focused on prop-firm rules, XAUUSD gold
              context, and strict drawdown discipline.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement="india-hub-hero"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Message MARKOS on WhatsApp — Join Today&apos;s Google Meet
              </WhatsAppLink>
              <Link className={styles.action} href="/funded-account-guide">
                FUNDED ACCOUNT FIELD GUIDE →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>CHOOSE YOUR CITY</p>
            <h2>Local funded-account &amp; live Google Meet trader hubs</h2>
          </div>
          <div className={local.countryGrid}>
            {INDIA_CITIES.map((city) => (
              <Link
                key={city.slug}
                className={local.countryCard}
                href={`/india/${city.slug}`}
              >
                <strong>
                  {city.name}
                  {city.altName ? ` (${city.altName})` : ""}
                </strong>
                <span>{city.state} · IST (UTC+5:30)</span>
                <span>{city.neighborhoods.slice(0, 3).join(" · ")}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>WHY ONLINE GOOGLE MEET BEATS LOCAL SCAMS</p>
            <h2>What to check before joining any funded trading group near you</h2>
          </div>
          <ul className={styles.benefits}>
            <li>
              <strong>Never pay a passing service:</strong> Third-party account
              passing breaches prop-firm rules and risks payout denial.
            </li>
            <li>
              <strong>Verify live transparency:</strong> MARKOS hosts daily
              private Google Meet sessions where context, stops, and reviews are
              shown live — not edited profit screenshots.
            </li>
            <li>
              <strong>Check RBI &amp; FEMA realities:</strong> Understand
              domestic vs. offshore rules and tax reporting with a CA before
              paying evaluation fees.
            </li>
            <li>
              <strong>Start with one message:</strong> Ask all your questions
              free on WhatsApp (+91 91875 87488) before committing a rupee.
            </li>
          </ul>

          <div className={local.faq}>
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <div className={local.ctaBand}>
            <WhatsAppLink
              className={local.whatsapp}
              href={whatsapp}
              placement="india-hub-faq"
              target="_blank"
              rel="noreferrer"
            >
              Ask MARKOS on WhatsApp (+91 91875 87488)
            </WhatsAppLink>
            <Link className={styles.action} href="/kerala">
              KERALA / MALAYALAM HUB →
            </Link>
            <Link className={styles.action} href="/gcc">
              UAE &amp; GCC HUB →
            </Link>
          </div>
          <p className={styles.legal}>
            Education and community only — not SEBI-registered investment
            advice, legal advice, or tax advice. Trading carries substantial
            risk of loss; no pass, funded account, or payout is guaranteed.
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
