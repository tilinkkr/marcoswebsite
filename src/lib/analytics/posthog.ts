"use client";

import posthog from "posthog-js";

let initialized = false;

export function initializePostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (initialized || !key || !host) return posthog;

  posthog.init(key, { api_host: host, capture_pageview: false });
  initialized = true;
  return posthog;
}
