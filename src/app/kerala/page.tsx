import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";
import local from "../gcc/gcc.module.css";

const title = "Forex Trading Course & Community in Kerala — Learn in Malayalam";
const description =
  "Looking for a forex trading academy, course or WhatsApp group in Kerala? MARKOS is a Kerala-based forex, gold and funded-account community for Malayalis in Kochi, Trivandrum, Kozhikode and the GCC.";

export const metadata: Metadata = {
  title: { absolute: `${title} | MARKOS` },
  description,
  alternates: { canonical: "/kerala" },
  openGraph: { title: `${title} | MARKOS`, description, url: "/kerala" },
};

const faqs = [
  {
    q: "Where can I learn forex trading in Malayalam?",
    a: "MARKOS is a Kerala-based trading community that teaches forex and gold (XAUUSD) trading in Malayalam and English, with weekday live sessions, forex courses and funded-account preparation. Message the team on WhatsApp to start.",
  },
  {
    q: "Is forex trading legal in Kerala and India?",
    a: "Indian residents may trade forex only in permitted instruments through authorised persons, authorised electronic trading platforms or recognised exchanges, as RBI's forex FAQ explains — for example INR currency pairs on Indian exchanges through a SEBI-registered broker. RBI's alert list warns against unauthorised forex platforms. Overseas forex apps and funded accounts raise separate questions; read our guide before paying.",
  },
  {
    q: "Is there a group that passes funded accounts in Kerala?",
    a: "Services that trade your challenge for you usually break the prop firm's rules on account sharing and third-party trading, and firms can cancel the account or refuse the payout. A safer route is learning to pass it yourself with a risk plan — that is what the MARKOS community helps with.",
  },
  {
    q: "Which is the best forex trading institute, academy or course in Kerala?",
    a: "Judge any Kerala forex institute, academy or course on what it actually teaches and how it behaves: a written syllabus, live trading you can watch, open discussion of losses and risk, no guaranteed-profit or account-management offers, and honesty about what is legal for Indian residents. MARKOS offers forex and gold courses and a live community in Malayalam — ask on WhatsApp for the current format.",
  },
  {
    q: "Is there a Kerala trading WhatsApp group link?",
    a: "To join the MARKOS community, message the team on WhatsApp (+91 91875 87488) — they explain the community and sessions and add you from there. Be careful with public 'trading WhatsApp group links' that promise signals or guaranteed returns.",
  },
  {
    q: "Who teaches at MARKOS?",
    a: "Rahul Raja, who has been trading for more than 10 years, leads trading education; Linu Babu is CFO; Sahal is a trader and content creator. None of them is registered with SEBI as an investment adviser or research analyst — MARKOS provides education and community, not investment advice.",
  },
  {
    q: "Is there a forex broker that explains things in Malayalam?",
    a: "Some Indian brokers publish Malayalam explainers, but a broker's language doesn't make it suitable. Indian residents should use a SEBI-registered broker for permitted currency derivatives. MARKOS is not a broker — it is a Malayalam-speaking education community.",
  },
  {
    q: "Which bank is best for forex trading in India?",
    a: "Banks don't usually offer retail forex trading accounts; Indian residents trade permitted currency derivatives through SEBI-registered brokers on recognised exchanges. Your bank is used for funding that broker account. See our guide to trading platforms in India.",
  },
  {
    q: "Can I join MARKOS from the Gulf?",
    a: "Yes. Malayali members join from the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain, and from Canada and Australia. Live sessions fit GCC evening hours.",
  },
];

