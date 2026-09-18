import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function hashIp(ip: string) {
  const salt = process.env.AUDIT_IP_HASH_SALT;
  if (!salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const forwardedHost =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (forwardedHost && originUrl.host === forwardedHost) return true;

    const allowed = [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null,
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
    ].filter(Boolean) as string[];

    return allowed.some((value) => new URL(value).origin === originUrl.origin);
  } catch {
    return false;
  }
}

export function hasAcceptableBodySize(request: NextRequest, maxBytes: number) {
  const raw = request.headers.get("content-length");
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}

export function getSafeUserAgent(request: NextRequest) {
  return request.headers.get("user-agent")?.slice(0, 500) ?? null;
}
