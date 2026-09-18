import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { getAdmin } from "@/lib/auth/admin";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { submissionStatusSchema } from "@/lib/validation/submissions";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocked = await guardPublicMutation(request, {
    key: `admin-submission-${admin.userId}`,
    maxBytes: 2_000,
    requests: 30,
  });
  if (blocked) return blocked;

  const parsed = submissionStatusSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  const { id } = await params;
  const { error } = await client
    .from("form_submissions")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });

  await writeAuditEvent(request, admin, {
    action: "submission_status_changed",
    entityType: "form_submissions",
    entityId: id,
    changedFields: ["status"],
    metadata: { status: parsed.data.status },
  });
  return NextResponse.json({ updated: true });
}
