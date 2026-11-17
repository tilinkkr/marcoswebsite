import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
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
        source: "/insights/prop-firm-payout-request-12-checks",
        destination: "/insights/first-prop-firm-payout-request-checklist",
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
