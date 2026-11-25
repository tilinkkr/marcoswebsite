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
    default: "MARKOS | Funded Account & Daily Live Google Meet Trading Community",
    template: "%s | MARKOS",
  },
  description:
    "MARKOS is India, UAE & GCC's funded account trading community with daily private Google Meet live trading streams, prop-firm rules guides (FundingPips, FTMO, Alpha Capital), XAUUSD gold education, and risk discipline. Message us on WhatsApp.",
  applicationName: "MARKOS",
  metadataBase: new URL(SITE_URL),
  category: "finance",
  keywords: [
    "funded account",
    "funded account in india",
    "funded account meaning",
    "funded account kya hota hai",
    "funded account forex",
    "funded account free challenge",
    "funding pips rules explained",
    "safest prop firms",
    "prop firm payout in india",
    "how to trade xauusd in india",
    "is ftmo legal in india",
    "daily live stream for trading in google meet",
    "funded firms groups in bangalore",
    "funded trading groups near me",
    "how to use claude for trading in india",
    "trading community India",
    "Kerala traders community",
    "Malayali traders GCC",
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
      "@type": ["Organization", "EducationalOrganization"],
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
        "MARKOS Funded Account Community",
      ],
      description:
        "MARKOS is an India-first forex, gold (XAUUSD) and funded-account trading community and education platform serving traders across Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, Kochi, Kerala, and the GCC (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain). It hosts daily private Google Meet live trading streams for funded-account preparation, prop-firm rule breakdowns (FundingPips, FTMO, Alpha Capital), AI trading workflows, and strict risk discipline.",
      areaServed: [
        { "@type": "City", name: "Bengaluru" },
        { "@type": "City", name: "Mumbai" },
        { "@type": "City", name: "Delhi" },
        { "@type": "City", name: "Hyderabad" },
        { "@type": "City", name: "Pune" },
        { "@type": "City", name: "Chennai" },
        { "@type": "City", name: "Ahmedabad" },
        { "@type": "City", name: "Kolkata" },
        { "@type": "City", name: "Kochi" },
        { "@type": "State", name: "Kerala" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Saudi Arabia" },
        { "@type": "Country", name: "Qatar" },
        { "@type": "Country", name: "Kuwait" },
        { "@type": "Country", name: "Oman" },
        { "@type": "Country", name: "Bahrain" },
      ],
      knowsLanguage: ["en", "ml", "hi"],
      knowsAbout: [
        "Funded trading accounts",
        "Prop firm challenges and drawdown rules",
        "FundingPips rules and payouts",
        "FTMO and Alpha Capital rules in India",
        "Forex trading and XAUUSD gold trading in India",
        "Daily live Google Meet trading streams",
        "Linking funded accounts to TradingView, MT5 and Tradovate",
        "AI trading workflows using Claude, ChatGPT and Gemini",
        "Trading risk management",
        "Forex trading education in Malayalam and English",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-91875-87488",
        url: "https://wa.me/919187587488",
        availableLanguage: ["English", "Malayalam", "Hindi"],
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
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
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
