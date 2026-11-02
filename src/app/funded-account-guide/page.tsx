import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import local from "./funded-account-guide.module.css";

export const metadata: Metadata = {
  title: "Funded Accounts: Rules, Payouts & Prop-Firm Checks | MARKOS",
  description:
    "Understand funded accounts, evaluation rules, payout rejections and how to compare CFD prop firms. A practical India-focused guide—no pass or payout promises.",
  alternates: { canonical: "/funded-account-guide" },
  openGraph: {
    title: "Funded Accounts: Rules, Payouts & Prop-Firm Checks | MARKOS",
    description:
      "A clear guide to funded-account evaluations, payout requests, provider rules and questions to ask before paying.",
    url: "/funded-account-guide",
    type: "article",
  },
};

const questions = [
  {
    question: "What is a funded account?",
    answer:
      "It is a provider-defined account or programme stage after an evaluation, or sometimes an instant-access purchase. The phrase does not prove that trades use live capital: some providers describe funded stages as simulated and rewards as conditional on their terms. Read the exact contract for the product you are considering.",
  },
  {
    question: "Can I pass a funded-account challenge in 3 days?",
    answer:
      "Only if that exact programme's current rules permit completion in that time—and meeting a target does not guarantee approval. Check minimum trading days, consistency rules, review timing and all loss limits. Do not increase risk or force trades to meet an arbitrary deadline.",
  },
  {
    question: "Why can a prop-firm payout request be rejected or delayed?",
    answer:
      "There is no universal reason or provider-wide process. Depending on the contract, a review may involve rule compliance, identity or payment verification, eligibility timing, or missing information. Ask support to identify the exact clause and account event in writing, then compare it with the version of the terms that applied to your account.",
  },
  {
    question: "How do I choose between CFD prop firms?",
    answer:
      "Compare the specific programme, not a headline rating: simulated or live structure, instruments, total fee and recurring costs, drawdown calculation, minimum days, prohibited practices, payout conditions, country eligibility, dispute process and how changes to terms are handled. No checklist can establish that a firm is the safest or guarantee a payout.",
  },
  {
    question: "Do the rules change after I pass the evaluation?",
    answer:
      "They can. Treat the funded stage as a separate agreement and read it before accepting. Re-check drawdown, payout timing and eligibility, consistency rules, permitted strategies, identity checks and account termination provisions rather than assuming evaluation rules carry over unchanged.",
  },
] as const;

const comparison = [
  [
    "Account model",
    "Is the evaluation/funded stage simulated, live, or described differently by product?",
  ],
  [
    "Loss rules",
    "How are daily and total drawdown calculated, including floating P&L, fees and reset time?",
  ],
  [
    "Completion",
    "Are there minimum trading days, consistency conditions, time limits or review periods?",
  ],
  [
    "Payout",
    "What conditions, timing, verification steps and documented appeal/support route apply?",
  ],
  [
    "Total cost",
    "Include evaluation, subscription, reset, platform/data and payment fees—not just the entry price.",
  ],
  [
    "Availability",
    "Confirm the exact product accepts your country and the payment/payout route works for you.",
  ],
] as const;