export default function KeralaPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I'm from Kerala and want to learn forex / funded accounts. How do I join?",
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/kerala")}#webpage`,
        url: absoluteUrl("/kerala"),
        name: title,
        inLanguage: ["en", "ml"],
        about: [
          { "@type": "State", name: "Kerala" },
          { "@type": "Thing", name: "Forex trading" },
          { "@type": "Thing", name: "Funded trading account" },
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
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
            <p className={styles.eyebrow}>MARKOS / KERALA</p>
            <h1>Forex trading course &amp; community in Kerala</h1>
            <p className={styles.lede}>
              MARKOS is a Kerala-based forex, gold (XAUUSD) and funded-account
              trading community. Learn the basics, trade alongside weekday live
              sessions and prepare for prop-firm challenges — with traders from
              Kochi, Kozhikode, Thrissur, Thiruvananthapuram and Malayalis
              across the Gulf.
            </p>
            <div className={local.ctaBand}>
              <WhatsAppLink
                className={local.whatsapp}
                href={whatsapp}
                placement="kerala-hero"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                Join on WhatsApp — it&apos;s free to ask
              </WhatsAppLink>
              <Link
                className={styles.action}
                href="/insights/xauusd-30-day-practice-plan"
              >
                FREE 30-DAY GOLD PLAN →
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={local.malayalam} lang="ml">
            <span className={styles.label}>മലയാളത്തിൽ</span>
            <p>
              ഫോറെക്സ് ട്രേഡിംഗ് മലയാളത്തിൽ പഠിക്കണോ? കേരളം ആസ്ഥാനമായുള്ള MARKOS
              കമ്മ്യൂണിറ്റിയിൽ ഫോറെക്സ്, ഗോൾഡ് (XAUUSD), ഫണ്ടഡ് അക്കൗണ്ട്
              ചലഞ്ചുകൾ എന്നിവയെക്കുറിച്ച് പഠിക്കാം. ലാഭം ഉറപ്പ് നൽകുന്ന
              ഗ്രൂപ്പുകളെ സൂക്ഷിക്കുക — റിസ്ക് മാനേജ്മെന്റ് ആണ് ആദ്യം. സംശയങ്ങൾ
              WhatsApp-ൽ ചോദിക്കാം.
            </p>
          </div>

          <div className={styles.sectionHeader}>
            <p className={styles.label}>WHAT YOU CAN LEARN</p>
            <h2>From forex basics to your first funded account</h2>
          </div>
          <ul className={local.links}>
            <li>
              <Link href="/insights/what-is-forex-trading-basics">
                What is forex? Basics explained for beginners
              </Link>
            </li>
            <li>
              <Link href="/insights/how-to-trade-xauusd-for-beginners">
                How to trade XAUUSD (gold) for total beginners
              </Link>
            </li>
            <li>
              <Link href="/insights/how-to-start-trading-in-2026-beginners">
                How to start trading in 2026 — explained for beginners
              </Link>
            </li>
            <li>
              <Link href="/insights/trading-platforms-india-beginners">
                Start trading with these platforms in India
              </Link>
            </li>
            <li>
              <Link href="/insights/top-10-prop-firms-funded-accounts-compared">
                Best funded accounts in India: top 10 prop firms
              </Link>
            </li>
            <li>
              <Link href="/insights/forex-prop-firms-india-legal-checklist">
                Is a funded account legal in India?
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>KERALA TRADING WHATSAPP GROUP</p>
            <h2>Looking for a Kerala trading WhatsApp group link?</h2>
          </div>
          <p>
            Traders from Thiruvananthapuram (Trivandrum), Kochi, Kozhikode,
            Thrissur, Kannur and Kollam — and Malayalis in the{" "}
            <Link href="/gcc">GCC</Link>,{" "}
            <Link href="/abroad/canada">Canada</Link> and{" "}
            <Link href="/abroad/australia">Australia</Link> — join MARKOS by
            sending one WhatsApp message. The team explains the community, live
            sessions and courses, then adds you. No signals for sale, no
            guaranteed profits.
          </p>
          <div className={local.ctaBand}>
            <WhatsAppLink
              className={local.whatsapp}
              href={whatsapp}
              placement="kerala-group"
              target="_blank"
              rel="noreferrer"
            >
              Get the MARKOS WhatsApp link
            </WhatsAppLink>
            <Link className={styles.action} href="/team">
              MEET THE TEAM →
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>
              SEARCHING FOR A &quot;PASSING GROUP&quot;?
            </p>
            <h2>Read this before you pay anyone to pass your challenge</h2>
          </div>
          <ul className={styles.benefits}>
            <li>
              Most prop firms ban account sharing and third-party trading — a
              &quot;passed&quot; account can be closed and the payout refused.
            </li>
            <li>
              You also hand over your login, identity documents and money to a
              stranger.
            </li>
            <li>
              The skill you need for the funded stage is the one the passing
              service skipped: managing risk yourself.
            </li>
            <li>
              The legitimate shortcut is a plan, a small fixed risk per trade
              and people who review your trades with you — that is the MARKOS
              community.
            </li>
          </ul>
          <p>
            See{" "}
            <Link href="/insights/pass-funded-account-challenge-in-3-days">
              can you pass a funded account in 3 days?
            </Link>{" "}
            and the{" "}
            <Link href="/insights/easiest-way-to-pass-prop-firm-challenge">
              9-step plan to pass a prop firm challenge
            </Link>
            .
          </p>

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
              placement="kerala-faq"
              target="_blank"
              rel="noreferrer"
            >
              Message MARKOS on WhatsApp
            </WhatsAppLink>
            <Link className={styles.action} href="/gcc">
              MALAYALIS IN THE GCC →
            </Link>
          </div>
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
