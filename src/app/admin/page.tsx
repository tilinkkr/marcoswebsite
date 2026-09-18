import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { AdminConsole } from "./AdminConsole";

export const metadata: Metadata = {
  title: "Operations Desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  noStore();
  const admin = await requireAdmin();
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase is not configured");

  const [submissions, blogs, audit, admins, heartbeat] = await Promise.all([
    client
      .from("form_submissions")
      .select(
        "id,form_type,status,name,email,phone,payload,attachment_path,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("blog_posts")
      .select("id,slug,title,status,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100),
    client
      .from("audit_events")
      .select(
        "id,action,entity_type,entity_id,changed_fields,metadata,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("admin_users")
      .select("user_id", { count: "exact", head: true })
      .eq("active", true),
    client
      .from("system_heartbeats")
      .select("last_run_at")
      .eq("id", "vercel-six-day-heartbeat")
      .maybeSingle(),
  ]);

  return (
    <AdminConsole
      adminName={admin.displayName}
      adminCount={admins.count ?? 0}
      submissions={(submissions.data ?? []) as never}
      blogs={(blogs.data ?? []) as never}
      audit={(audit.data ?? []) as never}
      heartbeat={(heartbeat.data?.last_run_at as string | undefined) ?? null}
    />
  );
}