export default function FundedAccountGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Funded Accounts: Rules, Payouts and Prop-Firm Checks",
    description: metadata.description,
    mainEntityOfPage: absoluteUrl("/funded-account-guide"),
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: "MARKOS",
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={[styles.hero, local.hero].join(" ")}>
          <p className={styles.eyebrow}>MARKOS / FUNDED-ACCOUNT FIELD GUIDE</p>
          <h1 className={styles.title}>
            FUNDED ACCOUNTS.
            <br />
            READ THE RULES.
          </h1>
          <p className={styles.lede}>
            What a funded account means, how evaluations work, why payout
            requests need careful checking, and how to compare prop-firm terms
            before you pay. Written for traders in India; not a firm ranking or
            a promise of passing or payout.
          </p>
          <a className={styles.cta} href="#quick-answers">
            START WITH THE DIRECT ANSWERS ↓
          </a>
        </section>

        <section className={[styles.section, local.content].join(" ")}>
          <p className={styles.sectionLabel}>THE SHORT ANSWER</p>
          <h2 className={styles.sectionTitle}>
            A “FUNDED” LABEL IS NOT THE CONTRACT.
          </h2>
          <div className={styles.prose}>
            <p>
              A funded account is a provider&apos;s name for a programme stage
              with its own rules. It may follow a paid evaluation or be offered
              as instant access. The account can be simulated, and any reward
              may depend on continued compliance, checks and provider-specific
              terms. Confirm the exact product, legal entity and agreement
              before spending money.
            </p>
            <p>
              There is no reliable shortcut that makes everyone pass in three
              days. A payout is not guaranteed by reaching a displayed target,
              and “safest prop firm” is not a meaningful conclusion without a
              defined measure and independently verifiable evidence. Start with
              written rules and costs; do not risk money you cannot afford to
              lose.
            </p>
          </div>

          <div className={local.callout}>
            <span>THE MARKOS CHECK</span>
            <p>
              Before purchase, save a copy of the current terms, product rules,
              checkout price and payout policy. If the sales page and contract
              appear to conflict, ask the provider for written clarification
              before paying.
            </p>
          </div>

          <section id="quick-answers" className={local.answers}>
            <p className={styles.sectionLabel}>QUESTIONS TRADERS ASK</p>
            <h2 className={local.subheading}>
              CLEAR ANSWERS BEFORE YOU COMMIT.
            </h2>
            {questions.map(({ question, answer }, index) => (
              <article className={local.answer} key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </section>

          <section className={local.compare} aria-labelledby="compare-title">
            <p className={styles.sectionLabel}>CFD PROP-FIRM COMPARISON</p>
            <h2 id="compare-title" className={local.subheading}>
              COMPARE THE RULES, NOT THE SALES CLAIM.
            </h2>
            <p className={local.intro}>
              Use this checklist for any CFD evaluation or funded programme.
              Products from one provider may also have different terms. This is
              a research framework, not a “top” list or endorsement.
            </p>
            <div className={local.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">CHECK</th>
                    <th scope="col">WHAT TO VERIFY IN WRITING</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(([label, detail]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={local.note}>
              Provider terms change. The examples below illustrate why the
              product-specific documents matter; they are not recommendations
              and should be rechecked at the time of purchase.
            </p>
            <ul className={local.sources}>
              <li>
                <a
                  href="https://ftmo.com/en/futures/faq/ftr-who-is-an-ftmo-trader-and-how-do-i-become-one/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FTMO Futures FAQ: simulated account stages and objectives ↗
                </a>
              </li>
              <li>
                <a
                  href="https://fundednext.com/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FundedNext: current Terms of Service ↗
                </a>
              </li>
              <li>
                <a
                  href="https://fundednext.com/api_docs/cfd-challenge-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FundedNext: CFD Challenge Terms ↗
                </a>
              </li>
            </ul>
          </section>

          <section className={local.payout} aria-labelledby="payout-title">
            <p className={styles.sectionLabel}>IF A PAYOUT IS REJECTED</p>
            <h2 id="payout-title" className={local.subheading}>
              GET THE SPECIFIC CLAUSE—NOT A GUESS.
            </h2>
            <ol>
              <li>
                Save the request date, account ID, dashboard status and provider
                response.
              </li>
              <li>
                Ask which exact clause and account activity the decision refers
                to.
              </li>
              <li>
                Check the contract version, payout window, verification requests
                and any stated deadlines.
              </li>
              <li>
                Keep communication in the provider&apos;s official support
                channel; avoid sharing passwords or one-time codes.
              </li>
              <li>
                If the explanation remains unclear, use the documented complaint
                or dispute process and seek qualified advice where appropriate.
              </li>
            </ol>
            <p>
              A forum post or screenshot can flag a question, but it does not
              establish what happened in another trader&apos;s case or prove a
              provider-wide pattern. Avoid assuming every rejected request has
              the same cause.
            </p>
          </section>

          <aside className={local.whatsapp} aria-labelledby="whatsapp-title">
            <div>
              <p className={styles.sectionLabel}>MARKOS / EDUCATION</p>
              <h2 id="whatsapp-title">
                WANT TO UNDERSTAND THE PROCESS BEFORE YOU CHOOSE?
              </h2>
              <p>
                Ask what MARKOS membership and trading education include. We can
                explain our learning format; we do not select a firm for you or
                promise a pass, payout or financial result.
              </p>
            </div>
            <WhatsAppLink
              href={getWhatsAppUrl(
                "Hi MARKOS, I read your funded-account guide. Could you explain what your trading education covers for understanding prop-firm rules?",
              )}
              placement="funded-account-guide"
              data-whatsapp-primary
              target="_blank"
              rel="noopener noreferrer"
            >
              ASK ABOUT MARKOS EDUCATION <span aria-hidden="true">↗</span>
            </WhatsAppLink>
          </aside>

          <p className={local.related}>
            Continue with our <Link href="/faq">prop-firm rules FAQ</Link>,{" "}
            <Link href="/risk-disclosure">risk disclosure</Link> or{" "}
            <Link href="/insights">trading guides for India</Link>. Information
            here is general education, not financial, legal or tax advice.
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
