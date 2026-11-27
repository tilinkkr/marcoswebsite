import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        // Consolidate the www host onto the canonical apex host. Path and
        // query are preserved; only the exact www host matches, so no
        // user-controlled destination is possible.
        source: "/:path*",
        has: [{ type: "host", value: "www.markos.in" }],
        destination: "https://markos.in/:path*",
        permanent: true,
      },
      {
        // Retired URL still earning impressions in Search Console.
        source: "/insights/prop-firm-rules-india-2026",
        destination: "/insights/prop-firms-india-10-names-before-paying",
        permanent: true,
      },
      {
        source: "/insights/prop-firm-payout-request-12-checks",
        destination: "/insights/first-prop-firm-payout-request-checklist",
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: "/images/(brand|studio)/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/images/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=2592000, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/(llms\\.txt|llms-full\\.txt)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
