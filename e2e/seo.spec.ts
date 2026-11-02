import { expect, test } from "@playwright/test";

test("crawl controls use the production origin", async ({ page }) => {
  await page.goto("/sitemap.xml");
  const sitemap = await page.locator("body").innerText();
  expect(sitemap).toContain("https://markos.in/");
  expect(sitemap).not.toContain("marcos.example");
  expect(sitemap).toContain("https://markos.in/insights");
  expect(sitemap).toContain("https://markos.in/funded-account-guide");

  await page.goto("/robots.txt");
  const robots = await page.locator("body").innerText();
  expect(robots).toContain("Sitemap: https://markos.in/sitemap.xml");
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Disallow: /api/");
});

test("funded-account guide answers high-intent questions and tracks WhatsApp CTA", async ({
  page,
}) => {
  await page.goto("/funded-account-guide");
  await expect(
    page.getByRole("heading", { name: /funded accounts.*read the rules/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /why can a prop-firm payout request be rejected or delayed/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /can i pass a funded-account challenge in 3 days/i,
    }),
  ).toBeVisible();
  const primaryWhatsApp = page.getByRole("link", {
    name: /ask about markos education/i,
  });
  await expect(primaryWhatsApp).toHaveAttribute("href", /wa\.me/);
  await primaryWhatsApp.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: /message markos on whatsapp/i }),
  ).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toBe("https://markos.in/funded-account-guide");
});

test("insights hub surfaces the funded-account guide and is responsive", async ({
  page,
}) => {
  await page.goto("/insights");
  await expect(
    page.getByRole("heading", { name: /study the rules first/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /read the funded-account guide/i }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toBe("https://markos.in/insights");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.join(" ")).toContain("CollectionPage");
});

test("funded-account guide exposes canonical URL and article schema", async ({
  page,
}) => {
  await page.goto("/funded-account-guide");
  await expect(
    page.getByRole("heading", { name: /funded accounts.*read the rules/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /ask about markos education/i }),
  ).toBeVisible();
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toBe("https://markos.in/funded-account-guide");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.join(" ")).toContain('"Article"');
});
