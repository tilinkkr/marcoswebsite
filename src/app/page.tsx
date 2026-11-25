import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CapitalMotion } from "@/components/sections/CapitalMotion";
import { DailyScreenShare } from "@/components/sections/DailyScreenShare";
import { FinalConversion } from "@/components/sections/FinalConversion";
import { HomeAeoHub } from "@/components/sections/HomeAeoHub";
import { IndicatorsPreview } from "@/components/sections/IndicatorsPreview";
import { JoinPreview } from "@/components/sections/JoinPreview";
import { MarcosMethod } from "@/components/sections/MarcosMethod";
import { Membership } from "@/components/sections/Membership";
import { ModernTrader } from "@/components/sections/ModernTrader";
import { VisionReveal } from "@/components/sections/VisionReveal";

export const metadata: Metadata = {
  // Brand first: "markos" + "funded account" are our highest-traction queries.
  title: {
    absolute: "MARKOS | Funded Account & Daily Google Meet Trading Community",
  },
  description:
    "India, UAE & GCC's funded account trading community: daily private Google Meet live trading streams, FundingPips & FTMO rules guides, XAUUSD education, and risk discipline. Message us on WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MARKOS | Funded Account & Daily Google Meet Trading Community",
    description:
      "Daily live Google Meet trading stream for passing funded accounts, prop-firm rule breakdowns, XAUUSD context, and honest trade review. Message us on WhatsApp.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisionReveal />
        <DailyScreenShare />
        <MarcosMethod />
        <CapitalMotion />
        <Membership />
        <HomeAeoHub />
        <ModernTrader />
        <JoinPreview />
        <IndicatorsPreview />
        <FinalConversion />
      </main>
      <SiteFooter />
    </>
  );
}
