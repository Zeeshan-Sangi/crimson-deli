import { defineConfig, devices } from "@playwright/test";

/**
 * Tier A end-to-end run: the storefront path a customer actually walks, from
 * the menu to a placed pickup order.
 *
 * The suite starts its own dev server on port 3100 and builds into `.next-e2e`.
 * That is deliberate: a second Next server sharing `.next` with the one you are
 * working in corrupts its module cache, which costs more time than the tests
 * save. Point E2E_BASE_URL at a deployment to run against that instead.
 */
const PORT = 3100;
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Every test opens a fresh context, so no cart or session leaks between
    // them — a stored `crimson-cart-v2` would make the cart assertions lie.
    storageState: undefined,
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Started and owned by the run, never reused: a server left listening by the
  // previous run answers the readiness check while it is still shutting down,
  // and then dies in the middle of a test. Already have one running? Point
  // E2E_BASE_URL at it and the suite manages nothing.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `NEXT_DIST_DIR=.next-e2e npm run dev -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: false,
        timeout: 180_000,
        stdout: "ignore",
        stderr: "pipe",
      },
});
