import { expect, test, type Page } from "@playwright/test";

/**
 * Tier A, the part that needs a customer account: menu → cart → checkout →
 * order token, and the price-integrity check that goes with it.
 *
 * These place real orders in the store's Firestore, so they are opt-in. Set
 * E2E_EMAIL and E2E_PASSWORD for an existing customer account, and
 * E2E_PLACE_ORDER=1 to let the suite actually submit one.
 */

const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";
const MAY_PLACE_ORDER = process.env.E2E_PLACE_ORDER === "1";
const CART_KEY = "crimson-cart-v2";

test.skip(
  !EMAIL || !PASSWORD,
  "Set E2E_EMAIL and E2E_PASSWORD to a customer account to run the ordering path.",
);

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

async function addSandwich(page: Page) {
  await page.goto("/food/deli-sandwich");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("Added to your cart.")).toBeVisible();
}

test("a signed-in customer reaches checkout with their cart", async ({ page }) => {
  await signIn(page);
  await addSandwich(page);

  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("button", { name: "Place pickup order" })).toBeVisible();
  await expect(page.getByText("Deli Sandwich")).toBeVisible();
});

test("a placed order comes back on its tracking page", async ({ page }) => {
  test.skip(!MAY_PLACE_ORDER, "Set E2E_PLACE_ORDER=1 to submit a real order.");

  await signIn(page);
  await addSandwich(page);
  await page.goto("/checkout");

  await page.locator("#co-name").fill("Playwright Tier A");
  await page.locator("#co-phone").fill("2155550123");
  await page.locator("#co-notes").fill("Automated test order — please cancel.");
  await page.getByRole("button", { name: "Place pickup order" }).click();

  await expect(page.getByText("Order placed")).toBeVisible();
  const reference = await page.locator("strong", { hasText: /^CD-\d+$/ }).first().innerText();

  await page.getByRole("link", { name: /track/i }).first().click();
  await expect(page).toHaveURL(/\/order\/[a-f0-9]{24}$/);
  await expect(page.getByText(reference)).toBeVisible();
  await expect(page.getByText("Deli Sandwich")).toBeVisible();
});

test("a tampered cart price does not decide what the order costs", async ({ page }) => {
  test.skip(!MAY_PLACE_ORDER, "Set E2E_PLACE_ORDER=1 to submit a real order.");

  await signIn(page);
  await addSandwich(page);

  // The cart lives in localStorage, so the customer owns it. Rewrite a line to
  // one cent: the server has to price the order from the menu regardless.
  await page.goto("/cart");
  await page.evaluate((key) => {
    const lines = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    for (const line of lines) line.priceCents = 1;
    window.localStorage.setItem(key, JSON.stringify(lines));
  }, CART_KEY);

  await page.goto("/checkout");
  await page.locator("#co-name").fill("Playwright Tier A");
  await page.locator("#co-phone").fill("2155550123");
  await page.locator("#co-notes").fill("Automated price-integrity test — please cancel.");
  await page.getByRole("button", { name: "Place pickup order" }).click();

  await expect(page.getByText("Order placed")).toBeVisible();
  await page.getByRole("link", { name: /track/i }).first().click();

  // $0.01 would mean the client's number was trusted.
  await expect(page.getByText("$0.01")).toHaveCount(0);
  await expect(page.locator("body")).toContainText(/\$\d+\.\d{2}/);
});
