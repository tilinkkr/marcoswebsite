import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full legal name"),
  email: z.email("Enter a valid email address"),
  mobile: z.string().trim().min(7, "Enter a valid mobile number").max(24),
  country: z.string().trim().min(2, "Enter your country"),
  whatsappNumber: z.string().trim().max(24).optional(),
  readRisk: z.boolean().refine(Boolean, "Required"),
  noGuarantee: z.boolean().refine(Boolean, "Required"),
  agreeTerms: z.boolean().refine(Boolean, "Required"),
  typedName: z.string().trim().min(2, "Type your full name"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const detailsFields = [
  "fullName",
  "email",
  "mobile",
  "country",
  "whatsappNumber",
] as const;
