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
  if ((page.viewportSize()?.width ?? 0) >= 768) {
    await expect(
      page.getByRole("heading", { name: /most traders see the chart/i }),
    ).toBeVisible();
  }
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
    const pinSpacer = element.querySelector(
      ".pin-spacer",
    ) as HTMLElement | null;
    const scrollRange = pinSpacer
      ? pinSpacer.getBoundingClientRect().height - innerHeight
      : element.getBoundingClientRect().height - innerHeight;
    window.scrollTo({
      top:
        window.scrollY +
        element.getBoundingClientRect().top +
        scrollRange * 0.9,
      behavior: "instant",
    });
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

  if ((page.viewportSize()?.width ?? 0) >= 768) {
    await page.getByTestId("daily-screen-share").evaluate((section) => {
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      window.scrollTo({
        top: top + (rect.height - innerHeight) * 0.85,
        behavior: "instant",
      });
    });
  } else {
    await page.getByTestId("daily-screen-share").scrollIntoViewIfNeeded();
  }
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

  await page.locator("#modern-trader-title").scrollIntoViewIfNeeded();
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
    window.scrollTo(
      0,
      element.offsetTop + element.offsetHeight - innerHeight * 1.03,
    );
  });
  await expect(
    page.getByRole("link", { name: /join the community/i }),
  ).toBeVisible({ timeout: 10_000 });
  await page.getByTestId("indicators-preview").evaluate((section) => {
    const element = section as HTMLElement;
    window.scrollTo(
      0,
      element.offsetTop + element.offsetHeight - innerHeight * 1.03,
    );
  });
  await expect(
    page.getByRole("link", { name: /explore indicator/i }),
  ).toBeVisible({ timeout: 10_000 });
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

test("desktop scroll story advances before the page bottom", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForFunction(
    () => document.documentElement.dataset.lenisActive === "true",
  );

  const sampleAt = async (testId: string, progress: number) => {
    const target = await page
      .getByTestId(testId)
      .evaluate((section, requestedProgress) => {
        const element = section as HTMLElement;
        const absoluteTop =
          window.scrollY + element.getBoundingClientRect().top;
        const travel = Math.max(
          1,
          element.getBoundingClientRect().height - innerHeight,
        );
        const nextScrollY = absoluteTop + travel * requestedProgress;
        window.scrollTo({ top: nextScrollY, behavior: "instant" });
        return nextScrollY;
      }, progress);

    await page.waitForFunction(
      (expectedScrollY) => Math.abs(window.scrollY - expectedScrollY) < 3,
      target,
    );
  };

  await sampleAt("capital-motion", 0.28);
  await page.waitForTimeout(350);
  const earlyCapitalOpacity = await page
    .locator('[data-capital-note="mid-01"]')
    .evaluate((element) => Number(getComputedStyle(element).opacity));
  expect(earlyCapitalOpacity).toBeGreaterThan(0.1);

  await sampleAt("capital-motion", 0.86);
  await page.waitForTimeout(350);
  await expect(page.getByText(/funding isn't the finish line/i)).toBeVisible();

  await sampleAt("daily-screen-share", 0.72);
  await page.waitForTimeout(350);
  const bodyOpacity = await page
    .getByTestId("daily-screen-share")
    .locator("[data-share-body]")
    .evaluate((element) => Number(getComputedStyle(element).opacity));
  expect(bodyOpacity).toBeGreaterThan(0.1);

  expect(
    await page.evaluate(
      () =>
        window.scrollY < document.documentElement.scrollHeight - innerHeight,
    ),
  ).toBe(true);
});

test("membership, indicator and checkout routes are responsive", async ({
  page,
}) => {
  await page.goto("/join");
  await expect(
    page.getByRole("heading", { name: /build your process/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /continue to membership/i }),
  ).toBeVisible();
  await page.goto("/indicators");
  await expect(page.getByRole("heading", { name: /see more/i })).toBeVisible();
  await expect(page.getByText("$50", { exact: true })).toBeVisible();
  await page.goto("/join/checkout");
  await expect(
    page.getByRole("heading", { name: /who is accepting/i }),
  ).toBeVisible();
  await expect(page.getByText("$100", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await expect(page.getByAltText(/payment qr/i)).toHaveCount(0);
});

test("admin boundary and Supabase-backed insights shell are responsive", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: /admin access/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);

  await page.goto("/insights");
  await expect(
    page.getByRole("heading", { name: /study the rules first/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /prop firm rules/i }),
  ).toBeVisible();
});
