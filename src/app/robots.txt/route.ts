import { NextResponse } from "next/server";

import { AGENT_CONTENT_SIGNAL } from "@/lib/markdown-negotiation";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const aiAndSearchAgents = [
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
  ];

  const lines = [
    "# MARKOS robots.txt & Content Signals Policy",
    "# Search API for AI Agents: https://markos.in/.well-known/search?q={query}",
    "# Markdown for Agents: Send Accept: text/markdown on any public page URL",
    "# LLM Index: https://markos.in/llms.txt",
    "",
    "User-agent: *",
    `Content-Signal: ${AGENT_CONTENT_SIGNAL}`,
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    ...aiAndSearchAgents.flatMap((agent) => [
      `User-agent: ${agent}`,
      `Content-Signal: ${AGENT_CONTENT_SIGNAL}`,
      "Allow: /",
      "Disallow: /admin/",
      "Disallow: /api/",
      "",
    ]),
    `Host: ${SITE_URL}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Signal": AGENT_CONTENT_SIGNAL,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
