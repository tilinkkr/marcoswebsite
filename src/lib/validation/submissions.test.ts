import { describe, expect, it } from "vitest";

import {
  checkoutAgreementSchema,
  contactSubmissionSchema,
} from "./submissions";

describe("submission validation", () => {
  it("rejects a populated honeypot", () => {
    expect(
      contactSubmissionSchema.safeParse({
        name: "Asha",
        email: "asha@example.com",
        phone: "",
        topic: "Membership",
        message: "I would like more information about the MARCOS membership.",
        website: "spam.example",
      }).success,
    ).toBe(false);
  });

  it("requires the signed checkout name to match", () => {
    expect(
      checkoutAgreementSchema.safeParse({
        product_slug: "marcos-membership",
        full_name: "Asha Nair",
        email: "asha@example.com",
        mobile: "918888888888",
        country: "India",
        whatsapp_number: null,
        typed_name: "Someone Else",
        consent: { read_risk: true, no_guarantee: true, agree_terms: true },
      }).success,
    ).toBe(false);
  });
});
