import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { getIndiaCity, INDIA_CITIES, type IndiaCity } from "@/config/india-cities";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "@/app/marketing.module.css";
import local from "@/app/gcc/gcc.module.css";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return INDIA_CITIES.map((city) => ({ city: city.slug }));
}

function cityTitle(city: IndiaCity) {
  return `Funded Account & Prop Firm Trading Group in ${city.name}${city.altName ? ` (${city.altName})` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getIndiaCity((await params).city);
  if (!city) return {};
  const path = `/india/${city.slug}`;
  const title = cityTitle(city);
  const description = `Searching for funded firms groups in ${city.name} or funded trading groups near me? Join MARKOS's daily private Google Meet live trading stream for traders in ${city.neighborhoods.slice(0, 3).join(", ")} and across ${city.state}.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | MARKOS`, description, url: path },
  };
}

export default async function IndiaCityPage({ params }: Props) {
  const city = getIndiaCity((await params).city);
  if (!city) notFound();

  const path = `/india/${city.slug}`;
  const whatsapp = getWhatsAppUrl(
    `Hi MARKOS, I'm a trader in ${city.name} looking for a funded account community and your daily live Google Meet stream. How do I join?`,
  );

  const faqs = [
    ...city.extraFaqs,
    {
      q: `Is a funded account legal for traders in ${city.name}, India?`,
      a: "There is no one-word legal answer. Under RBI and FEMA rules, Indian residents may trade permitted currency derivatives only on recognised Indian exchanges through SEBI-registered brokers. Global prop-firm evaluations are typically structured as simulated skill assessments — check current RBI/FEMA guidance and consult a qualified CA before paying.",
    },
    {
      q: `How do traders in ${city.name} get payouts from prop firms like FundingPips or Alpha Capital?`,
      a: "Most global prop firms pay verified rewards via Riseworks, international wire transfer, or stablecoin crypto rails rather than direct UPI. Always verify current payout routes, KYC requirements, and Indian income-tax reporting with a Chartered Accountant.",
    },
    {
      q: `How does MARKOS's daily Google Meet live trading stream help ${city.name} traders?`,
      a: `Every weekday in IST, MARKOS runs a private live Google Meet session covering market context, XAUUSD gold and forex levels, 0.5%–1% risk sizing, and honest post-session trade reviews — helping ${city.name} traders build consistency without buying risky passing services.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name: cityTitle(city),
        inLanguage: "en-IN",
        about: [
          { "@type": "City", name: city.name },
          { "@type": "State", name: city.state },
          { "@type": "Thing", name: "Funded trading account" },
          { "@type": "Thing", name: "Daily Google Meet live trading stream" },
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
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
            name: "India",
            item: absoluteUrl("/india"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: city.name,
            item: absoluteUrl(path),
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

  const otherCities = INDIA_CITIES.filter((c) => c.slug !== city.slug).slice(
    0,
    6,
  );

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              MARKOS / INDIA / {city.name.toUpperCase()}
            </p>
            <h1>
              Funded account &amp; live Google Meet trading community in{" "}
              {city.name}
            </h1>
            <p className={styles.lede}>
              <strong>Quick answer:</strong> Searching for funded firms groups in{" "}
              {city.name} ({city.neighborhoods.slice(0, 4).join(", ")})? MARKOS
              runs a daily private Google Meet live trading stream, prop-firm
              rule education (FundingPips, FTMO, Alpha Capital), and strict risk
              review for traders across {city.name} and {city.state}.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement={`india-${city.slug}-hero`}
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Join from {city.name} on WhatsApp (+91 91875 87488)
              </WhatsAppLink>
              <Link className={styles.action} href="/funded-account-guide">
                FUNDED ACCOUNT RULES GUIDE →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>FOR TRADERS IN {city.name.toUpperCase()}</p>
            <h2>Built for how {city.name} traders actually trade</h2>
          </div>
          <p>{city.traderProfile}</p>
          <p>{city.localAngle}</p>

          <div className={local.table}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">{city.name} time (IST)</th>
                  <th scope="col">Focus inside MARKOS Google Meet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>London Open</td>
                  <td>1:30 PM – 4:30 PM IST (winter)</td>
                  <td>Asian high/low sweeps, EURUSD, GBPUSD &amp; XAUUSD context</td>
                </tr>
                <tr>
                  <td>London–NY Overlap</td>
                  <td>6:30 PM – 9:30 PM IST (winter)</td>
                  <td>Prime XAUUSD volatility, risk sizing &amp; after-work live review</td>
                </tr>
                <tr>
                  <td>Daily Review &amp; Q&amp;A</td>
                  <td>Weekdays on Google Meet &amp; WhatsApp</td>
                  <td>Drawdown protection, consistency rules &amp; journal breakdowns</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>ESSENTIAL GUIDES</p>
            <h2>Read before paying for any funded account from {city.name}</h2>
          </div>
          <ul className={local.links}>
            <li>
              <Link href="/insights/fundingpips-rules-explained-challenge-rewards-pdf-checklist">
                FundingPips rules explained (2024–2026) &amp; printable PDF checklist
              </Link>
            </li>
            <li>
              <Link href="/insights/safest-prop-firms-and-payouts-in-india-ftmo-legal-guide-2026">
                Which prop firm is safe now? Payouts in India &amp; FTMO legal check
              </Link>
            </li>
            <li>
              <Link href="/insights/how-to-link-funded-account-tradingview-mt5-tradovate">
                How to link a funded account to TradingView, MT5 &amp; Tradovate
              </Link>
            </li>
            <li>
              <Link href="/insights/funded-account-in-india-meaning-price-free-challenge-2026">
                Funded account kya hota hai? Meaning, price, free challenges &amp; India rules
              </Link>
            </li>
            <li>
              <Link href="/insights/how-to-use-claude-for-trading-in-india-1000-dollar-workflow">
                Using Claude AI for trading in India: real prompt workflow &amp; risk rules
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>FAQ · {city.name.toUpperCase()}</p>
            <h2>Questions from {city.name} traders</h2>
          </div>
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
              placement={`india-${city.slug}-faq`}
              target="_blank"
              rel="noreferrer"
            >
              Message MARKOS from {city.name} on WhatsApp
            </WhatsAppLink>
            <Link className={styles.action} href="/india">
              ALL INDIAN CITIES →
            </Link>
          </div>

          <div className={styles.sectionHeader}>
            <p className={styles.label}>OTHER INDIAN CITIES</p>
            <h2>Nearby MARKOS city guides</h2>
          </div>
          <div className={local.countryGrid}>
            {otherCities.map((other) => (
              <Link
                key={other.slug}
                className={local.countryCard}
                href={`/india/${other.slug}`}
              >
                <strong>{other.name}</strong>
                <span>{other.state}</span>
              </Link>
            ))}
          </div>

          <p className={styles.legal}>
            Education and community only — not SEBI-registered investment
            advice, legal advice, or tax advice. Prop-firm evaluations carry a
            high risk of loss and no pass, funding, or payout is guaranteed.
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
