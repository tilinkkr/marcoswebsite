import { expect, test } from "@playwright/test";

test("crawl controls use the production origin", async ({ page }) => {
  await page.goto("/sitemap.xml");
  const sitemap = await page.locator("body").innerText();
  expect(sitemap).toContain("https://markos.in/");
  expect(sitemap).not.toContain("marcos.example");
  expect(sitemap).toContain("https://markos.in/insights");

  await page.goto("/robots.txt");
  const robots = await page.locator("body").innerText();
  expect(robots).toContain("Sitemap: https://markos.in/sitemap.xml");
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Disallow: /api/");
});

test("insights hub is responsive and exposes the editorial roadmap", async ({
  page,
}) => {
  await page.goto("/insights");
  await expect(
    page.getByRole("heading", { name: /study the rules first/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /the knowledge base we're building/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("IMAGE PLACEHOLDER")).toHaveCount(10);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBe("https://markos.in/insights");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.join(" ")).toContain("CollectionPage");
});

test("published article exposes author, dates and article schema", async ({
  page,
}) => {
  await page.goto("/insights/prop-firm-rules-india-2026");
  await expect(page.getByRole("article")).toBeVisible();
  await expect(page.getByText("METHOD", { exact: true })).toBeVisible();
  await expect(page.getByText("LIMITATION", { exact: true })).toBeVisible();
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.join(" ")).toContain("BlogPosting");
  expect(schemas.join(" ")).toContain("BreadcrumbList");
});
