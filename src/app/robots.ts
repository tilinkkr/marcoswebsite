import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Per Google Search Central guidelines:
  // - Never block linked pages like /join/checkout in robots.txt when they already
  //   carry meta robots="noindex, nofollow" (blocking prevents Googlebot from reading
  //   noindex and triggers "Blocked by robots.txt" warnings in Search Console).
  // - Explicitly allow Googlebot and major AI Search / LLM retrieval crawlers so
  //   MARKOS guides, regional hubs, and /llms.txt remain fully discoverable.
  const privatePaths = ["/admin/", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Google-Extended",
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Applebot",
          "Bingbot",
        ],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
