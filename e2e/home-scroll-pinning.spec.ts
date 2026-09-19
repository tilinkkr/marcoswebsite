import { expect, test } from "@playwright/test";

test("home story stages stay pinned and visible through their scroll range", async ({
  page,
}) => {
  test.setTimeout(90_000);
  test.skip(
    (page.viewportSize()?.width ?? 0) < 768,
    "Desktop story uses sticky stages",
  );
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () => document.documentElement.dataset.lenisActive === "true",
  );

  const sectionIds = [
    "capital-motion",
    "daily-screen-share",
    "modern-trader",
    "join-preview",
    "indicators-preview",
  ];

  for (const sectionId of sectionIds) {
    for (const progress of [0.1, 0.5, 0.9]) {
      const position = await page
        .getByTestId(sectionId)
        .evaluate((section, amount) => {
          const rect = section.getBoundingClientRect();
          return (
            window.scrollY + rect.top + (rect.height - innerHeight) * amount
          );
        }, progress);

      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: "instant" }),
        position,
      );
      await page.waitForFunction(
        (expected) => Math.abs(window.scrollY - expected) < 3,
        position,
      );

      const stage = page.getByTestId(sectionId).locator('[class*="stage"]');
      const top = await stage.evaluate(
        (element) => element.getBoundingClientRect().top,
      );
      expect(
        Math.abs(top),
        `${sectionId} should remain pinned at ${progress * 100}% scroll`,
      ).toBeLessThan(8);
    }
  }
});

test("daily story entry and reveal remain readable", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1883, height: 750 });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForFunction(
    () => document.documentElement.dataset.lenisActive === "true",
  );

  for (const progress of [0, 0.5, 0.95]) {
    const position = await page
      .getByTestId("daily-screen-share")
      .evaluate((section, amount) => {
        const rect = section.getBoundingClientRect();
        return window.scrollY + rect.top + (rect.height - innerHeight) * amount;
      }, progress);
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      position,
    );
    await page.waitForFunction(
      (top) => Math.abs(window.scrollY - top) < 3,
      position,
    );
    const section = page.getByTestId("daily-screen-share");
    if (progress === 0) {
      const firstWordOpacity = await section
        .locator("[data-share-word]")
        .first()
        .evaluate((element) => Number(getComputedStyle(element).opacity));
      expect(
        firstWordOpacity,
        "headline should be visible when the stage enters",
      ).toBeGreaterThan(0.3);
    } else if (progress === 0.95) {
      for (const selector of [
        "[data-share-word]",
        "[data-share-body]",
        "[data-share-status]",
        "[data-share-cta]",
      ]) {
        const opacity = await section
          .locator(selector)
          .last()
          .evaluate((element) => Number(getComputedStyle(element).opacity));
        expect(
          opacity,
          `${selector} should finish revealing before release`,
        ).toBeGreaterThan(0.8);
      }
    }
  }
});

test("reduced motion keeps home story content readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "load" });

  for (const [sectionId, selector] of [
    ["vision-reveal", "[data-vision-body]"],
    ["capital-motion", "[data-capital-body]"],
    ["daily-screen-share", "[data-share-body]"],
    ["modern-trader", "[data-trader-body]"],
    ["join-preview", "[data-join-content]"],
    ["indicators-preview", "[data-indicator-card]"],
  ] as const) {
    const element = page.getByTestId(sectionId).locator(selector);
    const opacity = await element.evaluate((node) =>
      Number(getComputedStyle(node).opacity),
    );
    expect(
      opacity,
      `${sectionId} should not hide content with reduced motion`,
    ).toBeGreaterThan(0.8);
  }
});
