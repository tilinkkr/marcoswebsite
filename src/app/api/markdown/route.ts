import { NextResponse, type NextRequest } from "next/server";

import {
  AGENT_CONTENT_SIGNAL,
  estimateMarkdownTokens,
  renderPageAsMarkdown,
} from "@/lib/agent-search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const path =
    request.headers.get("x-markdown-path") ??
    request.nextUrl.searchParams.get("path") ??
    "/";
  const { status, markdown } = await renderPageAsMarkdown(path);

  return new NextResponse(markdown, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Content-Signal": AGENT_CONTENT_SIGNAL,
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
