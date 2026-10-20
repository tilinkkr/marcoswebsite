import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Why MARKOS is building a process-led trading community around preparation, risk, review, and continuous improvement.",
  alternates: { canonical: "/story" },
};
export default function Story() {
  return (
    <EditorialPage
      eyebrow="MARKOS / OUR STORY"
      title="PROCESS BEFORE PROMISES."
      lede="MARKOS exists to make the work behind trading visible: preparation, execution, review and risk discipline."
    >
      <h2>Why MARKOS exists</h2>
      <p>
        Trading alone can hide weak decisions. MARKOS brings traders into a
        shared learning environment where reasoning can be discussed, reviewed
        and improved.
      </p>
      <p>
        The community is built around education and transparent process. It does
        not promise profits, funding or shortcuts. The standard is deliberate
        work.
      </p>
      <h2>A repeatable session loop</h2>
      <p>
        MARKOS frames trading practice as four connected stages: plan the
        session, watch decisions in context, review execution, and carry one
        useful lesson into the next session. The point is to make decisions
        easier to discuss and evaluate, even when the outcome is a loss.
      </p>
      <h2>What the community provides</h2>
      <p>
        Membership information describes community discussion, market
        education, live weekday screen shares, trade review, risk frameworks,
        trading psychology discussions, and indicator access. The current
        offer and checkout page show the product and payment details available
        before a member proceeds.
      </p>
      <h2>What it does not provide</h2>
      <p>
        MARKOS is not a prop firm and does not promise signals, profitable
        trades, evaluation passes, funded accounts, or payouts. Trading involves
        risk. Read the <a href="/risk-disclosure">risk disclosure</a> and
        review the <a href="/faq">frequently asked questions</a> before
        deciding whether the community fits your needs.
      </p>
    </EditorialPage>
  );
}
