import { unstable_cache } from "next/cache";

import { CURATED_BLOG_POSTS } from "@/content/curated-blogs";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { BLOG_POST_REDIRECTS } from "@/lib/blog-sitemap";

export {
  BLOG_POST_REDIRECTS,
  blogCanonicalUrl,
  blogSitemapEntries,
} from "@/lib/blog-sitemap";

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

// Articles show an image only when they have their own. There is no shared
// fallback: a reused stock image across unrelated articles reads as a
// placeholder to readers and adds nothing for search.
export function blogHeroImage(
  post: Pick<BlogPost, "hero_image">,
): string | null {
  return post.hero_image?.trim() || null;
}

const getPublishedBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const client = createSupabasePublicClient();
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
  const redirectedSlugs = new Set(Object.keys(BLOG_POST_REDIRECTS));
  const dbPosts = await getPublishedBlogs();
  const bySlug = new Map<string, BlogPost>();

  for (const post of dbPosts) {
    if (!redirectedSlugs.has(post.slug)) bySlug.set(post.slug, post);
  }
  for (const post of CURATED_BLOG_POSTS) {
    if (!redirectedSlugs.has(post.slug) && !bySlug.has(post.slug)) {
      bySlug.set(post.slug, post);
    }
  }

  return [...bySlug.values()].sort((a, b) => {
    const timeA = Date.parse(a.published_at ?? a.updated_at) || 0;
    const timeB = Date.parse(b.published_at ?? b.updated_at) || 0;
    return timeB - timeA;
  });
}

export async function getBlog(requested: string): Promise<BlogPost | null> {
  const dbPost = await unstable_cache(
    async () => {
      const client = createSupabasePublicClient();
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

  if (dbPost) return dbPost;
  return CURATED_BLOG_POSTS.find((post) => post.slug === requested) ?? null;
}
