import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminForUser } from "@/lib/auth/admin";
import { guardPublicMutation } from "@/lib/security/route-guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  username: z.enum(["admin1", "admin2", "admin3"]),
  password: z.string().min(6).max(128),
});

function loginEmail(username: "admin1" | "admin2" | "admin3") {
  const domain = process.env.MARCOS_ADMIN_LOGIN_DOMAIN ?? "admin.markos.in";
  return `${username}@${domain}`;
}

export async function POST(request: NextRequest) {
  const blocked = await guardPublicMutation(request, {
    key: "admin-login",
    maxBytes: 2_048,
    requests: 5,
  });
  if (blocked) return blocked;

  const body = credentialsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!body.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const client = await createSupabaseServerClient();
  if (!client) {
    return NextResponse.json(
      { error: "Authentication is unavailable" },
      { status: 503 },
    );
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: loginEmail(body.data.username),
    password: body.data.password,
  });
  if (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Authorize the identity returned by Supabase directly. Reading the session
  // again in the same request races the Set-Cookie response and rejects a
  // valid first login even though authentication succeeded.
  const admin = data.user ? await getAdminForUser(data.user) : null;
  if (!admin) {
    await client.auth.signOut();
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
