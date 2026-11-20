import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import type { GccCountry } from "@/config/gcc";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "@/app/marketing.module.css";
import local from "@/app/gcc/gcc.module.css";

export type RegionHub = { path: string; label: string };

export function countryMetadata(country: GccCountry, hub: RegionHub): Metadata {
  const path = `${hub.path}/${country.slug}`;
  const title = `Forex & Funded Account Trading in ${country.shortName} for Malayalis`;
  const description = `Forex, gold (XAUUSD) and funded-account trading for Malayali traders in ${country.cities.slice(0, 2).join(" and ")}: ${country.shortName} regulators, session times in ${country.timeZone.split(" (")[0]}, prop-firm checks and a Malayalam WhatsApp community.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | MARKOS`, description, url: path },
  };
}

function faqs(country: GccCountry) {
  return [
    {
      q: `Is forex trading legal in ${country.shortName}?`,
      a: `Trading through a provider that is licensed to serve ${country.shortName} residents is the safe route. ${country.regulators.map((r) => r.name).join(", ")} ${country.regulators.length > 1 ? "are" : "is"} the place to verify a licence. MARKOS does not give legal advice; rules can change, so check the regulator directly.`,
    },
    {
      q: `Can I take a funded account (prop firm challenge) from ${country.shortName}?`,
      a: `Most prop firms are overseas companies and many accept ${country.demonym} residents, but eligibility differs by firm and product. Check the firm's country list, payout methods and rules before paying, and compare firms in our best funded accounts guide.`,
    },
    {
      q: `What is the best time to trade gold (XAUUSD) in ${country.shortName}?`,
      a: `Gold is usually most active during the London–New York overlap, roughly ${country.goldPrime} ${country.timeZone.match(/\(([^)]+)\)/)?.[1] ?? "local time"} in local time. London opens around ${country.londonOpen} local time.`,
    },
    {
      q: `Is there a Malayalam forex trading community in ${country.shortName}?`,
      a: `Yes — MARKOS is a Kerala-based trading community with Malayali members in Kerala, the GCC, Canada and Australia. You can ask questions in Malayalam or English on WhatsApp and join weekday live sessions.`,
    },
    ...(country.extraFaqs ?? []),
  ];
}

