export const RISK_POLICY_VERSION = "2026-09-v1";

export const riskPolicySections = [
  {
    title: "Trading risk",
    body: "Trading financial instruments involves substantial risk. Losses are possible and trading may not be suitable for everyone.",
  },
  {
    title: "No guarantee",
    body: "MARCOS does not guarantee profits, returns, prop-firm challenge passes, funded accounts, payouts or any specific trading result.",
  },
  {
    title: "Educational purpose",
    body: "MARCOS provides educational material, tools, community discussions and general trading-related information. Content is not a personalized promise of investment performance.",
  },
  {
    title: "Prop-firm terms",
    body: "Third-party prop firms set and control their own evaluation rules, drawdown limits, account rules, payout terms, eligibility, pricing and policies. Those terms may change. MARCOS does not control them.",
  },
  {
    title: "Personal responsibility",
    body: "Users are responsible for their own trading decisions, understanding provider rules, assessing financial risk, complying with applicable laws and deciding whether trading is appropriate for them.",
  },
  {
    title: "Past performance",
    body: "Past performance, examples, screenshots or member experiences do not guarantee future results.",
  },
  {
    title: "Tools and indicators",
    body: "MARCOS indicators and tools assist analysis. They do not predict markets with certainty and do not remove trading risk.",
  },
  {
    title: "No guaranteed funding",
    body: "Participation in MARCOS does not guarantee acceptance or funding from any third-party prop firm.",
  },
  {
    title: "Payment and membership",
    body: "The user understands what their selected MARCOS product provides before purchasing. Refund and cancellation terms require an approved policy before production launch.",
  },
] as const;

export const riskPolicySnapshot = riskPolicySections
  .map(
    (section, index) =>
      `${index + 1}. ${section.title.toUpperCase()}\n${section.body}`,
  )
  .join("\n\n");
