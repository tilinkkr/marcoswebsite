import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { writeAuditEvent } from "@/lib/audit";
import { getAdmin } from "@/lib/auth/admin";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { blogInputSchema } from "@/lib/validation/blog";

export async function POST(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocked = await guardPublicMutation(request, {
    key: `admin-blog-${admin.userId}`,
    maxBytes: 120_000,
    requests: 20,
  });
  if (blocked) return blocked;
  const parsed = blogInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid article", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const now = new Date().toISOString();
  const { data, error } = await client
    .from("blog_posts")
    .insert({
      ...parsed.data,
      canonical_url: parsed.data.canonical_url || null,
      og_image: parsed.data.og_image || null,
      published_at: parsed.data.status === "published" ? now : null,
      last_reviewed_at: parsed.data.status === "published" ? now : null,
      created_by: admin.userId,
      updated_by: admin.userId,
    })
    .select("id,slug")
    .single();
  if (error)
    return NextResponse.json(
      {
        error:
          error.code === "23505"
            ? "Slug already exists"
            : "Could not create article",
      },
      { status: 400 },
    );

  await writeAuditEvent(request, admin, {
    action: "blog_created",
    entityType: "blog_posts",
    entityId: data.id,
    metadata: { slug: data.slug, status: parsed.data.status },
  });
  revalidatePath("/insights");
  revalidatePath(`/insights/${data.slug}`);
  return NextResponse.json({ created: true, id: data.id }, { status: 201 });
}
