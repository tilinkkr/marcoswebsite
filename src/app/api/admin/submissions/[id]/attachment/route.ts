import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  const { id } = await params;
  const { data } = await client
    .from("form_submissions")
    .select("form_type,attachment_path")
    .eq("id", id)
    .maybeSingle();
  if (!data?.attachment_path)
    return NextResponse.json(
      { error: "Attachment not found" },
      { status: 404 },
    );
  const bucket =
    data.form_type === "team_application" ? "team-resumes" : "payment-receipts";
  const { data: signed, error } = await client.storage
    .from(bucket)
    .createSignedUrl(data.attachment_path, 60);
  if (error)
    return NextResponse.json(
      { error: "Attachment unavailable" },
      { status: 500 },
    );
  return NextResponse.redirect(signed.signedUrl, 307);
}
