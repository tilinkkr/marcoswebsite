import { NextResponse, type NextRequest } from "next/server";

import {
  AGENT_CONTENT_SIGNAL,
  estimateMarkdownTokens,
  searchMarcosForAgents,
} from "@/lib/agent-search";

export const dynamic = "force-dynamic";

function buildMarkdownResponse(markdown: string, status = 200) {
  return new NextResponse(markdown, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Signal": AGENT_CONTENT_SIGNAL,
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : 6;
  const { markdown } = await searchMarcosForAgents(q, limit);
  return buildMarkdownResponse(markdown);
}

export async function POST(request: NextRequest) {
  let query = "";
  let limit = 6;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = (await request.json()) as {
        q?: unknown;
        query?: unknown;
        limit?: unknown;
      };
      if (typeof json.q === "string") query = json.q;
      else if (typeof json.query === "string") query = json.query;
      if (typeof json.limit === "number") limit = json.limit;
    } else {
      query = (await request.text()).trim();
    }
  } catch {
    query = request.nextUrl.searchParams.get("q") ?? "";
  }

  const { markdown } = await searchMarcosForAgents(query, limit);
  return buildMarkdownResponse(markdown);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, HEAD, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
