import { test, expect } from "@playwright/test";
import { mockSupabaseRest } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockSupabaseRest(page);
});

test("home page renders the hero and stat strip", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /talk to an expert/i })).toBeVisible();
});

test("products page lists seeded products and supports search filtering", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByText("F1-KING")).toBeVisible();

  await page.getByLabel(/search products/i).fill("no-match-xyz");
  await expect(page.getByText(/no products match your filters/i)).toBeVisible();
});

test("enquiry modal opens from the nav CTA, validates consent, and submits", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /find the right seed/i }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/^name$/i).fill("Test Farmer");
  await dialog.getByLabel(/mobile number/i).fill("9999999999");
  await dialog.getByRole("button", { name: /submit enquiry/i }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();

  await dialog.getByLabel(/agree to be contacted/i).check();
  await dialog.getByRole("button", { name: /submit enquiry/i }).click();
  await expect(dialog.getByText(/thank you/i)).toBeVisible();
});

test("knowledge page shows an empty state when no articles are published", async ({ page }) => {
  await page.goto("/knowledge");
  await expect(page.getByText(/no articles published yet/i)).toBeVisible();
});

test("contact page shows the ANZ-to-provide placeholder instead of fake contact details", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText(/anz to provide/i)).toBeVisible();
});
