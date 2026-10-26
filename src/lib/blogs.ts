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
  author_slug: string | null;
  author_proof_url: string | null;
  publication_mode: "human" | "automated";
  automated_reviewed_at: string | null;
  automated_review_report: Record<string, unknown>;
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
  reviewer_name: string;
  reviewer_qualification: string;
  reviewer_proof_url: string | null;
  methodology: string;
  limitations: string;
  conflicts_disclosure: string;
  source_urls: string[];
  editorial_verified: boolean;
};
const getPublishedBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const client = createSupabaseAdminClient();
    if (!client) return [];
    const { data, error } = await client
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .or(
        "editorial_verified.eq.true,and(publication_mode.eq.automated,automated_reviewed_at.not.is.null)",
      )
      .order("published_at", { ascending: false });
    if (error || !data?.length) return [];
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
      if (!client) return null;
      const { data, error } = await client
        .from("blog_posts")
        .select("*")
        .eq("slug", requested)
        .eq("status", "published")
        .or(
          "editorial_verified.eq.true,and(publication_mode.eq.automated,automated_reviewed_at.not.is.null)",
        )
        .maybeSingle();
      if (error || !data) return null;
      return data as BlogPost;
    },
    ["published-blog", requested],
    { revalidate: 60, tags: ["blogs", `blog:${requested}`] },
  )();
}
