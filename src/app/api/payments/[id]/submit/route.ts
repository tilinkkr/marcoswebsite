import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { isAllowedReceipt } from "@/lib/security/uploads";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentSubmissionSchema } from "@/lib/validation/submissions";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  const blocked = await guardPublicMutation(request, {
    key: "payment",
    maxBytes: 2_900_000,
    requests: 6,
  });
  if (blocked) return blocked;

  const parsed = paymentSubmissionSchema.safeParse(
    await request.json().catch(() => null),
  );
  const accessToken = request.headers.get("x-order-token");
  if (!parsed.success || !accessToken) {
    return NextResponse.json(
      { error: "Invalid payment submission" },
      { status: 400 },
    );
  }

  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  const { id } = await params;
  const { data: payment } = await client
    .from("form_submissions")
    .select("id,payload,status")
    .eq("id", id)
    .eq("form_type", "payment")
    .maybeSingle();
  if (!payment || payment.status !== "new") {
    return NextResponse.json(
      { error: "Payment record not found" },
      { status: 404 },
    );
  }

  const expected = String(
    (payment.payload as Record<string, unknown>).access_token_hash ?? "",
  );
  const actual = createHash("sha256").update(accessToken).digest("hex");
  if (
    expected.length !== actual.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))
  ) {
    return NextResponse.json({ error: "Invalid order token" }, { status: 403 });
  }

  let attachmentPath: string | null = null;
  if (parsed.data.screenshot_base64 && parsed.data.screenshot_content_type) {
    const bytes = Buffer.from(parsed.data.screenshot_base64, "base64");
    if (
      bytes.byteLength > 2_097_152 ||
      !isAllowedReceipt(bytes, parsed.data.screenshot_content_type)
    ) {
      return NextResponse.json(
        { error: "Unsupported payment receipt" },
        { status: 415 },
      );
    }
    const extension =
      parsed.data.screenshot_content_type === "image/png"
        ? "png"
        : parsed.data.screenshot_content_type === "image/webp"
          ? "webp"
          : "jpg";
    attachmentPath = `${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
    const { error } = await client.storage
      .from("payment-receipts")
      .upload(attachmentPath, bytes, {
        contentType: parsed.data.screenshot_content_type,
        upsert: false,
      });
    if (error)
      return NextResponse.json(
        { error: "Could not store receipt" },
        { status: 500 },
      );
  }

  const originalPayload = payment.payload as Record<string, unknown>;
  const safePayload = { ...originalPayload };
  delete safePayload.access_token_hash;
  const { error } = await client
    .from("form_submissions")
    .update({
      status: "reviewing",
      attachment_path: attachmentPath,
      payload: {
        ...safePayload,
        reference_number: parsed.data.reference_number,
        submitted_at: new Date().toISOString(),
      },
    })
    .eq("id", id);
  if (error) {
    if (attachmentPath)
      await client.storage.from("payment-receipts").remove([attachmentPath]);
    return NextResponse.json(
      { error: "Could not submit payment" },
      { status: 500 },
    );
  }

  await writeAuditEvent(request, null, {
    action: "payment_reference_submitted",
    entityType: "form_submissions",
    entityId: id,
    metadata: { has_receipt: Boolean(attachmentPath) },
  });
  return NextResponse.json({ accepted: true });
}
