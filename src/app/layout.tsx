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
    default:
      "MARKOS | Best Funded Account Guide, Daily Live Google Meet & Kerala/GCC Desk",
    template: "%s | MARKOS",
  },
  description:
    "Compare the best funded account brokers and prop firms (BrightFunded, FundingPips, FTMO, Alpha) for India, Kerala & GCC Malayalis. Join daily live Google Meet streams or ask on WhatsApp.",
  applicationName: "MARKOS",
  metadataBase: new URL(SITE_URL),
  category: "finance",
  icons: {
    icon: [
      { url: "/images/brand/markos-logo-google.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  keywords: [
    "best funded account broker",
    "best funded account broker in india",
    "best forex funded account",
    "best forex funded account in india",
    "best forex funded account in kerala",
    "best forex funded account in uk",
    "best forex funded account in usa",
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
    "whatsapp community for trading in kerala",
    "malayali trading community gcc dubai uae",
    "funded firms groups in bangalore",
    "funded trading groups near me",
    "how to use claude for trading in india",
    "nasdaq mnq funded account india gcc",
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
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/images/brand/markos-logo.png`,
        contentUrl: `${SITE_URL}/images/brand/markos-logo.png`,
        width: 900,
        height: 299,
        caption: "MARKOS Official Trading Community Logo",
      },
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/brand/markos-logo-google.png`,
        width: 512,
        height: 512,
        caption: "MARKOS Emblem",
      },
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
        "MARKOS is an India-first forex, gold (XAUUSD), NASDAQ (MNQ) and funded-account trading community serving traders across Kerala (Kochi, Trivandrum, Kozhikode), Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, the GCC (Dubai/UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain), the UK, the USA and Australia. It hosts daily private Google Meet live trading streams, compares the best funded account brokers and prop-firm rules, and teaches disciplined risk management.",
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
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "Canada" },
      ],
      knowsLanguage: ["en", "ml", "hi"],
      knowsAbout: [
        "Best funded account brokers and prop firms",
        "Funded trading accounts",
        "Prop firm challenges and drawdown rules",
        "FundingPips, BrightFunded, FTMO and Alpha Capital rules",
        "Forex trading and XAUUSD gold trading in India",
        "NASDAQ MNQ and futures funded accounts in India and GCC",
        "Daily live Google Meet trading streams",
        "Linking funded accounts to TradingView, MT5 and Tradovate",
        "AI trading workflows using Claude, ChatGPT and Gemini",
        "Trading risk management",
        "Malayali forex trading community in Kerala and GCC",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-91875-87488",
        url: "https://wa.me/919187587488",
        availableLanguage: ["English", "Malayalam", "Hindi"],
        areaServed: [
          "IN",
          "AE",
          "SA",
          "QA",
          "KW",
          "OM",
          "BH",
          "GB",
          "US",
          "AU",
          "CA",
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "en-IN",
      copyrightYear: 2026,
      copyrightHolder: { "@id": `${SITE_URL}/#organization` },
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
        <link
          rel="alternate"
          type="text/plain"
          href={`${SITE_URL}/llms.txt`}
          title="MARKOS LLM Index"
        />
        <link
          rel="alternate"
          type="text/plain"
          href={`${SITE_URL}/llms-full.txt`}
          title="MARKOS Full LLM Knowledge Base"
        />
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
