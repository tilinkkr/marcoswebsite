import type { Metadata } from "next";

import { LenisProvider } from "@/components/animations/lenis-provider";
import { RouteBackButton } from "@/components/layout/RouteBackButton";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { WhatsAppCommunityPrompt } from "@/components/layout/WhatsAppCommunityPrompt";
import { FundedOfferPrompt } from "@/components/layout/FundedOfferPrompt";
import { ibmPlexMono, ibmPlexSans, manrope, spaceGrotesk } from "@/lib/fonts";
import { safeJsonLd, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MARKOS | India-First Trading Community",
    template: "%s | MARKOS",
  },
  description:
    "MARKOS helps Indian traders build a repeatable process through structured education, live market learning, risk discipline, practical tools, and community review.",
  applicationName: "MARKOS",
  metadataBase: new URL(SITE_URL),
  category: "finance",
  keywords: [
    "trading community India",
    "trading education India",
    "forex trading community",
    "trading risk management",
    "prop trading education",
    "Kerala traders community",
    "forex trading Kerala",
    "forex trading Malayalam",
    "funded account Kerala",
    "Malayali traders GCC",
    "XAUUSD gold trading",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      // Spellings people search for (Search Console): markos, marcos,
      // team markos, markos market.
      alternateName: [
        "Markos",
        "Marcos",
        "Team MARKOS",
        "MARKOS Market",
        "MARKOS Trading Community",
        "MARKOS Kerala",
      ],
      description:
        "MARKOS is a Kerala-based forex, gold (XAUUSD) and funded-account trading community and education platform for Malayali traders in Kerala, across India and in the GCC — UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain. It runs weekday live trading sessions, forex courses and prop-firm challenge preparation focused on risk discipline.",
      areaServed: [
        { "@type": "State", name: "Kerala" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Saudi Arabia" },
        { "@type": "Country", name: "Qatar" },
        { "@type": "Country", name: "Kuwait" },
        { "@type": "Country", name: "Oman" },
        { "@type": "Country", name: "Bahrain" },
      ],
      knowsLanguage: ["en", "ml"],
      knowsAbout: [
        "Forex trading",
        "XAUUSD gold trading",
        "Funded trading accounts",
        "Prop firm challenges",
        "Trading risk management",
        "Forex trading education in Malayalam",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-91875-87488",
        url: "https://wa.me/919187587488",
        availableLanguage: ["English", "Malayalam"],
        areaServed: ["IN", "AE", "SA", "QA", "KW", "OM", "BH"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }}
        />
      </head>
      <body className="font-body flex min-h-full flex-col">
        <LenisProvider>
          <RouteBackButton />
          {children}
          <WhatsAppButton />
          <WhatsAppCommunityPrompt />
          <FundedOfferPrompt />
        </LenisProvider>
      </body>
    </html>
  );
}
