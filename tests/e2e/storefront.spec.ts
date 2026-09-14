import { expect, test, type Page } from "@playwright/test";

/**
 * Tier A, the part that needs no account.
 *
 * Every test gets a fresh context, so nothing carries a cart or a session over
 * from the last one — a stored `crimson-cart-v2` would make these assertions
 * describe the previous test instead of this one.
 */

const CART_KEY = "crimson-cart-v2";

async function cartLines(page: Page) {
  return page.evaluate(
    (key) => JSON.parse(window.localStorage.getItem(key) ?? "[]"),
    CART_KEY,
  );
}

test.describe("storefront", () => {
  test("the public pages answer", async ({ page }) => {
    for (const path of ["/", "/food", "/store", "/cart", "/about", "/contact"]) {
      const res = await page.goto(path);
      expect(res?.status(), `${path} should render`).toBe(200);
    }
  });

  test("checkout sends a signed-out visitor to sign in, and back again", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login\?next=%2Fcheckout$/);
    await expect(page.getByLabel("Email address")).toBeVisible();
  });

  test("a menu item can be added to the cart at the menu's price", async ({ page }) => {
    await page.goto("/food/deli-sandwich");

    const price = await page.locator(".cd-product__price").first().innerText();
    expect(price).toMatch(/^\$\d+\.\d{2}$/);

    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();

    const lines = await cartLines(page);
    expect(lines).toHaveLength(1);
    expect(lines[0].slug).toBe("deli-sandwich");
    expect(`$${(lines[0].priceCents / 100).toFixed(2)}`).toBe(price);

    await page.goto("/cart");
    const row = page.locator(".cd-bag__line").first();
    await expect(row).toContainText("Deli Sandwich");
    await expect(row).toContainText(price);
  });

  test("water ice will not go in the cart without a flavor", async ({ page }) => {
    await page.goto("/food/water-ice");

    // The picker exists at all — this is the thing the store asked for.
    const flavors = page.getByRole("group", { name: "Water ice flavor" });
    await expect(flavors).toBeVisible();

    await page.getByRole("button", { name: "Add to cart" }).click();
    // Scoped to the warning itself: Next's route announcer is also role=alert.
    const warning = page
      .getByRole("alert")
      .filter({ hasText: "before adding this to your cart" });
    await expect(warning).toBeVisible();
    expect(await cartLines(page)).toHaveLength(0);

    await flavors.getByRole("checkbox", { name: "Cherry" }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();

    const lines = await cartLines(page);
    expect(lines).toHaveLength(1);
    // The flavor has to reach the line, or the kitchen never learns of it.
    expect(lines[0].name).toContain("Cherry");
  });

  test("the cart survives a reload and can be emptied", async ({ page }) => {
    await page.goto("/food/kaiser");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();

    await page.goto("/cart");
    await page.reload();
    await expect(page.locator(".cd-bag__line")).toHaveCount(1);

    await page.getByRole("button", { name: "Clear cart" }).click();
    await expect(page.getByText("Nothing in here yet")).toBeVisible();
    expect(await cartLines(page)).toHaveLength(0);
  });

  test("everyday essentials hand off to DoorDash rather than to a cart", async ({ page }) => {
    await page.goto("/store/drinks");

    const card = page.locator(".cd-store-card").first();
    await expect(card).toBeVisible();

    // The link is read, never followed: a test must not walk into a real
    // DoorDash order.
    const href = await card.getByRole("link").first().getAttribute("href");
    expect(href).toContain("doordash.com");

    await expect(page.getByRole("button", { name: /add to cart/i })).toHaveCount(0);
  });
});
