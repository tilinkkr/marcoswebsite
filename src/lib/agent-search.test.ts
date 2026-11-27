import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

import {
  estimateMarkdownTokens,
  prefersMarkdown,
  renderPageAsMarkdown,
  searchMarcosForAgents,
} from "./agent-search";

describe("agent-search & Markdown for Agents", () => {
  it("detects Accept: text/markdown without hijacking normal browser requests", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/markdown, text/html;q=0.8")).toBe(true);
    expect(
      prefersMarkdown(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ),
    ).toBe(false);
    expect(prefersMarkdown("text/html;q=1.0, text/markdown;q=0.5")).toBe(false);
    expect(prefersMarkdown(null)).toBe(false);
  });

  it("estimates markdown token count conservatively", () => {
    expect(estimateMarkdownTokens("MARKOS")).toBeGreaterThan(0);
    expect(estimateMarkdownTokens("a".repeat(400))).toBe(100);
  });

  it("returns relevant Markdown passages for funded-account and Kerala/GCC queries", async () => {
    const res = await searchMarcosForAgents("FundingPips payout rules India", 5);
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.markdown).toContain("content_signal: ai-train=yes, search=yes, ai-input=yes");
    expect(res.markdown).toContain("https://markos.in/.well-known/search");
    expect(res.markdown).toContain("© 2026 MARKOS. All rights reserved.");
  });

  it("renders clean Markdown for public routes and blog articles", async () => {
    const home = await renderPageAsMarkdown("/");
    expect(home.status).toBe(200);
    expect(home.markdown).toContain("brand: MARKOS");
    expect(home.markdown).toContain("agent:endpoint: https://markos.in/.well-known/search?q={query}");

    const article = await renderPageAsMarkdown(
      "/insights/pass-funded-account-in-3-days-3-trades-8-accounts-strategy-2026",
    );
    expect(article.status).toBe(200);
    expect(article.markdown).toContain("Rahul Raja");
  });
});
