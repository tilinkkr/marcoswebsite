import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { FUNDED_PARTNERS } from "@/config/funded-partners";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";
import local from "../gcc/gcc.module.css";

const title = "Get a Funded Trading Account — India, Kerala & GCC";
const description =
  "Want a funded account? MARKOS helps traders in Kerala, India and the GCC choose the right prop firm, prepare for the challenge and avoid passing scams. Start with one WhatsApp message.";

export const metadata: Metadata = {
  title: { absolute: `${title} | MARKOS` },
  description,
  alternates: { canonical: "/get-funded" },
  openGraph: { title: `${title} | MARKOS`, description, url: "/get-funded" },
};

const steps = [
  {
    title: "Message us on WhatsApp",
    body: "Tell us your experience, budget and whether you trade forex, gold or futures. Free to ask.",
  },
  {
    title: "Pick the right challenge",
    body: "We help you compare rules, drawdown, minimum days and payout terms for your country — India, UAE, Saudi, Qatar, Kuwait, Oman or Bahrain.",
  },
  {
    title: "Prepare with the community",
    body: "Practise with a written risk plan, weekday live sessions and trade reviews before you pay the fee.",
  },
  {
    title: "Take the challenge yourself",
    body: "You trade your own account. No passing services, no account sharing — so your payout isn't put at risk.",
  },
];

export default function GetFundedPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I want to get a funded account. Can you help me choose the right prop firm and prepare?",
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: "How to get a funded trading account with MARKOS",
        description,
        step: steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/get-funded")}#webpage`,
        url: absoluteUrl("/get-funded"),
        name: title,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / GET FUNDED</p>
            <h1>Get a funded trading account — the right way</h1>
            <p className={styles.lede}>
              Many traders buy a prop-firm challenge and lose the fee within
              days. MARKOS helps you choose the right funded account for your
              country and prepare properly first — for traders in Kerala, across
              India and in the GCC.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement="get-funded-hero"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Get funded — message us on WhatsApp
              </WhatsAppLink>
              <Link
                className={styles.action}
                href="/insights/top-10-prop-firms-funded-accounts-compared"
              >
                COMPARE 10 PROP FIRMS →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>HOW IT WORKS</p>
            <h2>Four steps to your funded account</h2>
          </div>
          <ol className={styles.benefits}>
            {steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}.</strong> {step.body}
              </li>
            ))}
          </ol>

          {FUNDED_PARTNERS.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <p className={styles.label}>PARTNER LINKS</p>
                <h2>Start a challenge through our links</h2>
              </div>
              <div className={local.countryGrid}>
                {FUNDED_PARTNERS.map((partner) => (
                  <a
                    key={partner.name}
                    className={local.countryCard}
                    href={partner.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                  >
                    <strong>{partner.name}</strong>
                    {partner.note && <span>{partner.note}</span>}
                    {partner.code && <span>Code: {partner.code}</span>}
                  </a>
                ))}
              </div>
              <p className={styles.legal}>
                Disclosure: these are partner links. MARKOS may earn a
                commission if you buy a challenge through them, at no extra cost
                to you. We are not the prop firm and cannot guarantee a pass or
                payout — read the firm&apos;s current terms first.
              </p>
            </>
          )}

          <div className={styles.sectionHeader}>
            <p className={styles.label}>READ BEFORE YOU BUY</p>
            <h2>Free guides</h2>
          </div>
          <ul className={local.links}>
            <li>
              <Link href="/insights/top-10-prop-firms-funded-accounts-compared">
                Best funded accounts: top 10 prop firms compared
              </Link>
            </li>
            <li>
              <Link href="/insights/most-affordable-prop-firm-for-beginners">
                Most affordable prop firm for beginners
              </Link>
            </li>
            <li>
              <Link href="/insights/easiest-way-to-pass-prop-firm-challenge">
                The easiest way to pass a prop firm challenge
              </Link>
            </li>
            <li>
              <Link href="/insights/forex-prop-firms-india-legal-checklist">
                Is a funded account legal in India?
              </Link>
            </li>
            <li>
              <Link href="/gcc">
                Funded accounts from the GCC, country by country
              </Link>
            </li>
          </ul>
          <p className={styles.legal}>
            Prop-firm challenges are paid evaluations and most traders do not
            pass. Funded stages are often simulated and rewards depend on each
            firm&apos;s terms. Education only — not financial, legal or tax
            advice.
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