export function CountryLanding({
  country,
  hub,
}: {
  country: GccCountry;
  hub: RegionHub;
}) {
  const path = `${hub.path}/${country.slug}`;
  const whatsapp = getWhatsAppUrl(
    `Hi MARKOS, I'm a Malayali trader in ${country.shortName}. I'd like to join the community and learn forex / funded accounts.`,
  );
  const items = faqs(country);
  const tzAbbr = country.timeZone.match(/\(([^)]+)\)/)?.[1] ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name: `Forex & Funded Account Trading in ${country.name} for Malayali Traders`,
        inLanguage: ["en", "ml"],
        about: [
          { "@type": "Country", name: country.name },
          { "@type": "Thing", name: "Forex trading" },
          { "@type": "Thing", name: "Funded trading account" },
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
            name: hub.label,
            item: absoluteUrl(hub.path),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: country.name,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
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
              MARKOS / {hub.label.toUpperCase()} /{" "}
              {country.shortName.toUpperCase()}
            </p>
            <h1>
              Forex &amp; funded account trading in {country.name} for Malayali
              traders
            </h1>
            <p className={styles.lede}>
              Trading forex or gold (XAUUSD) from{" "}
              {country.cities.slice(0, 3).join(", ")}? MARKOS is a Kerala-based
              trading community for Malayalis in {country.shortName} — live
              weekday sessions, forex courses and funded-account preparation, in
              Malayalam and English.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement={`${hub.path.slice(1)}-${country.slug}-hero`}
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Join from {country.shortName} on WhatsApp
              </WhatsAppLink>
              <Link className={styles.action} href="/get-funded">
                GET A FUNDED ACCOUNT →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>
              WHEN TO TRADE FROM {country.shortName.toUpperCase()}
            </p>
            <h2>
              Market sessions in {tzAbbr} ({country.utcOffset})
            </h2>
          </div>
          <div className={local.table}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">{country.shortName} time (winter)</th>
                  <th scope="col">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>London open</td>
                  <td>{country.londonOpen}</td>
                  <td>Volatility and volume pick up in EUR, GBP and gold.</td>
                </tr>
                <tr>
                  <td>London–New York overlap</td>
                  <td>{country.goldPrime}</td>
                  <td>
                    Usually the most active window for XAUUSD — fits an
                    after-work routine.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            {country.seasonNote ??
              `In northern summer (roughly late March to late October) both sessions start one hour earlier in ${country.shortName} time.`}
            Currency: {country.currency}. {country.currencyNote}
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>WHO REGULATES WHAT</p>
            <h2>Check a licence before you deposit</h2>
          </div>
          <ul className={styles.benefits}>
            {country.regulators.map((regulator) => (
              <li key={regulator.name}>
                {regulator.url ? (
                  <a
                    href={regulator.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {regulator.name}
                  </a>
                ) : (
                  regulator.name
                )}{" "}
                — {regulator.role}.
              </li>
            ))}
          </ul>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>BEFORE YOU PAY ANY FEE</p>
            <h2>Four checks for traders in {country.shortName}</h2>
          </div>
          <ul className={styles.benefits}>
            {country.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
          <p>
            <strong>NRI from Kerala?</strong> India&apos;s rules for forex and
            overseas remittances (FEMA and LRS) apply to persons resident in
            India. Your residential status decides which rules apply to you, so
            check it — and keep records of money you send to or from India.
          </p>

          <div className={local.malayalam} lang="ml">
            <span className={styles.label}>മലയാളത്തിൽ</span>
            <p>
              {country.mlLocative} താമസിക്കുന്ന മലയാളി ട്രേഡർമാർക്ക് ഫോറെക്സ്,
              ഗോൾഡ് (XAUUSD), ഫണ്ടഡ് അക്കൗണ്ട് എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ
              സംശയങ്ങൾ ചോദിക്കാം. ഫീസ് അടയ്ക്കുന്നതിന് മുമ്പ് ബ്രോക്കറുടെ
              ലൈസൻസും പ്രോപ്പ് ഫേമിന്റെ നിയമങ്ങളും പരിശോധിക്കുക. ഒരു WhatsApp
              മെസേജ് മതി — ഞങ്ങളുടെ കമ്മ്യൂണിറ്റിയിൽ ചേരാം.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>START HERE</p>
            <h2>Guides for {country.shortName} traders</h2>
          </div>
          <ul className={local.links}>
            <li>
              <Link href="/insights/top-10-prop-firms-funded-accounts-compared">
                Best funded accounts: top 10 prop firms compared
              </Link>
            </li>
            <li>
              <Link href="/insights/how-to-trade-xauusd-for-beginners">
                How to trade XAUUSD (gold) for total beginners
              </Link>
            </li>
            <li>
              <Link href="/insights/xauusd-30-day-practice-plan">
                Free 30-day XAUUSD practice plan
              </Link>
            </li>
            <li>
              <Link href="/insights/what-is-forex-trading-basics">
                What is forex? The basics explained
              </Link>
            </li>
            <li>
              <Link href="/insights/risk-management-rules-every-trader-should-follow">
                5 risk management rules every trader should follow
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>FAQ</p>
            <h2>Questions from traders in {country.shortName}</h2>
          </div>
          <div className={local.faq}>
            {items.map((item) => (
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
              placement={`${hub.path.slice(1)}-${country.slug}-faq`}
              target="_blank"
              rel="noreferrer"
            >
              Message MARKOS from {country.shortName}
            </WhatsAppLink>
            <Link className={styles.action} href={hub.path}>
              {hub.label.toUpperCase()} →
            </Link>
          </div>
          <p className={styles.legal}>
            Education and community only — not financial, legal or tax advice.
            Trading and prop-firm challenges carry a real risk of loss; no pass,
            payout or profit is promised.
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
