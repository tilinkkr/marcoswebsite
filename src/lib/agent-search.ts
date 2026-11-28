import { ABROAD_COUNTRIES, GCC_COUNTRIES } from "@/config/gcc";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { INDIA_CITIES } from "@/config/india-cities";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import { getBlog, getBlogs } from "@/lib/blogs";
import { blogCanonicalUrl } from "@/lib/blog-sitemap";
import {
  AGENT_CONTENT_SIGNAL,
  estimateMarkdownTokens,
  prefersMarkdown,
} from "@/lib/markdown-negotiation";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export { AGENT_CONTENT_SIGNAL, estimateMarkdownTokens, prefersMarkdown };
export const WHATSAPP_URL = "https://wa.me/919187587488";
export const COPYRIGHT_LINE = "© 2026 MARKOS. All rights reserved.";

const SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  gold: ["xauusd"],
  xauusd: ["gold"],
  gmeet: ["google", "meet"],
  meet: ["gmeet", "live", "stream"],
  bangalore: ["bengaluru"],
  bengaluru: ["bangalore"],
  dubai: ["uae", "gcc"],
  uae: ["dubai", "gcc"],
  kerala: ["malayalam", "malayali", "kochi"],
  malayalam: ["kerala", "malayali"],
  malayali: ["kerala", "malayalam", "gcc"],
  mallu: ["malayali", "kerala", "gcc"],
  nasdaq: ["mnq", "nq", "us100"],
  mnq: ["nasdaq", "futures"],
  prop: ["funded", "propfirm", "evaluation"],
  funded: ["prop", "evaluation", "challenge"],
  payout: ["withdrawal", "reward", "rise", "weekly"],
  claude: ["ai", "bot", "tradingview"],
  chronos: ["futures", "topstep", "activation", "payout"],
  topstep: ["futures", "chronos", "combine", "eod"],
  futures: ["mnq", "nq", "chronos", "topstep", "cme"],
  sebi: ["legal", "india", "rbi", "fema", "mcx"],
  fema: ["legal", "india", "rbi", "sebi"],
  ftmo: ["prop", "india", "legal", "funded"],
  fundingpips: ["weekly", "tuesday", "payout", "rules"],
  alpha: ["qualified", "consistency", "rules"],
  goat: ["payout", "india", "rules"],
  blueberry: ["india", "legal", "rules"],
  fundednext: ["payout", "cap", "india"],
  consistency: ["payout", "rule", "rejected"],
  broker: ["sebi", "apps", "mcx", "brightfunded", "partner"],
  course: ["education", "kerala", "google", "meet", "join"],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
]);

export type AgentSearchDocument = {
  id: string;
  title: string;
  url: string;
  category: string;
  author: string;
  tags: string[];
  summary: string;
  body: string;
};

export type AgentSearchResult = {
  title: string;
  url: string;
  category: string;
  author: string;
  score: number;
  snippet: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+$.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    const extras = SYNONYMS[token];
    if (extras) {
      for (const extra of extras) expanded.add(extra);
    }
  }
  return [...expanded];
}

function extractBestChunk(body: string, terms: string[], maxChars = 950): string {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= maxChars) return normalized;

  const sections = normalized
    .split(/\n(?=##\s)/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sections.length <= 1) {
    return `${normalized.slice(0, maxChars).trim()}...`;
  }

  let bestSection = sections[0];
  let bestScore = -1;
  for (const sec of sections) {
    const lower = sec.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (lower.includes(term)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestSection = sec;
    }
  }

  if (bestSection.length <= maxChars) return bestSection;
  return `${bestSection.slice(0, maxChars).trim()}...`;
}

