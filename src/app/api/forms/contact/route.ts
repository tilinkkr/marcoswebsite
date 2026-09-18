import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { contactSubmissionSchema } from "@/lib/validation/submissions";

export async function POST(request: NextRequest) {
  const blocked = await guardPublicMutation(request, {
    key: "contact",
    maxBytes: 12_000,
    requests: 5,
  });
  if (blocked) return blocked;

  const parsed = contactSubmissionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact form" },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ accepted: true }, { status: 202 });
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await client
    .from("form_submissions")
    .insert({
      form_type: "contact",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      payload: {
        topic: parsed.data.topic,
        message: parsed.data.message,
      },
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Could not save message" },
      { status: 500 },
    );
  }
  await writeAuditEvent(request, null, {
    action: "contact_received",
    entityType: "form_submissions",
    entityId: data.id,
    metadata: { form_type: "contact" },
  });
  return NextResponse.json({ accepted: true }, { status: 201 });
}
