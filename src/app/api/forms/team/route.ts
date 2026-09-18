import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { isAllowedResume } from "@/lib/security/uploads";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { teamApplicationSchema } from "@/lib/validation/submissions";

export async function POST(request: NextRequest) {
  const blocked = await guardPublicMutation(request, {
    key: "team",
    maxBytes: 5_500_000,
    requests: 3,
  });
  if (blocked) return blocked;

  const form = await request.formData().catch(() => null);
  if (!form)
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });

  const parsed = teamApplicationSchema.safeParse({
    full_name: form.get("full_name"),
    email: form.get("email"),
    mobile: form.get("mobile"),
    location: form.get("location"),
    area: form.get("area"),
    why_marcos: form.get("why_marcos"),
    contribution: form.get("contribution"),
    portfolio_url: form.get("portfolio_url"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid application" }, { status: 400 });
  }

  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const resume = form.get("resume");
  let attachmentPath: string | null = null;
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > 5_242_880) {
      return NextResponse.json(
        { error: "Resume exceeds 5 MB" },
        { status: 413 },
      );
    }
    const bytes = new Uint8Array(await resume.arrayBuffer());
    if (!isAllowedResume(bytes, resume.type)) {
      return NextResponse.json(
        { error: "Unsupported resume file" },
        { status: 415 },
      );
    }
    const extension =
      resume.type === "application/pdf"
        ? "pdf"
        : resume.type === "application/msword"
          ? "doc"
          : "docx";
    attachmentPath = `${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
    const { error } = await client.storage
      .from("team-resumes")
      .upload(attachmentPath, bytes, {
        contentType: resume.type,
        upsert: false,
      });
    if (error)
      return NextResponse.json(
        { error: "Could not store resume" },
        { status: 500 },
      );
  }

  const { data, error } = await client
    .from("form_submissions")
    .insert({
      form_type: "team_application",
      name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.mobile,
      attachment_path: attachmentPath,
      payload: {
        location: parsed.data.location,
        area: parsed.data.area,
        why_marcos: parsed.data.why_marcos,
        contribution: parsed.data.contribution,
        portfolio_url: parsed.data.portfolio_url || null,
      },
    })
    .select("id")
    .single();

  if (error) {
    if (attachmentPath)
      await client.storage.from("team-resumes").remove([attachmentPath]);
    return NextResponse.json(
      { error: "Could not save application" },
      { status: 500 },
    );
  }
  await writeAuditEvent(request, null, {
    action: "team_application_received",
    entityType: "form_submissions",
    entityId: data.id,
    metadata: {
      form_type: "team_application",
      has_attachment: Boolean(attachmentPath),
    },
  });
  return NextResponse.json({ accepted: true }, { status: 201 });
}