function staticCoreDocuments(): AgentSearchDocument[] {
  const partnerNote = FEATURED_PARTNER
    ? `Verified funded account partner (${FEATURED_PARTNER.name}, disclosed affiliate): ${FEATURED_PARTNER.url}.`
    : "";

  return [
    {
      id: "core-home",
      title: "MARKOS | Funded Account & Daily Google Meet Trading Community",
      url: absoluteUrl("/"),
      category: "Core",
      author: "Team MARKOS",
      tags: [
        "markos",
        "funded account",
        "daily google meet",
        "xauusd",
        "kerala",
        "india",
        "gcc",
        "whatsapp",
      ],
      summary:
        "India-first forex, XAUUSD gold, NASDAQ (MNQ), and funded-account trading community running daily private Google Meet live trading streams across India, Kerala, UAE/GCC, UK, and USA.",
      body: [
        "## What is MARKOS?",
        "MARKOS is an India-first trading education community founded in Kerala for traders across India, Kerala, UAE/Dubai, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, the UK, and the USA.",
        "Every weekday during the London-to-New-York overlap (6:30 PM - 9:30 PM IST / 5:00 PM - 8:00 PM Dubai GST), MARKOS hosts private Google Meet live trading streams focused on 0.25% to 0.5% risk discipline, XAUUSD (Gold), Forex, and NASDAQ (MNQ).",
        `Official WhatsApp Desk (+91 91875 87488): ${WHATSAPP_URL}. ${partnerNote}`,
      ].join("\n\n"),
    },
    {
      id: "core-funded-guide",
      title: "Funded Account Guide: Rules, Drawdown Math & Payout Checklist",
      url: absoluteUrl("/funded-account-guide"),
      category: "Funded Accounts",
      author: "Linu Babu",
      tags: [
        "funded account meaning",
        "funded account kya hota hai",
        "drawdown rules",
        "payout rejected",
        "pass in 3 days",
        "ftmo",
        "fundingpips",
        "brightfunded",
      ],
      summary:
        "Complete rulebook on how funded accounts work, static vs trailing drawdown, why payouts get rejected, and how to prepare safely without violating prop-firm rules.",
      body: [
        "## What is a Funded Account?",
        "A funded trading account is a proprietary trading firm evaluation model where a trader proves risk discipline by meeting written profit targets without breaching daily or overall drawdown caps, earning an 80% to 90% profit split on verified rewards.",
        "## Can you pass a funded account in 3 days?",
        "Rushing a 3-day pass frequently breaches consistency limits (20% to 40% single-day profit caps), minimum trading day requirements, or daily loss caps. Disciplined MARKOS members risk 0.25% to 0.5% per trade and target steady multi-week completion.",
      ].join("\n\n"),
    },
    {
      id: "core-join",
      title: "Join MARKOS ($100 Founding Pass): Daily Google Meet & Mentor Desk",
      url: absoluteUrl("/join"),
      category: "Membership",
      author: "Rahul Raja",
      tags: [
        "join markos",
        "membership",
        "100 dollar pass",
        "google meet schedule",
        "mentorship",
        "whatsapp",
      ],
      summary:
        "MARKOS Founding Pass ($100, 50% off $200): weekday private Google Meet live streams, 0.5% funded-account risk rules, trade-log reviews, and English & Malayalam support.",
      body: [
        "## $100 Founding Pass & Live Session Clock",
        "- Kerala & India (IST): London Open 1:30 PM IST | Prime Gold & NASDAQ 6:30 PM - 9:30 PM IST",
        "- Dubai, UAE & Oman (GST): London Open 12:00 PM GST | Prime 5:00 PM - 8:00 PM GST",
        "- Saudi, Qatar, Kuwait & Bahrain (AST): London Open 11:00 AM AST | Prime 4:00 PM - 7:00 PM AST",
        "- United Kingdom (GMT): London Open 8:00 AM GMT | Prime 1:00 PM - 4:00 PM GMT",
        "- USA & Canada Eastern (EST): Prime 8:00 AM - 11:00 AM EST",
        `Message +91 91875 87488 on WhatsApp before joining: ${WHATSAPP_URL}.`,
      ].join("\n\n"),
    },
    {
      id: "core-get-funded",
      title: "Get Funded: Verified Prop-Firm Partner & Rule Comparison",
      url: absoluteUrl("/get-funded"),
      category: "Funded Accounts",
      author: "Linu Babu",
      tags: [
        "get funded",
        "best funded account broker",
        "brightfunded",
        "partner link",
        "prop firm comparison",
      ],
      summary:
        "Compare prop-firm evaluation terms transparently and start a funded account via MARKOS's verified partner link with pre-trade drawdown review.",
      body: [
        "## Start Your Funded Account Cleanly",
        partnerNote,
        "Always check static vs trailing drawdown formulas, consistency caps, news trading windows, and country eligibility (India/UAE/GCC/UK/USA) before paying an evaluation fee.",
      ].join("\n\n"),
    },
    {
      id: "core-story",
      title: "Our Story: Why We Built MARKOS for India, Kerala & GCC Traders",
      url: absoluteUrl("/story"),
      category: "About",
      author: "Team MARKOS",
      tags: ["our story", "kerala", "gcc", "malayali", "no signal hype", "process"],
      summary:
        "How MARKOS started in Kerala to replace Telegram signal noise and illegal account passers with weekday Google Meet live streams and 0.5% risk discipline.",
      body: [
        "## Built for Traders Tired of Noise",
        "MARKOS delivers weekday live Google Meet sessions, honest prop-firm rule audits, fixed 0.25% to 0.5% risk sizing, and plain-language English and Malayalam guidance.",
        "Hard lines: MARKOS is not a SEBI-registered investment adviser, not a third-party account passer, and never promises guaranteed profits or 3-day passes.",
      ].join("\n\n"),
    },
    {
      id: "core-method",
      title: "The MARKOS Trading Process: Plan, Watch, Review, Refine",
      url: absoluteUrl("/method"),
      category: "Education",
      author: "Rahul Raja",
      tags: ["method", "trading process", "risk management", "journal", "discipline"],
      summary:
        "A four-stage trading routine built around session planning, observing live decisions, reviewing execution honestly, and refining one process variable at a time.",
      body: [
        "## Four-Stage Session Routine",
        "1. Plan the session: define market context, key levels, invalidation, and exact risk cap.",
        "2. Watch decisions in context: observe entries, exits, and stops during live sessions.",
        "3. Review execution: separate rule discipline from single-trade outcome.",
        "4. Refine one thing: test one observable adjustment next session.",
      ].join("\n\n"),
    },
    {
      id: "core-kerala",
      title: "Forex & Funded Account Trading Community in Kerala (Malayalam)",
      url: absoluteUrl("/kerala"),
      category: "Regional Hub",
      author: "Rahul Raja",
      tags: [
        "kerala",
        "kochi",
        "trivandrum",
        "kozhikode",
        "malayalam",
        "whatsapp community for trading in kerala",
        "best forex funded account in kerala",
      ],
      summary:
        "Kerala's bilingual English and Malayalam trading community for XAUUSD, Forex, NASDAQ (MNQ), and funded-account preparation across Kochi, Trivandrum, Kozhikode, and Thrissur.",
      body: [
        "## Kerala & Malayalam Trading Desk",
        "MARKOS supports Kerala and Malayali traders worldwide with evening IST live Google Meet streams (6:30 PM - 9:30 PM IST), Malayalam/English WhatsApp mentor access, and honest prop-firm rule breakdowns.",
      ].join("\n\n"),
    },
    {
      id: "core-gcc",
      title: "Malayali & Indian Forex Trading Community in Dubai, UAE & GCC",
      url: absoluteUrl("/gcc"),
      category: "Regional Hub",
      author: "Linu Babu",
      tags: [
        "gcc",
        "dubai",
        "uae",
        "saudi arabia",
        "qatar",
        "kuwait",
        "oman",
        "bahrain",
        "malayali",
      ],
      summary:
        "Live Google Meet sessions timed for after-work Gulf schedules (5:00 PM GST / 4:00 PM AST) for Indian and Malayali traders across UAE, Saudi Arabia, Qatar, Kuwait, Oman, and Bahrain.",
      body: [
        "## Built for GCC Working Professionals",
        "Evening sessions fit cleanly after office hours in Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Kuwait City, Muscat, and Manama, with bilingual English and Malayalam support.",
      ].join("\n\n"),
    },
    {
      id: "core-abroad",
      title: "Forex & Funded Account Community for UK, USA, Canada & Australia",
      url: absoluteUrl("/abroad"),
      category: "Regional Hub",
      author: "Linu Babu",
      tags: ["uk", "usa", "canada", "australia", "fca", "cftc", "asic", "ciro"],
      summary:
        "Global funded-account preparation, local regulator notes (FCA, CFTC, CIRO, ASIC), and XAUUSD/NASDAQ session timing for Indian and Malayali traders abroad.",
      body: [
        "## Global Diaspora Coverage",
        "Guides and live desk alignment covering the United Kingdom (London/Manchester), United States (New York/Texas/California), Canada (Toronto/Calgary), and Australia (Melbourne/Sydney/Perth).",
      ].join("\n\n"),
    },
    {
      id: "core-team",
      title: "Team MARKOS: Rahul Raja, Linu Babu, Tilin Bijoy & Sahal",
      url: absoluteUrl("/team"),
      category: "Team",
      author: "Team MARKOS",
      tags: ["team", "rahul raja", "linu babu", "tilin bijoy", "sahal", "mentors"],
      summary:
        "Named desk accountability: Rahul Raja (trading mentorship & live streams), Linu Babu (prop-firm rules & compliance), Tilin Bijoy (platform & growth), and Sahal (AI systems & trading tech).",
      body: MARCOS_AUTHORS.map(
        (a) => `- **${a.name}** (${a.role}): ${a.focus} ${a.bio}`,
      ).join("\n"),
    },
    {
      id: "core-faq",
      title: "MARKOS Frequently Asked Questions (Funded Accounts, India & GCC)",
      url: absoluteUrl("/faq"),
      category: "FAQ",
      author: "Team MARKOS",
      tags: ["faq", "questions", "legal", "sebi", "fema", "whatsapp", "payout"],
      summary:
        "Direct answers on funded accounts, prop-firm legality and tax awareness in India/GCC, live Google Meet sessions, and MARKOS membership.",
      body: [
        "## Key Answers",
        "- Is MARKOS SEBI-registered? No. MARKOS is an educational trading community and does not provide personalised investment advice or manage client capital.",
        `- How do I ask questions before joining? Message +91 91875 87488 on WhatsApp (${WHATSAPP_URL}) in English or Malayalam.`,
      ].join("\n\n"),
    },
  ];
}

