import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test("connected MARCOS story renders without overflow", async ({ page }) => {
  const browserIssues: string[] = [];
  const externalRequests: string[] = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserIssues.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => browserIssues.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      externalRequests.push(url.href);
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await expect(page.getByTestId("vision-reveal")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /most traders see the chart/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /see the market differently/i }),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.waitForFunction(
    () => document.documentElement.scrollHeight > window.innerHeight * 2.5,
  );
  await page.getByTestId("vision-reveal").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(0, element.offsetTop + element.offsetHeight - innerHeight);
  });
  await expect(page.getByText("Trading alone leaves you")).toBeVisible({
    timeout: 10_000,
  });

  await page.getByTestId("capital-motion").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(
      0,
      element.offsetTop + element.offsetHeight - innerHeight * 1.06,
    );
  });
  await expect(
    page.getByRole("heading", { name: /capital is easy to chase/i }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/funding isn't the finish line/i)).toBeVisible();

  await page.getByTestId("daily-screen-share").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("daily-screen-share")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /we share our tradovate screen live on kick/i,
    }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByText(/shared live on kick every weekday/i),
  ).toBeVisible({
    timeout: 10_000,
  });
  await page.getByTestId("capital-motion").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(
      0,
      element.offsetTop + element.offsetHeight - innerHeight * 1.06,
    );
  });
  await expect(page.getByText(/funding isn't the finish line/i)).toBeVisible();

  await page
    .getByRole("heading", { name: /the tools change/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: /the tools change/i }),
  ).toBeVisible();
  await page
    .getByRole("heading", { name: /stop trading in isolation/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.locator("#membership").getByText("$100", { exact: true }),
  ).toBeVisible();
  await page.getByTestId("join-preview").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(0, element.offsetTop + element.offsetHeight - innerHeight * 1.03);
  });
  await expect(page.getByRole("link", { name: /join the community/i })).toBeVisible({ timeout: 10_000 });
  await page.getByTestId("indicators-preview").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(0, element.offsetTop + element.offsetHeight - innerHeight * 1.03);
  });
  await expect(page.getByRole("link", { name: /explore indicator/i })).toBeVisible({ timeout: 10_000 });
  await page.locator("#final-conversion-title").scrollIntoViewIfNeeded();
  await expect(
    page
      .getByTestId("final-conversion")
      .getByRole("link", { name: /join marcos — \$100/i }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByText(/process over promises/i)).toBeVisible();

  const imagesLoaded = await page
    .locator("img:visible")
    .evaluateAll((images) =>
      images.every(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0,
      ),
    );
  expect(imagesLoaded).toBe(true);
  expect(browserIssues).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("membership, indicator and checkout routes are responsive", async ({ page }) => {
  await page.goto("/join");
  await expect(page.getByRole("heading", { name: /build your process/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /continue to membership/i })).toBeVisible();
  await page.goto("/indicators");
  await expect(page.getByRole("heading", { name: /see more/i })).toBeVisible();
  await expect(page.getByText("$50", { exact: true })).toBeVisible();
  await page.goto("/join/checkout");
  await expect(page.getByRole("heading", { name: /who is accepting/i })).toBeVisible();
  await expect(page.getByText("$100", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await expect(page.getByAltText(/payment qr/i)).toHaveCount(0);
});
