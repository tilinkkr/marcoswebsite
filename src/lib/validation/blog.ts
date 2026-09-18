import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const blogInputSchema = z.object({
  slug,
  title: z.string().trim().min(8).max(180),
  excerpt: z.string().trim().min(30).max(500),
  content_markdown: z.string().trim().min(100).max(100_000),
  hero_image: z.string().trim().startsWith("/").max(300),
  author_name: z.string().trim().min(2).max(120),
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
});

export const blogPatchSchema = blogInputSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );
