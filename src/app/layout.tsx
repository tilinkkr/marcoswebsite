import type { Metadata } from "next";

import { LenisProvider } from "@/components/animations/lenis-provider";
import { RouteBackButton } from "@/components/layout/RouteBackButton";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ibmPlexMono, ibmPlexSans, manrope, spaceGrotesk } from "@/lib/fonts";
import { safeJsonLd, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MARCOS | India-First Trading Community",
    template: "%s | MARCOS",
  },
  description:
    "MARCOS helps Indian traders build a repeatable process through structured education, live market learning, risk discipline, practical tools, and community review.",
  applicationName: "MARCOS",
  metadataBase: new URL(SITE_URL),
  category: "finance",
  keywords: [
    "trading community India",
    "trading education India",
    "forex trading community",
    "trading risk management",
    "prop trading education",
    "Kerala traders community",
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
      description:
        "An India-first trading education and community platform focused on process, risk discipline, live learning, and post-trade review.",
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
        </LenisProvider>
      </body>
    </html>
  );
}
