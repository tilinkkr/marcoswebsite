import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!secret || !supplied || secret.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(supplied));
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = createSupabaseAdminClient();
  if (!client)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const now = new Date().toISOString();
  const { error } = await client.from("system_heartbeats").upsert({
    id: "vercel-six-day-heartbeat",
    last_run_at: now,
    source: "vercel-cron",
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? null,
  });
  if (error)
    return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 });

  await client
    .from("rate_limit_buckets")
    .delete()
    .lt(
      "window_started_at",
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    );
  return NextResponse.json({ ok: true, checked_at: now });
}
