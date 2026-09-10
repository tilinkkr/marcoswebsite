import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = { title: "Risk Disclosure" };
export default function Risk() {
  return (
    <EditorialPage
      eyebrow="LEGAL / RISK"
      title="RISK IS NOT OPTIONAL."
      lede="Read this before using MARCOS education, community content or tools."
    >
      <h2>Trading risk</h2>
      <p>
        Trading involves substantial risk and may not be suitable for every
        person. Losses can exceed expectations because of leverage, volatility,
        gaps, slippage, platform behaviour and human error.
      </p>
      <h2>No guarantee</h2>
      <p>
        MARCOS provides education and community. It does not provide legal or
        tax advice and does not guarantee profit, funding, challenge success or
        payouts.
      </p>
      <h2>Your responsibility</h2>
      <p>
        You are responsible for verifying the current rules, instruments,
        provider terms, platform, payment routes and regulatory requirements
        that apply to you.
      </p>
    </EditorialPage>
  );
}
