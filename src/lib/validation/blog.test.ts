import { describe, expect, it } from "vitest";

import { blogInputSchema, blogPatchSchema, publicationIssues } from "./blog";

const completeArticle = {
  slug: "risk-rules-explained",
  title: "Risk rules explained for active market participants",
  excerpt:
    "A sourced educational guide to understanding risk controls before making a market decision.",
  content_markdown:
    "## Start with the rule\n\nThis educational article explains how to verify the rule, compare the source, and record material limitations before making a decision.",
  hero_image: "/images/marcos/insights/prop-firm-rules-india-2026.webp",
  author_name: "Rahul Raja",
  author_slug: "rahul-raja",
  author_proof_url: "https://example.com/rahul",
  status: "published" as const,
  seo_title: "Risk rules explained | MARCOS",
  seo_description:
    "Learn how to verify market risk rules using primary sources, stated limitations, and a documented editorial review.",
  canonical_url: null,
  og_image: null,
  featured: false,
  category: "RISK",
  tags: ["risk"],
  requires_regulatory_review: true,
  reading_time: 6,
  reviewer_name: "Qualified Reviewer",
  reviewer_qualification:
    "An independently evidenced subject-matter reviewer for this article.",
  reviewer_proof_url: "https://example.com/reviewer",
  methodology:
    "The editor compared the article against current primary sources and checked every material claim.",
  limitations:
    "Rules and provider terms can change, and this article does not address every reader's circumstances.",
  conflicts_disclosure: "MARCOS has no paid placement in this article.",
  source_urls: [
    "https://example.com/source-one",
    "https://example.com/source-two",
    "https://example.com/source-three",
  ],
  editorial_verified: true,
};

describe("blog publication gate", () => {
  it("accepts a fully evidenced published article", () => {
    expect(blogInputSchema.safeParse(completeArticle).success).toBe(true);
  });

  it("keeps incomplete work publishable only as a draft or review", () => {
    const incomplete = {
      ...completeArticle,
      status: "review" as const,
      source_urls: [],
      editorial_verified: false,
      methodology: "",
    };

    expect(blogInputSchema.safeParse(incomplete).success).toBe(true);
    expect(publicationIssues({ ...incomplete, status: "published" })).toEqual(
      expect.arrayContaining([
        "Add at least three primary or authoritative source URLs.",
        "A human editor must attest that the evidence and article were reviewed.",
      ]),
    );
  });

  it("rejects unresolved verification markers", () => {
    const result = blogInputSchema.safeParse({
      ...completeArticle,
      content_markdown: `${completeArticle.content_markdown}\n\n[VERIFY]`,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a byline that does not match the selected author", () => {
    const result = blogInputSchema.safeParse({
      ...completeArticle,
      author_name: "Different Person",
    });

    expect(result.success).toBe(false);
  });

  it("does not inject defaults into a partial update", () => {
    expect(blogPatchSchema.parse({ status: "review" })).toEqual({
      status: "review",
    });
  });

  it("does not count duplicate source URLs as separate evidence", () => {
    const repeated = "https://example.com/repeated";
    const result = blogInputSchema.safeParse({
      ...completeArticle,
      source_urls: [repeated, repeated, repeated],
    });

    expect(result.success).toBe(false);
  });
});
