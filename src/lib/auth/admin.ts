import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MarcosAdmin = {
  userId: string;
  email: string;
  displayName: string;
};

function allowedAdminEmails() {
  const emails = (process.env.MARCOS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return new Set(emails).size === 3 ? emails : [];
}

export async function getAdminForUser(
  user: User,
): Promise<MarcosAdmin | null> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return null;

  let { data } = await adminClient
    .from("admin_users")
    .select("user_id,email,display_name,active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  const email = user.email?.toLowerCase();
  if (!data && email && allowedAdminEmails().includes(email)) {
    const result = await adminClient
      .from("admin_users")
      .insert({
        user_id: user.id,
        email,
        display_name: String(
          user.user_metadata?.display_name ?? email.split("@")[0],
        ).slice(0, 120),
      })
      .select("user_id,email,display_name,active")
      .single();
    data = result.data;
  }

  if (!data || data.email !== email) return null;
  return {
    userId: data.user_id as string,
    email: data.email as string,
    displayName: data.display_name as string,
  };
}

export async function getAdmin(): Promise<MarcosAdmin | null> {
  const sessionClient = await createSupabaseServerClient();
  if (!sessionClient) return null;

  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) return null;

  return getAdminForUser(user);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
