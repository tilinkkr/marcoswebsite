export type MarcosAuthor = {
  slug: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  knowsAbout: readonly string[];
};

/**
 * Registration status shown wherever an author is named. None of the
 * MARKOS team holds a SEBI investment-adviser or research-analyst
 * registration, or an equivalent licence from a GCC, Canadian or
 * Australian regulator. Content is education, not advice.
 */
export const AUTHOR_REGISTRATION_DISCLOSURE =
  "Not registered with SEBI as an investment adviser or research analyst, and not licensed by any GCC, Canadian or Australian financial regulator. Educational content only — not investment advice.";

export const MARCOS_AUTHORS: readonly MarcosAuthor[] = [
  {
    slug: "rahul-raja",
    name: "Rahul Raja",
    role: "COO & Lead Trader",
    focus: "Forex, gold (XAUUSD) and funded-account trading",
    bio: "Rahul has been trading for more than 10 years and leads trading education and community standards at MARKOS, focusing on forex, gold (XAUUSD), prop-firm challenges and risk discipline for Malayali traders in Kerala and the GCC.",
    knowsAbout: [
      "Forex trading",
      "XAUUSD gold trading",
      "Prop firm challenges",
      "Trading risk management",
    ],
  },
  {
    slug: "linu-babu",
    name: "Linu Babu",
    role: "CFO",
    focus: "Costs, payouts, compliance questions and operations",
    bio: "Linu is the Chief Financial Officer of MARKOS. He writes about the money side of trading — challenge costs, payouts, payment routes and the regulatory questions traders in India and the GCC should check.",
    knowsAbout: [
      "Prop firm payouts",
      "Trading costs",
      "Forex regulation in India",
      "Crypto taxation in India",
    ],
  },
  {
    slug: "tilin-bijoy",
    name: "Tilin Bijoy",
    role: "CTO",
    focus: "Product and platform technology",
    bio: "Tilin leads MARKOS technology, including product experience, backend systems, and community tooling.",
    knowsAbout: ["Trading technology", "AI tools for traders"],
  },
  {
    slug: "sahal",
    name: "Sahal",
    role: "Content Creator & Trader",
    focus: "Market education, AI tools and trading content",
    bio: "Sahal is a trader and the content creator at MARKOS. He explains forex basics, AI tools for traders and market ideas in plain language — in Malayalam and English.",
    knowsAbout: [
      "Forex basics",
      "AI tools for trading",
      "Quantitative trading",
      "Trading education in Malayalam",
    ],
  },
] as const;

export function getAuthor(slug: string | null | undefined) {
  if (!slug) return null;
  return MARCOS_AUTHORS.find((author) => author.slug === slug) ?? null;
}

export function getAuthorByName(name: string | null | undefined) {
  if (!name) return null;
  return MARCOS_AUTHORS.find((author) => author.name === name) ?? null;
}

export function authorPath(slug: string) {
  return `/team/authors/${slug}`;
}

const LINU_TOPICS =
  /legal|payout|cost|affordable|platforms|crypto|free-funded|scale|pause|budget/;
const SAHAL_TOPICS =
  /claude|ai-trading|quant|what-is-forex|choose-trading-community|myths-that-hold/;

/**
 * Byline for a post: the human author when one is recorded, otherwise the
 * team member responsible for that topic area.
 */
export function bylineSlugForPost(post: {
  slug: string;
  author_slug: string | null;
}): string {
  if (post.author_slug && getAuthor(post.author_slug)) return post.author_slug;
  if (LINU_TOPICS.test(post.slug)) return "linu-babu";
  if (SAHAL_TOPICS.test(post.slug)) return "sahal";
  return "rahul-raja";
}