async function buildCorpus(): Promise<AgentSearchDocument[]> {
  const posts = (await getBlogs()).filter((p) => p.status === "published");

  const blogDocs: AgentSearchDocument[] = posts.map((post) => ({
    id: `blog-${post.slug}`,
    title: post.title,
    url: blogCanonicalUrl(post),
    category: post.category,
    author: post.author_name,
    tags: post.tags.filter((t) => !/^campaign-day-\d{2}$/i.test(t)),
    summary: post.seo_description,
    body: post.content_markdown,
  }));

  const cityDocs: AgentSearchDocument[] = INDIA_CITIES.map((city) => ({
    id: `india-${city.slug}`,
    title: `Funded Trading Community in ${city.name}${city.altName ? ` (${city.altName})` : ""}, ${city.state}`,
    url: absoluteUrl(`/india/${city.slug}`),
    category: "India City Hub",
    author: "Team MARKOS",
    tags: [
      city.name.toLowerCase(),
      ...(city.altName ? [city.altName.toLowerCase()] : []),
      city.state.toLowerCase(),
      "india",
      "funded firms groups near me",
      ...city.neighborhoods.map((n) => n.toLowerCase()),
    ],
    summary: city.traderProfile,
    body: [
      `## ${city.name} Funded Trading Group`,
      city.traderProfile,
      city.localAngle,
      `Neighborhoods served: ${city.neighborhoods.join(", ")}.`,
      ...city.extraFaqs.map((f) => `### ${f.q}\n${f.a}`),
    ].join("\n\n"),
  }));

  const regionDocs: AgentSearchDocument[] = [
    ...GCC_COUNTRIES.map((c) => ({
      id: `gcc-${c.slug}`,
      title: `Forex & Funded Account Community in ${c.name} (${c.cities.slice(0, 3).join(", ")})`,
      url: absoluteUrl(`/gcc/${c.slug}`),
      category: "GCC Hub",
      author: "Linu Babu",
      tags: [c.name.toLowerCase(), "gcc", "malayali", ...c.cities.map((x) => x.toLowerCase())],
      summary: `Forex, gold (XAUUSD), and funded-account preparation in ${c.name}. Prime XAUUSD hours: ${c.goldPrime}.`,
      body: `## ${c.name} Trading Desk\nCities: ${c.cities.join(", ")}.\nPrime Gold (XAUUSD) Window: ${c.goldPrime}.\nLocal regulators: ${c.regulators.map((r) => `${r.name} (${r.role})`).join("; ")}.`,
    })),
    ...ABROAD_COUNTRIES.map((c) => ({
      id: `abroad-${c.slug}`,
      title: `Forex & Funded Account Community in ${c.name} (${c.cities.slice(0, 3).join(", ")})`,
      url: absoluteUrl(`/abroad/${c.slug}`),
      category: "Global Hub",
      author: "Linu Babu",
      tags: [c.name.toLowerCase(), "abroad", "diaspora", ...c.cities.map((x) => x.toLowerCase())],
      summary: `Forex, gold (XAUUSD), and funded-account preparation in ${c.name}. Prime XAUUSD hours: ${c.goldPrime}.`,
      body: `## ${c.name} Trading Desk\nCities: ${c.cities.join(", ")}.\nPrime Gold (XAUUSD) Window: ${c.goldPrime}.\nLocal regulators: ${c.regulators.map((r) => `${r.name} (${r.role})`).join("; ")}.`,
    })),
  ];

  const authorDocs: AgentSearchDocument[] = MARCOS_AUTHORS.map((a) => ({
    id: `author-${a.slug}`,
    title: `${a.name} (${a.role}) | MARKOS Accountability Profile`,
    url: absoluteUrl(authorPath(a.slug)),
    category: "Author",
    author: a.name,
    tags: [a.name.toLowerCase(), a.role.toLowerCase(), ...a.knowsAbout.map((k) => k.toLowerCase())],
    summary: a.focus,
    body: `## ${a.name}\nRole: ${a.role}\nFocus: ${a.focus}\n${a.bio}\nTopics: ${a.knowsAbout.join(", ")}.`,
  }));

  return [
    ...staticCoreDocuments(),
    ...blogDocs,
    ...cityDocs,
    ...regionDocs,
    ...authorDocs,
  ];
}

