import { test, expect } from "@playwright/test";
import { mockSupabaseRest } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockSupabaseRest(page);
});

test("unauthenticated visitors are redirected from /admin to the login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: /anz admin/i })).toBeVisible();
});

test("login page shows a clear error on invalid credentials, never a public signup link", async ({ page }) => {
  await page.route("**/auth/v1/token*", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" }),
    });
  });

  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill("nobody@anzacs.in");
  await page.getByLabel(/password/i).fill("wrong-password");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("link", { name: /sign up/i })).toHaveCount(0);
});
