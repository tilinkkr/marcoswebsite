import "server-only";

import type { NextRequest } from "next/server";

import type { MarcosAdmin } from "@/lib/auth/admin";
import { getClientIp, getSafeUserAgent, hashIp } from "@/lib/security/request";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function writeAuditEvent(
  request: NextRequest,
  admin: MarcosAdmin | null,
  event: {
    action: string;
    entityType: string;
    entityId?: string;
    changedFields?: string[];
    metadata?: Record<string, unknown>;
  },
) {
  const client = createSupabaseAdminClient();
  if (!client) return;

  await client.from("audit_events").insert({
    actor_id: admin?.userId ?? null,
    action: event.action,
    entity_type: event.entityType,
    entity_id: event.entityId ?? null,
    changed_fields: event.changedFields ?? [],
    metadata: event.metadata ?? {},
    ip_hash: hashIp(getClientIp(request)),
    user_agent: getSafeUserAgent(request),
  });
}
