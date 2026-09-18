import { z } from "zod";

const optionalPhone = z.string().trim().max(32).optional().or(z.literal(""));

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  phone: optionalPhone,
  topic: z.string().trim().min(2).max(80),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const teamApplicationSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  mobile: z.string().trim().min(7).max(32),
  location: z.string().trim().min(2).max(120),
  area: z.string().trim().min(2).max(80),
  why_marcos: z.string().trim().min(30).max(5000),
  contribution: z.string().trim().min(30).max(5000),
  portfolio_url: z.union([z.url(), z.literal("")]).optional(),
});

export const checkoutAgreementSchema = z
  .object({
    product_slug: z.enum(["marcos-membership", "marcos-one"]),
    full_name: z.string().trim().min(2).max(120),
    email: z.email().transform((value) => value.toLowerCase()),
    mobile: z.string().trim().min(7).max(32),
    country: z.string().trim().min(2).max(120),
    whatsapp_number: optionalPhone.nullable(),
    typed_name: z.string().trim().min(2).max(120),
    consent: z.object({
      read_risk: z.literal(true),
      no_guarantee: z.literal(true),
      agree_terms: z.literal(true),
    }),
  })
  .refine(
    (value) => value.full_name.toLowerCase() === value.typed_name.toLowerCase(),
    { message: "Typed name must match the legal name", path: ["typed_name"] },
  );

export const paymentSubmissionSchema = z.object({
  reference_number: z.string().trim().min(4).max(120),
  screenshot_base64: z.string().max(2_800_000).nullable().optional(),
  screenshot_content_type: z
    .enum(["image/png", "image/jpeg", "image/webp"])
    .nullable()
    .optional(),
});

export const submissionStatusSchema = z.object({
  status: z.enum(["new", "reviewing", "approved", "rejected", "archived"]),
});
