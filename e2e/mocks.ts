import type { Page } from "@playwright/test";

// Playwright runs against the built app pointed at the placeholder Supabase
// URL (no real project is linked in this scaffold). These helpers intercept
// the REST calls so e2e specs exercise real UI/network wiring without a
// live backend.

export async function mockSupabaseRest(page: Page) {
  await page.route("**/rest/v1/products*", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "11111111-1111-1111-1111-111111111111",
            catalog_section: "hybrid",
            crop_type: "Tomato",
            name: "F1-KING",
            slug: "tomato-f1-king",
            hero_image_url: null,
            region_tags: ["South"],
            active: true,
            sort_order: 0,
            deleted_at: null,
          },
        ]),
      });
      return;
    }
    await route.continue();
  });

  await page.route("**/rest/v1/product_attributes*", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/testimonials*", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/site_copy*", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/knowledge_articles*", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/client_events*", async (route) => {
    await route.fulfill({ status: 201, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/enquiries*", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 201, contentType: "application/json", body: "[]" });
      return;
    }
    await route.continue();
  });

  await page.route("**/auth/v1/user*", async (route) => {
    await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({}) });
  });
}
