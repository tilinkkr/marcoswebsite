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
