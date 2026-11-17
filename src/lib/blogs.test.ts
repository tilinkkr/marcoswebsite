import { describe, expect, it } from "vitest";

import { blogCanonicalUrl, blogSitemapEntries } from "./blog-sitemap";

describe("blog sitemap URLs", () => {
  it("includes every eligible published article once", () => {
    const posts = Array.from({ length: 17 }, (_, index) => ({
      slug: `article-${index + 1}`,
      status: "published" as const,
      updated_at: "2026-11-17T00:00:00.000Z",
      canonical_url: null,
    }));

    const entries = blogSitemapEntries(posts);

    expect(entries).toHaveLength(17);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(17);
  });

  it("uses same-site canonical URLs and excludes drafts and redirected slugs", () => {
    const entries = blogSitemapEntries([
      {
        slug: "canonical-article",
        status: "published",
        updated_at: "2026-11-17T00:00:00.000Z",
        canonical_url: "https://markos.in/insights/preferred-article",
      },
      {
        slug: "draft-article",
        status: "draft",
        updated_at: "2026-11-17T00:00:00.000Z",
        canonical_url: null,
      },
      {
        slug: "prop-firm-payout-request-12-checks",
        status: "published",
        updated_at: "2026-11-17T00:00:00.000Z",
        canonical_url: null,
      },
    ]);

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://markos.in/insights/preferred-article",
    ]);
  });

  it("rejects cross-origin and lookalike-host CMS canonicals", () => {
    expect(
      blogCanonicalUrl({
        slug: "article",
        canonical_url: "https://markos.in.evil.example/insights/article",
      }),
    ).toBe("https://markos.in/insights/article");

    expect(
      blogCanonicalUrl({
        slug: "article",
        canonical_url: "https://example.com/insights/article",
      }),
    ).toBe("https://markos.in/insights/article");
  });
});
