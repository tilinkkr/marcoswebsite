import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function createRateLimiter(
  requests = 60,
  window: `${number} ${"s" | "m" | "h"}` = "1 m",
) {
  const redis = createRedisClient();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "marcos:ratelimit",
  });
}

export async function checkRateLimit(
  identifier: string,
  requests: number,
  window: `${number} ${"s" | "m" | "h"}`,
) {
  const limiter = createRateLimiter(requests, window);
  if (limiter) return limiter.limit(identifier);

  const client = createSupabaseAdminClient();
  if (client) {
    const [amount, unit] = window.split(" ");
    const multiplier = unit === "h" ? 3600 : unit === "m" ? 60 : 1;
    const windowSeconds = Number(amount) * multiplier;
    const { data, error } = await client.rpc("consume_rate_limit", {
      p_key: identifier,
      p_limit: requests,
      p_window_seconds: windowSeconds,
    });
    const result = Array.isArray(data) ? data[0] : data;
    if (!error && result) {
      return {
        success: Boolean(result.allowed),
        reset: new Date(String(result.reset_at)).getTime(),
      };
    }

    console.error("Supabase rate-limit fallback failed", {
      code: error?.code ?? "missing_result",
      message: error?.message ?? "No result returned by consume_rate_limit",
    });
  }

  return { success: process.env.NODE_ENV !== "production", reset: null };
}