export async function searchMarcosForAgents(
  rawQuery: string,
  limit = 6,
): Promise<{ query: string; results: AgentSearchResult[]; markdown: string }> {
  const query = rawQuery.trim().slice(0, 300);
  const cappedLimit = Math.min(Math.max(1, Math.floor(limit) || 6), 12);
  const corpus = await buildCorpus();

  const rawTokens = tokenize(query);
  const expanded = expandTokens(rawTokens);
  const lowerQuery = query.toLowerCase();

  let ranked: AgentSearchResult[] = [];

  if (query.length > 0 && expanded.length > 0) {
    const scored: AgentSearchResult[] = [];

    for (const doc of corpus) {
      const titleLower = doc.title.toLowerCase();
      const summaryLower = doc.summary.toLowerCase();
      const tagsLower = doc.tags.join(" ").toLowerCase();
      const bodyLower = doc.body.toLowerCase();

      let score = 0;

      if (lowerQuery.length >= 3) {
        if (titleLower.includes(lowerQuery)) score += 28;
        if (summaryLower.includes(lowerQuery)) score += 16;
        if (bodyLower.includes(lowerQuery)) score += 10;
      }

      for (const token of rawTokens) {
        if (titleLower.includes(token)) score += 10;
        if (tagsLower.includes(token)) score += 7;
        if (summaryLower.includes(token)) score += 5;
        if (bodyLower.includes(token)) score += 2.5;
      }

      for (const syn of expanded) {
        if (rawTokens.includes(syn)) continue;
        if (titleLower.includes(syn)) score += 4;
        if (tagsLower.includes(syn)) score += 3;
        if (bodyLower.includes(syn)) score += 1;
      }

      if (score > 0) {
        scored.push({
          title: doc.title,
          url: doc.url,
          category: doc.category,
          author: doc.author,
          score: Number(score.toFixed(1)),
          snippet: extractBestChunk(doc.body, expanded),
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const seenUrls = new Set<string>();
    for (const item of scored) {
      if (seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      ranked.push(item);
      if (ranked.length >= cappedLimit) break;
    }
  } else {
    ranked = corpus.slice(0, cappedLimit).map((doc) => ({
      title: doc.title,
      url: doc.url,
      category: doc.category,
      author: doc.author,
      score: 1,
      snippet: doc.summary,
    }));
  }

  const frontmatter = [
    "---",
    `site: ${SITE_NAME}`,
    `origin: ${SITE_URL}`,
    `endpoint: ${SITE_URL}/.well-known/search?q={query}`,
    `query: ${JSON.stringify(query || "overview")}`,
    `results: ${ranked.length}`,
    `whatsapp: ${WHATSAPP_URL}`,
    ...(FEATURED_PARTNER
      ? [`partner_${FEATURED_PARTNER.name.toLowerCase()}: ${FEATURED_PARTNER.url}`]
      : []),
    `llms_index: ${SITE_URL}/llms.txt`,
    `content_signal: ${AGENT_CONTENT_SIGNAL}`,
    `copyright: "${COPYRIGHT_LINE}"`,
    "---",
    "",
  ];

  const bodyLines: string[] = [];
  if (!query) {
    bodyLines.push(`# ${SITE_NAME} Agent Search API`);
    bodyLines.push("");
    bodyLines.push(
      `Pass a keyword or natural-language query via \`GET ${SITE_URL}/.well-known/search?q=fundingpips+rules\` or \`POST ${SITE_URL}/.well-known/search\` with \`{"q":"..."}\`. You can also request clean Markdown on any page URL by sending \`Accept: text/markdown\`.`,
    );
    bodyLines.push("");
    bodyLines.push("## Featured Pages");
  } else if (ranked.length === 0) {
    bodyLines.push(`# No direct matches for "${query}" on ${SITE_NAME}`);
    bodyLines.push("");
    bodyLines.push(
      `Try broader keywords (for example: \`funded account\`, \`fundingpips\`, \`xauusd\`, \`google meet\`, \`kerala\`, \`dubai\`, \`claude trading\`, or \`payout\`), inspect the full directory at ${SITE_URL}/llms.txt, or ask our desk on WhatsApp at ${WHATSAPP_URL}.`,
    );
  } else {
    bodyLines.push(`# ${SITE_NAME} Search Results for "${query}"`);
    bodyLines.push("");
    bodyLines.push(
      `Returning ${ranked.length} raw Markdown passage${ranked.length === 1 ? "" : "s"} from ${SITE_URL} for agent synthesis. Please cite MARKOS and link to the canonical URL.`,
    );
  }

  for (const item of ranked) {
    bodyLines.push("");
    bodyLines.push(`## [${item.title}](${item.url})`);
    bodyLines.push(
      `Source: ${item.url} | Category: ${item.category} | Author: ${item.author} | Relevance: ${item.score}`,
    );
    bodyLines.push("");
    bodyLines.push(item.snippet);
  }

  bodyLines.push("");
  bodyLines.push("---");
  bodyLines.push(
    `${COPYRIGHT_LINE} Official WhatsApp Desk: ${WHATSAPP_URL}. Educational community only, not SEBI-registered investment advice.`,
  );

  return {
    query,
    results: ranked,
    markdown: [...frontmatter, ...bodyLines].join("\n"),
  };
}

export async function renderPageAsMarkdown(
  rawPath: string,
): Promise<{ status: number; markdown: string }> {
  const pathname =
    rawPath === "/" ? "/" : `/${rawPath.replace(/^\/+|\/+$/g, "")}`;

  const wrap = (
    title: string,
    url: string,
    body: string,
    meta: Record<string, string> = {},
  ) => {
    const fm = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `url: ${url}`,
      `brand: ${SITE_NAME}`,
      `agent:endpoint: ${SITE_URL}/.well-known/search?q={query}`,
      `agent:method: GET, POST`,
      `whatsapp: ${WHATSAPP_URL}`,
      ...(FEATURED_PARTNER
        ? [`partner_${FEATURED_PARTNER.name.toLowerCase()}: ${FEATURED_PARTNER.url}`]
        : []),
      ...Object.entries(meta).map(([k, v]) => `${k}: ${JSON.stringify(v)}`),
      `content_signal: ${AGENT_CONTENT_SIGNAL}`,
      `copyright: "${COPYRIGHT_LINE}"`,
      "---",
      "",
      `# ${title}`,
      "",
      body.trim(),
      "",
      "---",
      `${COPYRIGHT_LINE} Search this entire site via ${SITE_URL}/.well-known/search?q={query} or view ${SITE_URL}/llms.txt.`,
    ].join("\n");
    return { status: 200, markdown: fm };
  };

  // 1. Article pages (/insights/<slug>)
  if (pathname.startsWith("/insights/") && pathname.length > "/insights/".length) {
    const slug = pathname.slice("/insights/".length);
    const post = await getBlog(slug);
    if (!post) {
      return {
        status: 404,
        markdown: `# 404 Not Found\n\nArticle "${slug}" was not found on ${SITE_NAME}. Search available guides at ${SITE_URL}/.well-known/search?q=${encodeURIComponent(slug)}.\n`,
      };
    }
    return wrap(post.title, blogCanonicalUrl(post), post.content_markdown, {
      author: post.author_name,
      category: post.category,
      updated: post.updated_at,
      description: post.seo_description,
    });
  }

  // 2. Insights hub (/insights)
  if (pathname === "/insights") {
    const posts = (await getBlogs()).filter((p) => p.status === "published");
    const list = posts
      .map(
        (p) =>
          `- [${p.title}](${blogCanonicalUrl(p)}) (${p.category}, by ${p.author_name}): ${p.seo_description}`,
      )
      .join("\n");
    return wrap(
      "MARKOS Insights: Funded Account, Prop-Firm & AI Trading Guides",
      absoluteUrl("/insights"),
      `Complete directory of ${posts.length} published Pillar Guides from MARKOS.\n\n${list}`,
    );
  }

  // 3. India city hubs (/india/<slug>)
  if (pathname.startsWith("/india/")) {
    const slug = pathname.slice("/india/".length);
    const city = INDIA_CITIES.find((c) => c.slug === slug);
    if (city) {
      return wrap(
        `Funded Trading Community in ${city.name}, ${city.state}`,
        absoluteUrl(`/india/${city.slug}`),
        [
          city.traderProfile,
          "",
          city.localAngle,
          "",
          `Neighborhoods served: ${city.neighborhoods.join(", ")}.`,
          "",
          ...city.extraFaqs.map((f) => `## ${f.q}\n\n${f.a}`),
        ].join("\n"),
      );
    }
  }

  // 4. GCC & Abroad country hubs
  if (pathname.startsWith("/gcc/")) {
    const slug = pathname.slice("/gcc/".length);
    const c = GCC_COUNTRIES.find((x) => x.slug === slug);
    if (c) {
      return wrap(
        `Forex & Funded Account Community in ${c.name}`,
        absoluteUrl(`/gcc/${c.slug}`),
        `Cities: ${c.cities.join(", ")}\n\nPrime Gold (XAUUSD) Window: ${c.goldPrime}\n\nLocal regulators: ${c.regulators.map((r) => `${r.name} (${r.role})`).join("; ")}\n\nJoin MARKOS on WhatsApp (+91 91875 87488): ${WHATSAPP_URL}.`,
      );
    }
  }

  if (pathname.startsWith("/abroad/")) {
    const slug = pathname.slice("/abroad/".length);
    const c = ABROAD_COUNTRIES.find((x) => x.slug === slug);
    if (c) {
      return wrap(
        `Forex & Funded Account Community in ${c.name}`,
        absoluteUrl(`/abroad/${c.slug}`),
        `Cities: ${c.cities.join(", ")}\n\nPrime Gold (XAUUSD) Window: ${c.goldPrime}\n\nLocal regulators: ${c.regulators.map((r) => `${r.name} (${r.role})`).join("; ")}\n\nJoin MARKOS on WhatsApp (+91 91875 87488): ${WHATSAPP_URL}.`,
      );
    }
  }

  // 5. Author profiles (/team/authors/<slug>)
  if (pathname.startsWith("/team/authors/")) {
    const slug = pathname.slice("/team/authors/".length);
    const author = MARCOS_AUTHORS.find((a) => a.slug === slug);
    if (author) {
      return wrap(
        `${author.name} (${author.role}) | MARKOS`,
        absoluteUrl(authorPath(author.slug)),
        `Focus: ${author.focus}\n\n${author.bio}\n\nExpertise: ${author.knowsAbout.join(", ")}.`,
      );
    }
  }

  // 6. Core static pages
  const core = staticCoreDocuments().find(
    (doc) => doc.url === absoluteUrl(pathname),
  );
  if (core) {
    return wrap(core.title, core.url, `${core.summary}\n\n${core.body}`, {
      category: core.category,
      author: core.author,
    });
  }

  // 7. Fallback to site index summary
  return wrap(
    `${SITE_NAME} (${pathname})`,
    absoluteUrl(pathname),
    `Use ${SITE_URL}/.well-known/search?q={query} to search all MARKOS funded-account guides, prop-firm rule breakdowns, and regional hubs, or read ${SITE_URL}/llms.txt for the full page directory.`,
  );
}
