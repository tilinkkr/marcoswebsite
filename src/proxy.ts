import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { prefersMarkdown } from "@/lib/markdown-negotiation";

const MARKDOWN_BYPASS_PREFIXES = [
  "/api/",
  "/admin",
  "/.well-known/",
  "/llms.txt",
  "/llms-full.txt",
  "/robots.txt",
  "/sitemap.xml",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Markdown for Agents content negotiation (Cloudflare standard):
  // If an AI agent requests any public page with Accept: text/markdown,
  // transparently serve clean Markdown with x-markdown-tokens & Content-Signal.
  if (
    request.method === "GET" &&
    !MARKDOWN_BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/api/markdown";
    rewriteUrl.searchParams.set("path", pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-markdown-path", pathname);
    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  let response = NextResponse.next({ request });

  // Ensure CDN caches separate HTML and Markdown variants safely.
  if (!pathname.startsWith("/api/") && !pathname.startsWith("/admin")) {
    response.headers.append("Vary", "Accept");
    return response;
  }

  // Only refresh Supabase auth session cookies on admin paths so public
  // pages avoid an extra auth round-trip on every request.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};
