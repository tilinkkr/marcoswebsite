import { readFile } from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  hero_image: string;
  author_name: string;
  status: "draft" | "review" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
  created_at: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string | null;
  og_image: string | null;
  featured: boolean;
  category: string;
  tags: string[];
  last_reviewed_at: string | null;
  requires_regulatory_review: boolean;
  reading_time: number;
};
const slug = "prop-firm-rules-india-2026";
async function fallback(): Promise<BlogPost> {
  const content_markdown = await readFile(
    path.join(process.cwd(), "content", "blogs", `${slug}.md`),
    "utf8",
  );
  return {
    id: "launch-article",
    slug,
    title:
      "Prop Firm Rules Explained for Indian Traders: Drawdown, Daily Loss and Challenge Rules in 2026",
    excerpt:
      "A practical guide to evaluation mechanics, daily loss, maximum drawdown and the questions Indian traders should ask before paying for a challenge.",
    content_markdown,
    hero_image: "/images/marcos/insights/prop-firm-rules-india-2026.webp",
    author_name: "Rahul Raja",
    status: "published",
    published_at: "2026-09-09T00:00:00Z",
    updated_at: "2026-09-09T00:00:00Z",
    created_at: "2026-09-09T00:00:00Z",
    seo_title:
      "Prop Firm Rules for Indian Traders: Drawdown & Challenge Guide 2026 | MARCOS",
    seo_description:
      "Understand prop-firm evaluation rules, daily loss limits, maximum drawdown, challenge targets and common mistakes for Indian traders in 2026.",
    canonical_url: null,
    og_image: null,
    featured: true,
    category: "PROP TRADING",
    tags: ["drawdown", "risk rules", "prop-firm evaluation"],
    last_reviewed_at: "2026-09-09T00:00:00Z",
    requires_regulatory_review: true,
    reading_time: 10,
  };
}
const base =
  process.env.MARCOS_API_URL ??
  process.env.NEXT_PUBLIC_MARCOS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : null);
export async function getBlogs(): Promise<BlogPost[]> {
  if (!base) return [await fallback()];
  try {
    const r = await fetch(`${base}/api/v1/blogs`, {
      next: { revalidate: 300 },
    });
    if (!r.ok) throw new Error();
    return (await r.json()) as BlogPost[];
  } catch {
    return [await fallback()];
  }
}
export async function getBlog(requested: string): Promise<BlogPost | null> {
  if (!base) return requested === slug ? fallback() : null;
  try {
    const r = await fetch(`${base}/api/v1/blogs/${requested}`, {
      next: { revalidate: 300 },
    });
    if (r.status === 404) return requested === slug ? fallback() : null;
    if (!r.ok) throw new Error();
    return (await r.json()) as BlogPost;
  } catch {
    return requested === slug ? fallback() : null;
  }
}
