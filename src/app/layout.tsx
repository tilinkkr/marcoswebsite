import type { Metadata } from "next";

import { LenisProvider } from "@/components/animations/lenis-provider";
import { RouteBackButton } from "@/components/layout/RouteBackButton";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ibmPlexMono, ibmPlexSans, manrope, spaceGrotesk } from "@/lib/fonts";

import "./globals.css";

const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: {
    default: "MARCOS | Premium Forex Trading Community",
    template: "%s | MARCOS",
  },
  description:
    "MARCOS is a premium forex trading community built for disciplined market participants.",
  applicationName: "MARCOS",
  metadataBase: new URL(deploymentUrl),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="font-body flex min-h-full flex-col">
        <LenisProvider>
          <RouteBackButton />
          {children}
          <WhatsAppButton />
        </LenisProvider>
      </body>
    </html>
  );
}
