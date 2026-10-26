import type { Metadata } from "next";
import styles from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import local from "./faq.module.css";

export const metadata: Metadata = {
  title: "Forex, Prop-Firm & Trading FAQs for India | MARKOS",
  description:
    "Clear answers on forex pairs and rules in India, futures vs forex, crypto questions, broker checks and prop-firm evaluations—with official resources.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Forex, Prop-Firm & Trading FAQs for India | MARKOS",
    description:
      "Clear answers on forex pairs and rules in India, futures vs forex, crypto questions, broker checks and prop-firm evaluations.",
    url: "/faq",
  },
};
const groups = [
  {
    id: "getting-started",
    label: "GETTING STARTED",
    items: [
      [
        "What is MARKOS?",
        "MARKOS is an education and community platform built around structured learning, live weekday screen shares and deliberate risk process.",
      ],
      [
        "Can beginners join MARKOS?",
        "Yes. Beginners can join, but should expect education and process—not signals, guaranteed outcomes or a shortcut around practice.",
      ],
      [
        "How do I join MARKOS?",
        "Use the Join MARKOS page, review the current membership information and risk acknowledgement, then follow the displayed checkout steps.",
      ],
      [
        "What is included in membership?",
        "The current membership includes community discussion, live weekday screen shares, trade reasoning and review, risk education and a prop-evaluation learning environment.",
      ],
    ],
  },
  {
    id: "prop",
    label: "PROP TRADING",
    items: [
      [
        "What is prop trading?",
        "Prop trading generally describes trading under a firm's capital or simulated evaluation structure, subject to that firm's contract and risk rules.",
      ],
      [
        "How does a prop-firm evaluation work?",
        "A prop-firm evaluation is a rule-based assessment. A trader usually needs to meet performance objectives while staying within limits such as daily loss and maximum drawdown.",
      ],
      [
        "Are prop-firm rules the same everywhere?",
        "No. Targets, drawdown calculations, news rules, payout terms and account structures vary, and providers can change them. Read the current official terms before paying.",
      ],
      [
        "What is the difference between a demo evaluation and a funded account?",
        "An evaluation tests performance under stated rules. A funded-stage account is governed by a separate contract and may still be simulated. Verify the provider's exact structure and current terms.",
      ],
    ],
  },
  {
    id: "risk",
    label: "RISK",
    items: [
      [
        "What is daily drawdown?",
        "Daily drawdown is the maximum loss permitted within a provider-defined day. The reset time, calculation base and treatment of open trades can differ.",
      ],
      [
        "What is maximum drawdown?",
        "Maximum drawdown is the total permitted decline in account equity or balance. It may be static or may move with account performance.",
      ],
      [
        "What happens if I break a drawdown rule?",
        "A breach commonly ends the evaluation or account under that provider's terms, even if a profit target was reached earlier.",
      ],
      [
        "Can MARKOS guarantee that I will pass a prop-firm challenge?",
        "No. MARKOS cannot guarantee profits, funding, payouts or evaluation success. Trading outcomes depend on risk, execution and rules outside MARKOS's control.",
      ],
    ],
  },
  {
    id: "marcos",
    label: "MARKOS",
    items: [
      [
        "Is MARKOS a prop firm?",
        "No. MARKOS is a trading education and community platform; it does not present itself as a prop firm.",
      ],
      [
        "Does MARKOS provide trading signals?",
        "MARKOS focuses on education, reasoning and live process. It does not promise a signal service or guaranteed entries.",
      ],
      [
        "Do I need a large personal trading account to learn with MARKOS?",
        "No large personal account is required to study process. Any decision to trade or purchase an evaluation should be based on your own circumstances and risk tolerance.",
      ],
      [
        "How do I contact MARKOS?",
        "Use the Contact page and select the topic that best matches membership, indicators, partnerships, team or technical support.",
      ],
    ],
  },
  {
    id: "indicators",
    label: "INDICATORS",
    items: [
      [
        "Do MARKOS indicators automatically place trades?",
        "No. Indicators are decision-support tools. They do not replace judgment, risk management or automatically guarantee profitable execution.",
      ],
      [
        "Can an indicator remove trading risk?",
        "No. An indicator can organize information, but it cannot remove market risk, execution risk or the effect of changing conditions.",
      ],
    ],
  },
  {
    id: "india",
    label: "INDIA",
    items: [
      [
        "Can Indian traders use prop firms?",
        "Provider structures, instruments, platforms and payment arrangements vary. Indian traders should verify current Indian law and authoritative regulatory guidance before participating; MARKOS does not provide legal or tax advice.",
      ],
      [
        "What prop-firm rules should Indian traders check before paying?",
        "Read the provider's current official terms—not just the headline profit target. Check how daily loss and maximum drawdown are calculated (including open losses, fees and reset time), breach consequences, minimum trading days, news or overnight restrictions, payout conditions, the contracting entity, supported instruments and payment route. Rules and legal or tax treatment can differ; verify current authoritative guidance for your situation. MARKOS is not a prop firm and cannot provide legal or tax advice or guarantee an evaluation result.",
      ],
      [
        "What is forex trading in India, in simple words?",
        "Forex means exchanging or trading currency instruments. For Indian residents, legality depends on the specific instrument, purpose, authorised counterparty and venue. RBI guidance says permitted electronic forex transactions should use RBI-authorised ETPs or recognised exchanges under applicable terms. This is general information, not legal advice.",
      ],
      [
        "Which forex pairs are allowed in India?",
        "Do not infer that every pair shown by an overseas app is available to Indian residents. Check the current RBI guidance, recognised-exchange contract specifications and authorised intermediary for the particular product and purpose. Rules can change, so verify directly with official sources before acting.",
      ],
      [
        "What is the best time to trade forex pairs in India?",
        "There is no universally best time: venue hours, instrument, liquidity and your own plan matter. For exchange-traded currency derivatives, check the current exchange schedule and contract details rather than assuming overseas spot-FX hours apply. More activity can also mean faster price changes and risk; this is not a trading recommendation.",
      ],
      [
        "Futures vs forex: what is the difference?",
        "Futures are standardised contracts traded on an exchange; forex may refer to different currency products and venues. Compare contract terms, expiry, margin, hours, costs and applicable rules. The phrase ‘futures vs forex which is better’ has no universal answer and is not a personal recommendation.",
      ],
      [
        "Is crypto trading legal in India?",
        "A simple yes or no can be misleading because crypto assets, payment use, exchange services, taxation and cross-border activity raise separate questions. Check current official requirements, including tax guidance, and obtain qualified advice for your circumstances. An app being accessible does not establish authorisation or suitability.",
      ],
      [
        "How can I check whether a broker is authorised in India?",
        "Verify the exact legal entity and the relevant product or venue against official regulator and exchange records. Do not treat a search result, influencer recommendation, app listing or absence from an alert list as proof of authorisation. RBI notes its forex alert list is not exhaustive.",
      ],
      [
        "Can you name the best prop firms in India for 2026?",
        "MARKOS does not publish a universal ‘best’ or ‘top’ ranking. Provider availability, product structure, fees, drawdown rules and payout terms can change. Compare current official contracts and independently check legal, payment and tax considerations before paying; a ranking is not a guarantee of safety or payout.",
      ],
      [
        "What are the best prop firms for beginners?",
        "There is no provider that is best for every beginner. Before paying, check whether the rules are understandable, the evaluation and funded-stage structures are clearly described, the fees are affordable to lose, and the current contract explains drawdown, restrictions, payout conditions and dispute handling. Do not treat a ranking or a passed challenge as guaranteed income.",
      ],
    ],
  },
] as const;
export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl("/faq"),
    mainEntity: groups.flatMap((group) =>
      group.items.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    ),
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>MARKOS / FAQ</p>
          <h1 className={styles.title}>
            PROP-FIRM RULES.
            <br />
            ASK BEFORE YOU COMMIT.
          </h1>
          <p className={styles.lede}>
            Clear answers about evaluation rules, drawdown and the checks Indian
            traders should make before paying. Verify current terms with the
            provider and relevant authorities.
          </p>
        </section>
        <div className={local.chips}>
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              {g.label}
            </a>
          ))}
        </div>
        <section className={local.faq}>
          <nav aria-label="FAQ categories">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`}>
                {g.label}
              </a>
            ))}
          </nav>
          <div>
            {groups.map((group) => (
              <section id={group.id} key={group.id} className={local.group}>
                <p>{group.label}</p>
                {group.items.map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <span>+</span>
                    </summary>
                    <div>{a}</div>
                  </details>
                ))}
              </section>
            ))}
          </div>
        </section>
        <section
          className={local.whatsappCta}
          aria-labelledby="faq-whatsapp-title"
        >
          <div>
            <p>MARKOS / MEMBERSHIP QUESTIONS</p>
            <h2 id="faq-whatsapp-title">
              WANT TO KNOW WHAT LEARNING HERE INCLUDES?
            </h2>
            <span>
              Ask us about the community, live weekday screen shares and
              education before deciding. We do not recommend prop firms or
              assess legal eligibility.
            </span>
          </div>
          <WhatsAppLink
            href={getWhatsAppUrl(
              "Hi MARKOS, I found your prop-firm rules FAQ. Could you explain what the education and membership include?",
            )}
            placement="faq-prop-rules"
            target="_blank"
            rel="noopener noreferrer"
          >
            ASK MARKOS ON WHATSAPP <span aria-hidden="true">↗</span>
          </WhatsAppLink>
        </section>
        <section
          className={local.resources}
          aria-labelledby="official-resources-title"
        >
          <p>INDEPENDENT LEARNING</p>
          <h2 id="official-resources-title">CHECK THE PRIMARY SOURCES.</h2>
          <p>
            Before committing money, use independent investor-education material
            and verify current rules with the relevant provider or authority.
            These resources are not endorsements of MARKOS.
          </p>
          <ul>
            <li>
              <a
                href="https://investor.sebi.gov.in/iematerial.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                SEBI Investor: education and reading material ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=146"
                target="_blank"
                rel="noopener noreferrer"
              >
                RBI: Foreign Exchange (Forex) Transactions FAQ ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4235"
                target="_blank"
                rel="noopener noreferrer"
              >
                RBI: Forex Alert List and authorisation checks ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.incometax.gov.in/iec/foportal/help/FileITR-2Online-FAQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Income Tax Department: virtual digital asset FAQ ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.nseindia.com/static/invest/first-time-investor-getting-started"
                target="_blank"
                rel="noopener noreferrer"
              >
                NSE India: getting started and investor precautions ↗
              </a>
            </li>
            <li>
              <a
                href="https://online.nism.ac.in/module/Investor%20Education%20%28Basic%29.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                NISM: free basic investor-education course ↗
              </a>
            </li>
          </ul>
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
