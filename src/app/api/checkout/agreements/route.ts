import { createHash, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { indicatorProduct, membershipProduct } from "@/config/products";
import { RISK_POLICY_VERSION } from "@/config/risk-policy";
import { writeAuditEvent } from "@/lib/audit";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkoutAgreementSchema } from "@/lib/validation/submissions";

export async function POST(request: NextRequest) {
  const blocked = await guardPublicMutation(request, {
    key: "checkout",
    maxBytes: 20_000,
    requests: 5,
  });
  if (blocked) return blocked;

  const parsed = checkoutAgreementSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout agreement" },
      { status: 400 },
    );
  }
  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const product =
    parsed.data.product_slug === indicatorProduct.slug
      ? indicatorProduct
      : membershipProduct;
  const accessToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(accessToken).digest("hex");
  const orderReference = `MRC-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  const { data: agreement, error: agreementError } = await client
    .from("form_submissions")
    .insert({
      form_type: "checkout",
      name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.mobile,
      status: "reviewing",
      payload: {
        product_slug: product.slug,
        country: parsed.data.country,
        whatsapp_number: parsed.data.whatsapp_number || null,
        typed_name: parsed.data.typed_name,
        consent: parsed.data.consent,
        policy_version: RISK_POLICY_VERSION,
        order_reference: orderReference,
        amount: product.offerPrice,
        currency: product.currency,
      },
    })
    .select("id")
    .single();
  if (agreementError)
    return NextResponse.json(
      { error: "Could not create agreement" },
      { status: 500 },
    );

  const { data: payment, error: paymentError } = await client
    .from("form_submissions")
    .insert({
      parent_submission_id: agreement.id,
      form_type: "payment",
      name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.mobile,
      status: "new",
      payload: {
        order_reference: orderReference,
        product_slug: product.slug,
        amount: product.offerPrice,
        currency: product.currency,
        access_token_hash: tokenHash,
      },
    })
    .select("id")
    .single();
  if (paymentError) {
    await client.from("form_submissions").delete().eq("id", agreement.id);
    return NextResponse.json(
      { error: "Could not create payment record" },
      { status: 500 },
    );
  }

  await writeAuditEvent(request, null, {
    action: "checkout_agreement_accepted",
    entityType: "form_submissions",
    entityId: agreement.id,
    metadata: { product_slug: product.slug, order_reference: orderReference },
  });
  return NextResponse.json(
    {
      agreement_id: agreement.id,
      order_id: agreement.id,
      payment_id: payment.id,
      order_reference: orderReference,
      access_token: accessToken,
      amount: product.offerPrice,
      currency: product.currency,
    },
    { status: 201 },
  );
}
