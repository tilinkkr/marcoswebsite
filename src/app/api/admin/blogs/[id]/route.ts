import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { getAdmin } from "@/lib/auth/admin";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { blogPatchSchema } from "@/lib/validation/blog";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocked = await guardPublicMutation(request, {
    key: `admin-blog-${admin.userId}`,
    maxBytes: 120_000,
    requests: 30,
  });
  if (blocked) return blocked;
  const parsed = blogPatchSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid article update" },
      { status: 400 },
    );
  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { id } = await params;
  const { data: existing } = await client
    .from("blog_posts")
    .select("slug,status,published_at")
    .eq("id", id)
    .maybeSingle();
  if (!existing)
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  const nextStatus = parsed.data.status ?? existing.status;
  const update = {
    ...parsed.data,
    canonical_url:
      parsed.data.canonical_url === "" ? null : parsed.data.canonical_url,
    og_image: parsed.data.og_image === "" ? null : parsed.data.og_image,
    published_at:
      nextStatus === "published"
        ? (existing.published_at ?? new Date().toISOString())
        : null,
    last_reviewed_at:
      nextStatus === "published" ? new Date().toISOString() : undefined,
    updated_by: admin.userId,
  };
  const { data, error } = await client
    .from("blog_posts")
    .update(update)
    .eq("id", id)
    .select("slug")
    .single();
  if (error)
    return NextResponse.json(
      { error: "Could not update article" },
      { status: 400 },
    );

  await writeAuditEvent(request, admin, {
    action: "blog_updated",
    entityType: "blog_posts",
    entityId: id,
    changedFields: Object.keys(parsed.data),
    metadata: { slug: data.slug, status: nextStatus },
  });
  revalidatePath("/insights");
  revalidatePath(`/insights/${existing.slug}`);
  revalidatePath(`/insights/${data.slug}`);
  return NextResponse.json({ updated: true });
}
