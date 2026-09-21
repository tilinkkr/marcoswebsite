import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeAuditEvent } from "@/lib/audit";
import { getAdmin } from "@/lib/auth/admin";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  blogDatabaseValues,
  blogInputSchema,
  blogPatchSchema,
  editorialMaterialFields,
} from "@/lib/validation/blog";

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
  const { data: existing, error: existingError } = await client
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (existingError || !existing)
    return NextResponse.json({ error: "Article not found" }, { status: 404 });

  const changedMaterial = editorialMaterialFields.some((field) => {
    if (parsed.data[field] === undefined) return false;
    return (
      JSON.stringify(parsed.data[field]) !== JSON.stringify(existing[field])
    );
  });
  const nextStatus = parsed.data.status ?? existing.status;
  if (
    nextStatus === "published" &&
    changedMaterial &&
    parsed.data.editorial_verified !== true
  ) {
    return NextResponse.json(
      {
        error:
          "A human editor must re-attest after changing article evidence or content.",
      },
      { status: 400 },
    );
  }

  const merged = blogInputSchema.safeParse({
    ...existing,
    ...parsed.data,
    status: nextStatus,
    editorial_verified:
      nextStatus === "published"
        ? (parsed.data.editorial_verified ?? existing.editorial_verified)
        : false,
  });
  if (!merged.success) {
    return NextResponse.json(
      {
        error: "The article does not satisfy the publication evidence gate.",
        issues: merged.error.flatten(),
      },
      { status: 400 },
    );
  }

  const normalized = blogDatabaseValues(merged.data);
  const now = new Date().toISOString();
  const update = {
    ...parsed.data,
    author_proof_url: normalized.author_proof_url,
    reviewer_proof_url: normalized.reviewer_proof_url,
    canonical_url: normalized.canonical_url,
    og_image: normalized.og_image,
    editorial_verified: normalized.editorial_verified,
    published_at:
      nextStatus === "published" ? (existing.published_at ?? now) : null,
    last_reviewed_at:
      nextStatus === "published" &&
      (existing.status !== "published" || changedMaterial)
        ? now
        : existing.last_reviewed_at,
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
      {
        error:
          error.code === "23514"
            ? "The article does not satisfy the publication evidence gate."
            : "Could not update article",
      },
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
