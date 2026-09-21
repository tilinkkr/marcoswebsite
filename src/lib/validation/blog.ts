import { z } from "zod";

import { getAuthor } from "@/lib/authors";

const slug = z
  .string()
  .trim()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const nullableUrl = z.union([z.url(), z.literal(""), z.null()]).optional();
const editorialMarker =
  /\[(?:verify|author proof required|source required|insert topic)\]/i;

export const blogFieldsSchema = z.object({
  slug,
  title: z.string().trim().min(8).max(180),
  excerpt: z.string().trim().min(30).max(500),
  content_markdown: z.string().trim().min(100).max(100_000),
  hero_image: z.string().trim().startsWith("/").max(300),
  author_name: z.string().trim().min(2).max(120),
  author_slug: z.union([slug, z.literal("")]).default(""),
  author_proof_url: nullableUrl,
  status: z.enum(["draft", "review", "published", "archived"]),
  seo_title: z.string().trim().min(8).max(180),
  seo_description: z.string().trim().min(30).max(320),
  canonical_url: z.union([z.url(), z.literal(""), z.null()]).optional(),
  og_image: z
    .union([z.string().startsWith("/"), z.url(), z.literal(""), z.null()])
    .optional(),
  featured: z.boolean().default(false),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  requires_regulatory_review: z.boolean().default(true),
  reading_time: z.number().int().min(1).max(120),
  reviewer_name: z.string().trim().max(120).default(""),
  reviewer_qualification: z.string().trim().max(500).default(""),
  reviewer_proof_url: nullableUrl,
  methodology: z.string().trim().max(2_000).default(""),
  limitations: z.string().trim().max(2_000).default(""),
  conflicts_disclosure: z.string().trim().max(1_000).default(""),
  source_urls: z.array(z.url()).max(20).default([]),
  editorial_verified: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogFieldsSchema>;

export const editorialMaterialFields = [
  "title",
  "excerpt",
  "content_markdown",
  "author_name",
  "author_slug",
  "author_proof_url",
  "seo_title",
  "seo_description",
  "reviewer_name",
  "reviewer_qualification",
  "reviewer_proof_url",
  "methodology",
  "limitations",
  "conflicts_disclosure",
  "source_urls",
] as const satisfies readonly (keyof BlogInput)[];

export function blogDatabaseValues(article: BlogInput) {
  return {
    ...article,
    author_proof_url: article.author_proof_url || null,
    reviewer_proof_url: article.reviewer_proof_url || null,
    canonical_url: article.canonical_url || null,
    og_image: article.og_image || null,
    editorial_verified:
      article.status === "published" && article.editorial_verified,
  };
}

export function publicationIssues(article: BlogInput): string[] {
  if (article.status !== "published") return [];

  const issues: string[] = [];
  const author = getAuthor(article.author_slug);
  if (!author || author.name !== article.author_name) {
    issues.push("Select a MARCOS author whose name matches the byline.");
  }
  if (!article.author_proof_url) {
    issues.push(
      "Add a public URL supporting the author's stated role or expertise.",
    );
  }
  if (article.reviewer_name.length < 2) {
    issues.push("Name the human reviewer.");
  }
  if (article.reviewer_qualification.length < 20) {
    issues.push("Explain why the reviewer is qualified for this topic.");
  }
  if (!article.reviewer_proof_url) {
    issues.push("Add a public URL supporting the reviewer's qualification.");
  }
  if (new Set(article.source_urls).size < 3) {
    issues.push("Add at least three primary or authoritative source URLs.");
  }
  if (article.methodology.length < 30) {
    issues.push(
      "Describe the research and verification method in at least 30 characters.",
    );
  }
  if (article.limitations.length < 30) {
    issues.push("State material limitations in at least 30 characters.");
  }
  if (article.conflicts_disclosure.length < 10) {
    issues.push("Add a conflicts or commercial-interest disclosure.");
  }
  if (!article.editorial_verified) {
    issues.push(
      "A human editor must attest that the evidence and article were reviewed.",
    );
  }

  const material = [
    article.title,
    article.excerpt,
    article.content_markdown,
    article.seo_title,
    article.seo_description,
    article.methodology,
    article.limitations,
    article.conflicts_disclosure,
  ].join("\n");
  if (editorialMarker.test(material)) {
    issues.push("Remove unresolved editorial markers before publishing.");
  }

  return issues;
}

export const blogInputSchema = blogFieldsSchema.superRefine((article, ctx) => {
  publicationIssues(article).forEach((message) => {
    ctx.addIssue({
      code: "custom",
      path: ["status"],
      message,
    });
  });
});

const blogPatchFieldsSchema = blogFieldsSchema.extend({
  author_slug: z.union([slug, z.literal("")]),
  featured: z.boolean(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  requires_regulatory_review: z.boolean(),
  reviewer_name: z.string().trim().max(120),
  reviewer_qualification: z.string().trim().max(500),
  methodology: z.string().trim().max(2_000),
  limitations: z.string().trim().max(2_000),
  conflicts_disclosure: z.string().trim().max(1_000),
  source_urls: z.array(z.url()).max(20),
  editorial_verified: z.boolean(),
});

export const blogPatchSchema = blogPatchFieldsSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );
