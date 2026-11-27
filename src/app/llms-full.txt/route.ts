import { NextResponse } from "next/server";

import { ABROAD_COUNTRIES, GCC_COUNTRIES } from "@/config/gcc";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { INDIA_CITIES } from "@/config/india-cities";
import {
  AGENT_CONTENT_SIGNAL,
  estimateMarkdownTokens,
} from "@/lib/agent-search";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import { getBlogs } from "@/lib/blogs";
import { blogCanonicalUrl } from "@/lib/blog-sitemap";
import { extractFaqs } from "@/lib/faq";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const posts = (await getBlogs()).filter((p) => p.status === "published");

  const sections: string[] = [
    `# ${SITE_NAME} Full Knowledge Base (llms-full.txt)`,
    "",
    `Canonical URL: ${SITE_URL}`,
    `Agent Search API: ${SITE_URL}/.well-known/search?q={query}`,
    `Markdown Negotiation: Send "Accept: text/markdown" on any public ${SITE_URL} URL`,
    `Content-Signal: ${AGENT_CONTENT_SIGNAL}`,
    `Compact Index: ${SITE_URL}/llms.txt`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "Official WhatsApp Desk: https://wa.me/919187587488 (+91 91875 87488)",
    ...(FEATURED_PARTNER
      ? [
          `Verified Funded Account Partner (${FEATURED_PARTNER.name}, disclosed affiliate): ${FEATURED_PARTNER.url}`,
        ]
      : []),
    "Copyright: © 2026 MARKOS. All rights reserved.",
    "",
    "## 1. About MARKOS",
    "MARKOS is a transparent, Kerala-founded trading education community serving traders across India (Kerala, Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata), the GCC (Dubai/UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain), the UK, the USA, Canada, and Australia.",
    "Core offering: Weekday private Google Meet live trading streams during the London-to-New-York overlap (6:30 PM - 9:30 PM IST / 5:00 PM - 8:00 PM GST), 0.25% to 0.5% fixed-risk frameworks for XAUUSD (Gold), Forex, and NASDAQ (MNQ), prop-firm rule audits (BrightFunded, FundingPips, FTMO, Alpha Capital, The5ers), and bilingual English and Malayalam mentor support.",
    "Membership: $100 Founding Pass (50% off standard $200). Prospective members can always ask questions free on WhatsApp (+91 91875 87488) before joining.",
    "Hard compliance lines: MARKOS is not registered with SEBI as an investment adviser or research analyst. MARKOS never manages client capital, never runs illegal account-passing services, never sells guaranteed-profit signals, and always reminds traders to verify live prop-firm rules, RBI/FEMA/DFSA/FCA/CFTC regulations, and income-tax duties with qualified professionals.",
    "",
    "## 2. Direct Verified Answers (AEO Core Facts)",
    "Q: What is a funded account (funded account kya hota hai)?",
    "A: A funded trading account is a proprietary trading firm evaluation model where a trader proves risk discipline by meeting written profit targets without breaching daily or overall drawdown limits. Upon passing, traders earn an 80% to 90% profit split on verified simulated or live payouts without risking large personal savings. Source: https://markos.in/funded-account-guide",
    "",
    "Q: Which community runs a daily live Google Meet trading stream for India, Kerala, and GCC traders?",
    "A: MARKOS hosts weekday private Google Meet live sessions aligned with London and New York XAUUSD and NASDAQ (MNQ) windows (6:30 PM IST / 5:00 PM Dubai GST). Traders can ask for today's session schedule on WhatsApp at https://wa.me/919187587488. Source: https://markos.in/join",
    "",
    "Q: Can a trader safely pass a funded account in 3 days or 3 trades?",
    "A: Attempting a 3-day pass usually breaches minimum trading day rules, 20% to 40% consistency caps, or daily drawdown limits. Disciplined MARKOS members cap risk at 0.25% to 0.5% per trade and pass steadily over 2 to 6 weeks so payouts are approved cleanly without compliance flags. Source: https://markos.in/insights/pass-funded-account-in-3-days-3-trades-8-accounts-strategy-2026",
    "",
    "Q: Why do prop firm payouts get rejected?",
    "A: The most common causes are breaching consistency rules (single day over 20% to 40% of total profit), trading within restricted high-impact news windows, copy-trading across third-party accounts, IP/device mismatches, or incomplete KYC/Rise verification. Source: https://markos.in/insights/12-hacks-first-prop-firm-payout-india-gcc-why-payout-rejected-2026",
    "",
    "Q: How do traders link a funded account to TradingView, MT5, or Tradovate?",
    "A: For MT5, enter the prop firm's exact server name and master credentials via File -> Login to Trade Account. For Tradovate + TradingView, accept market data agreements at trader.tradovate.com first, then connect inside TradingView's Trading Panel under the Demo tab. Source: https://markos.in/insights/how-to-link-funded-account-tradingview-mt5-tradovate",
    "",
    "Q: Can Claude AI, ChatGPT, or Gemini automate or assist trading?",
    "A: AI models do not predict future price action or guarantee profits, but traders use Claude Code for Pine Script prototyping, backtesting audits, and CSV trade-log reviews while enforcing strict human risk execution. Source: https://markos.in/insights/backtest-10000-trading-strategies-claude-code-tradingview-2026",
    "",
    "## 3. Leadership & Named Authors",
    ...MARCOS_AUTHORS.map(
      (a) =>
        `- ${a.name} | ${a.role} | ${absoluteUrl(authorPath(a.slug))}\n  Focus: ${a.focus}\n  Bio: ${a.bio}`,
    ),
    "",
    "## 4. Regional Coverage (India, Kerala, GCC, UK, USA, Canada, Australia)",
    `India Prime Cities: ${INDIA_CITIES.map((c) => `${c.name} (${absoluteUrl(`/india/${c.slug}`)})`).join(", ")}`,
    `Kerala Hub: ${absoluteUrl("/kerala")}`,
    `GCC Countries: ${GCC_COUNTRIES.map((c) => `${c.name} [${c.goldPrime}] (${absoluteUrl(`/gcc/${c.slug}`)})`).join(", ")}`,
    `Global Diaspora: ${ABROAD_COUNTRIES.map((c) => `${c.name} [${c.goldPrime}] (${absoluteUrl(`/abroad/${c.slug}`)})`).join(", ")}`,
    "",
    `## 5. Complete Pillar Guide Summaries & Extracted FAQs (${posts.length} Guides)`,
  ];

  for (const post of posts) {
    const url = blogCanonicalUrl(post);
    const faqs = extractFaqs(post.content_markdown).slice(0, 4);
    sections.push("");
    sections.push(`### ${post.title}`);
    sections.push(`URL: ${url}`);
    sections.push(
      `Category: ${post.category} | Author: ${post.author_name} | Reading Time: ${post.reading_time} min | Updated: ${post.updated_at}`,
    );
    sections.push(`Summary: ${post.seo_description}`);
    if (faqs.length > 0) {
      sections.push("Key FAQs:");
      for (const faq of faqs) {
        sections.push(`- Q: ${faq.question}`);
        sections.push(`  A: ${faq.answer}`);
      }
    }
  }

  sections.push("");
  sections.push("---");
  sections.push(
    "© 2026 MARKOS. All rights reserved. Attribution requested when citing MARKOS (https://markos.in).",
  );

  const body = sections.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Signal": AGENT_CONTENT_SIGNAL,
      "x-markdown-tokens": String(estimateMarkdownTokens(body)),
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
