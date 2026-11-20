import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { GCC_COUNTRIES } from "@/config/gcc";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";
import local from "./gcc.module.css";

const title = "Forex & Funded Account Community for Malayalis in the GCC";
const description =
  "Kerala-based forex, gold (XAUUSD) and funded-account trading community for Malayalis in the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain. Live sessions in GCC evening hours. Join on WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gcc" },
  openGraph: { title: `${title} | MARKOS`, description, url: "/gcc" },
};

const faqs = [
  {
    q: "Is there a Malayali forex trading community in the Gulf?",
    a: "Yes. MARKOS is a Kerala-based forex, gold and funded-account trading community with Malayali members across the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain. Questions can be asked in Malayalam or English on WhatsApp.",
  },
  {
    q: "Can I get a funded account while working in the GCC?",
    a: "Many prop firms accept GCC residents, but eligibility, payout methods and rules differ by firm and country. Check the firm's country list and rules before paying, or ask MARKOS on WhatsApp which options fit your country.",
  },
  {
    q: "When can I trade gold after work in the GCC?",
    a: "The London–New York overlap — usually the most active window for XAUUSD — falls around 16:00–19:00 in Saudi Arabia, Qatar, Kuwait and Bahrain, and 17:00–20:00 in the UAE and Oman in winter.",
  },
];

export default function GccHubPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I'm a Malayali trader in the GCC. I'd like to join the community.",
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/gcc")}#webpage`,
        url: absoluteUrl("/gcc"),
        name: title,
        inLanguage: ["en", "ml"],
        publisher: { "@id": `${SITE_URL}/#organization` },
        hasPart: GCC_COUNTRIES.map((country) => ({
          "@type": "WebPage",
          name: `Forex & funded account trading in ${country.name}`,
          url: absoluteUrl(`/gcc/${country.slug}`),
        })),
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
            <p className={styles.eyebrow}>MARKOS / GCC</p>
            <h1>
              Forex &amp; funded account community for Malayalis in the GCC
            </h1>
            <p className={styles.lede}>
              Working in Dubai, Riyadh, Doha, Kuwait, Muscat or Manama and
              learning to trade? MARKOS is a Kerala-based community for Malayali
              traders — forex and gold (XAUUSD) education, weekday live sessions
              in your evening hours, and help preparing for funded account
              challenges.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement="gcc-hub-hero"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Join the community on WhatsApp
              </WhatsAppLink>
              <Link className={styles.action} href="/get-funded">
                GET A FUNDED ACCOUNT →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>CHOOSE YOUR COUNTRY</p>
            <h2>Rules, regulators and trading hours by country</h2>
          </div>
          <div className={local.countryGrid}>
            {GCC_COUNTRIES.map((country) => (
              <Link
                key={country.slug}
                className={local.countryCard}
                href={`/gcc/${country.slug}`}
              >
                <strong>{country.name}</strong>
                <span>
                  {country.cities.slice(0, 3).join(" · ")} · {country.utcOffset}
                </span>
                <span>Gold prime time: {country.goldPrime}</span>
              </Link>
            ))}
          </div>

          <div className={local.malayalam} lang="ml">
            <span className={styles.label}>മലയാളത്തിൽ</span>
            <p>
              ഗൾഫിൽ ജോലി ചെയ്യുന്ന മലയാളികൾക്കായി കേരളം ആസ്ഥാനമായുള്ള ഫോറെക്സ്,
              ഗോൾഡ്, ഫണ്ടഡ് അക്കൗണ്ട് ട്രേഡിംഗ് കമ്മ്യൂണിറ്റിയാണ് MARKOS. ജോലി
              കഴിഞ്ഞ് വൈകുന്നേരം ലൈവ് സെഷനുകളിൽ പങ്കെടുക്കാം. ഒരു WhatsApp
              മെസേജ് അയച്ചാൽ മതി.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>STAY SAFE</p>
            <h2>How Malayali traders get scammed — and how to avoid it</h2>
          </div>
          <ul className={styles.benefits}>
            <li>
              A &quot;broker&quot; contacts you on WhatsApp or Telegram and asks
              you to deposit through a link — always find the provider yourself
              and check its licence.
            </li>
            <li>
              A group promises a guaranteed monthly return or offers to
              &quot;manage&quot; your account — that is a red flag, not a
              strategy.
            </li>
            <li>
              Someone offers to pass your funded account for a fee — this
              usually breaks the firm&apos;s rules and can cancel your payout.
            </li>
            <li>
              You are asked for an extra &quot;release fee&quot; to withdraw —
              stop and verify through the official website.
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
          <p>
            Live in Kerala or elsewhere in India? See{" "}
            <Link href="/kerala">forex trading in Kerala</Link>.
          </p>
          <p className={styles.legal}>
            Education and community only — not financial, legal or tax advice.
            Trading carries a real risk of loss; no pass, payout or profit is
            promised.
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
