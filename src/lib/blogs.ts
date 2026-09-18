import { readFile } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
const getPublishedBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const client = createSupabaseAdminClient();
    if (!client) return [await fallback()];
    const { data, error } = await client
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error || !data?.length) return [await fallback()];
    return data as BlogPost[];
  },
  ["published-blogs"],
  { revalidate: 60, tags: ["blogs"] },
);

export async function getBlogs(): Promise<BlogPost[]> {
  return getPublishedBlogs();
}

export async function getBlog(requested: string): Promise<BlogPost | null> {
  return unstable_cache(
    async () => {
      const client = createSupabaseAdminClient();
      if (!client) return requested === slug ? fallback() : null;
      const { data, error } = await client
        .from("blog_posts")
        .select("*")
        .eq("slug", requested)
        .eq("status", "published")
        .maybeSingle();
      if (error || !data) return requested === slug ? fallback() : null;
      return data as BlogPost;
    },
    ["published-blog", requested],
    { revalidate: 60, tags: ["blogs", `blog:${requested}`] },
  )();
}
