import type { Metadata } from "next";
import styles from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import local from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Clear answers about MARCOS, prop-trading evaluations, risk rules, indicators and questions relevant to Indian traders.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "MARCOS Trading Community FAQ",
    description:
      "Direct answers about MARCOS membership, prop-trading rules, risk, indicators, and responsible participation in India.",
    url: "/faq",
  },
};
const groups = [
  {
    id: "getting-started",
    label: "GETTING STARTED",
    items: [
      [
        "What is MARCOS?",
        "MARCOS is an education and community platform built around structured learning, live weekday screen shares and deliberate risk process.",
      ],
      [
        "Can beginners join MARCOS?",
        "Yes. Beginners can join, but should expect education and process—not signals, guaranteed outcomes or a shortcut around practice.",
      ],
      [
        "How do I join MARCOS?",
        "Use the Join MARCOS page, review the current membership information and risk acknowledgement, then follow the displayed checkout steps.",
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
        "Can MARCOS guarantee that I will pass a prop-firm challenge?",
        "No. MARCOS cannot guarantee profits, funding, payouts or evaluation success. Trading outcomes depend on risk, execution and rules outside MARCOS's control.",
      ],
    ],
  },
  {
    id: "marcos",
    label: "MARCOS",
    items: [
      [
        "Is MARCOS a prop firm?",
        "No. MARCOS is a trading education and community platform; it does not present itself as a prop firm.",
      ],
      [
        "Does MARCOS provide trading signals?",
        "MARCOS focuses on education, reasoning and live process. It does not promise a signal service or guaranteed entries.",
      ],
      [
        "Do I need a large personal trading account to learn with MARCOS?",
        "No large personal account is required to study process. Any decision to trade or purchase an evaluation should be based on your own circumstances and risk tolerance.",
      ],
      [
        "How do I contact MARCOS?",
        "Use the Contact page and select the topic that best matches membership, indicators, partnerships, team or technical support.",
      ],
    ],
  },
  {
    id: "indicators",
    label: "INDICATORS",
    items: [
      [
        "Do MARCOS indicators automatically place trades?",
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
        "Provider structures, instruments, platforms and payment arrangements vary. Indian traders should verify current Indian law and authoritative regulatory guidance before participating; MARCOS does not provide legal or tax advice.",
      ],
      [
        "How should an Indian trader choose a prop firm?",
        "Review the provider's current official rules, legal entity, evaluation model, drawdown method, payout terms, supported instruments, payment routes and dispute process. Regulatory and tax treatment may vary, so verify authoritative current sources.",
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
          <p className={styles.eyebrow}>MARCOS / FAQ</p>
          <h1 className={styles.title}>
            ASK BEFORE
            <br />
            YOU COMMIT.
          </h1>
          <p className={styles.lede}>
            Answer-first guidance about the system, the risk and what MARCOS
            does—and does not—provide.
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
