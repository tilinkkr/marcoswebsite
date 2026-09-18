import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CapitalMotion } from "@/components/sections/CapitalMotion";
import { DailyScreenShare } from "@/components/sections/DailyScreenShare";
import { FinalConversion } from "@/components/sections/FinalConversion";
import { IndicatorsPreview } from "@/components/sections/IndicatorsPreview";
import { JoinPreview } from "@/components/sections/JoinPreview";
import { MarcosMethod } from "@/components/sections/MarcosMethod";
import { Membership } from "@/components/sections/Membership";
import { ModernTrader } from "@/components/sections/ModernTrader";
import { VisionReveal } from "@/components/sections/VisionReveal";

export const metadata: Metadata = {
  title: { absolute: "MARCOS | Trade With Process and Risk Discipline" },
  description:
    "Plan, watch, review, and refine with an India-first trading community built around live reasoning, structured education, practical tools, and risk discipline.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MARCOS | Trade With Process and Risk Discipline",
    description:
      "Learn with people, review decisions honestly, and build a repeatable trading process without guaranteed-return claims or signal hype.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisionReveal />
        <CapitalMotion />
        <MarcosMethod />
        <DailyScreenShare />
        <ModernTrader />
        <Membership />
        <JoinPreview />
        <IndicatorsPreview />
        <FinalConversion />
      </main>
      <SiteFooter />
    </>
  );
}
import type { Metadata } from "next";
