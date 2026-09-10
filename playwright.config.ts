import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3177",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3177",
    url: "http://127.0.0.1:3177",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop-1440",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "desktop-1280",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "tablet-1024",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "tablet-768",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile-430",
      use: { ...devices["Pixel 5"], viewport: { width: 430, height: 932 } },
    },
    {
      name: "mobile-412-android",
      use: { ...devices["Pixel 5"], viewport: { width: 412, height: 915 } },
    },
    {
      name: "mobile-393-ios",
      use: {
        ...devices["iPhone 14 Pro"],
        browserName: "chromium",
        viewport: { width: 393, height: 873 },
      },
    },
    {
      name: "mobile-390",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "mobile-375-ios",
      use: {
        ...devices["iPhone 13 Mini"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "mobile-360",
      use: { ...devices["Pixel 5"], viewport: { width: 360, height: 800 } },
    },
  ],
});
