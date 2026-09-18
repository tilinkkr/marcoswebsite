import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/security/redis";
import {
  getClientIp,
  hasAcceptableBodySize,
  isSameOrigin,
} from "@/lib/security/request";

export async function guardPublicMutation(
  request: NextRequest,
  options: { key: string; maxBytes: number; requests: number },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  }
  if (!hasAcceptableBodySize(request, options.maxBytes)) {
    return NextResponse.json(
      { error: "Request is too large" },
      { status: 413 },
    );
  }

  const rate = await checkRateLimit(
    `${options.key}:${getClientIp(request)}`,
    options.requests,
    "10 m",
  );
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: rate.reset
          ? {
              "Retry-After": String(
                Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)),
              ),
            }
          : undefined,
      },
    );
  }
  return null;
}
