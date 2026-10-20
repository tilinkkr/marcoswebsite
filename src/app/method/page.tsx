import type { Metadata } from "next";
import Link from "next/link";

import { EditorialPage } from "@/components/layout/EditorialPage";

export const metadata: Metadata = {
  title: "The MARKOS Trading Process",
  description:
    "Explore a practical trading routine built around session planning, observing decisions, reviewing execution, and refining risk discipline.",
  alternates: { canonical: "/method" },
  openGraph: {
    title: "The MARKOS Trading Process",
    description:
      "A four-stage routine for planning, watching, reviewing, and refining trading decisions.",
    url: "/method",
  },
};

const stages = [
  {
    number: "01",
    title: "Plan the session",
    question: "What would make a trade idea valid, and what would invalidate it?",
    description:
      "Before execution, write down the market context, important levels, the condition you are waiting for, and the amount of risk you are prepared to take. A plan can include a decision not to trade.",
  },
  {
    number: "02",
    title: "Watch decisions in context",
    question: "What changed, and why did the decision change?",
    description:
      "Observe entries, exits, stops, and the reasoning around them as events unfold. A screen share is an educational view of a process; it is not an instruction to copy a trade.",
  },
  {
    number: "03",
    title: "Review the execution",
    question: "Did the decision follow the plan, regardless of the result?",
    description:
      "Compare the original idea with what happened. Separate process quality from profit or loss, note rule changes and execution errors, and record what remains uncertain.",
  },
  {
    number: "04",
    title: "Refine one thing",
    question: "What specific adjustment will you test next session?",
    description:
      "Choose a small, observable improvement and carry it into the next plan. Keep risk limits explicit and change one process variable at a time where practical.",
  },
];

export default function MethodPage() {
  return (
    <EditorialPage
      eyebrow="MARKOS / THE METHOD"
      title="PLAN. WATCH. REVIEW. REFINE."
      lede="A practical routine for making trading decisions easier to explain, review, and improve over time. It supports learning; it does not predict market outcomes."
    >
      <p>
        A repeatable process gives a trader something useful to evaluate beyond
        the result of a single trade. MARKOS organizes that process into four
        stages that can be used before, during, and after a market session.
      </p>
      {stages.map((stage) => (
        <section key={stage.number}>
          <p>{stage.number} / SESSION PROCESS</p>
          <h2>{stage.title}</h2>
          <h3>{stage.question}</h3>
          <p>{stage.description}</p>
        </section>
      ))}
      <h2>Keep the risk boundary visible</h2>
      <p>
        Define risk before execution and respect the applicable provider and
        platform rules. Stops, limits, and evaluation conditions do not remove
        market, slippage, liquidity, or execution risk. If a rule or product
        term affects your decision, verify it from the current official source.
      </p>
      <h2>Use the process as education</h2>
      <p>
        MARKOS provides education and community discussion, not personalised
        investment, legal, or tax advice. No process guarantees profits,
        challenge success, funding, or payouts. Read the{" "}
        <Link href="/risk-disclosure">risk disclosure</Link> and see what the
        community currently includes on the <Link href="/join">membership
        page</Link>.
      </p>
    </EditorialPage>
  );
}
