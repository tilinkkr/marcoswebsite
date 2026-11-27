import { absoluteUrl, SITE_URL } from "@/lib/site";

export const BLOG_POST_REDIRECTS: Readonly<Record<string, string>> = {
  "prop-firm-rules-india-2026": "prop-firms-india-10-names-before-paying",
  "prop-firm-payout-request-12-checks":
    "first-prop-firm-payout-request-checklist",
};

type SitemapBlog = {
  slug: string;
  status: string;
  updated_at: string;
  canonical_url: string | null;
};

export function blogCanonicalUrl(
  post: Pick<SitemapBlog, "slug" | "canonical_url">,
): string {
  const fallback = absoluteUrl(`/insights/${post.slug}`);
  if (!post.canonical_url) return fallback;

  try {
    const canonical = new URL(post.canonical_url);
    if (
      canonical.origin === new URL(SITE_URL).origin &&
      !canonical.username &&
      !canonical.password
    ) {
      return canonical.toString();
    }
  } catch {
    // Invalid or cross-origin CMS canonicals fall back to the article URL.
  }

  return fallback;
}

export function blogSitemapEntries(posts: readonly SitemapBlog[]) {
  const redirectedSlugs = new Set(Object.keys(BLOG_POST_REDIRECTS));
  const entries = new Map<
    string,
    {
      url: string;
      lastModified: Date;
      changeFrequency: "monthly";
      priority: number;
    }
  >();

  for (const post of posts) {
    if (post.status !== "published" || redirectedSlugs.has(post.slug)) continue;
    const url = blogCanonicalUrl(post);
    entries.set(url, {
      url,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return [...entries.values()];
}
