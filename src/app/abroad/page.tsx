import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { ABROAD_COUNTRIES } from "@/config/gcc";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";
import local from "../gcc/gcc.module.css";

const title =
  "Forex & Funded Account Community for Malayalis in Canada and Australia";
const description =
  "Malayali traders in Canada and Australia: learn forex, gold (XAUUSD) and funded-account trading with MARKOS, a Kerala-based community. Regulators, trading hours and WhatsApp support.";

export const metadata: Metadata = {
  title: { absolute: `${title} | MARKOS` },
  description,
  alternates: { canonical: "/abroad" },
  openGraph: { title: `${title} | MARKOS`, description, url: "/abroad" },
};

export default function AbroadHubPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I'm a Malayali trader living abroad. I'd like to join the community.",
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/abroad")}#webpage`,
    url: absoluteUrl("/abroad"),
    name: title,
    inLanguage: ["en", "ml"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    hasPart: ABROAD_COUNTRIES.map((country) => ({
      "@type": "WebPage",
      name: `Forex & funded account trading in ${country.name}`,
      url: absoluteUrl(`/abroad/${country.slug}`),
    })),
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / MALAYALIS ABROAD</p>
            <h1>Forex &amp; funded account community for Malayalis abroad</h1>
            <p className={styles.lede}>
              Living in Toronto, Calgary, Melbourne, Sydney or Perth? Learn
              forex and gold trading in Malayalam with MARKOS: a Kerala-based
              community with members in Kerala, the GCC, Canada and Australia.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement="abroad-hub-hero"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Join on WhatsApp
              </WhatsAppLink>
              <Link className={styles.action} href="/gcc">
                MALAYALIS IN THE GCC →
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={local.countryGrid}>
            {ABROAD_COUNTRIES.map((country) => (
              <Link
                key={country.slug}
                className={local.countryCard}
                href={`/abroad/${country.slug}`}
              >
                <strong>{country.name}</strong>
                <span>{country.cities.slice(0, 3).join(" · ")}</span>
                <span>Gold prime time: {country.goldPrime}</span>
              </Link>
            ))}
            <Link className={local.countryCard} href="/kerala">
              <strong>Kerala &amp; India</strong>
              <span>Kochi · Thiruvananthapuram · Kozhikode</span>
              <span>Forex in Malayalam</span>
            </Link>
          </div>
          <p className={styles.legal}>
            Education and community only, not financial, legal or tax advice.
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
