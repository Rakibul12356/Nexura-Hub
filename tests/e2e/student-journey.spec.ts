import { test, expect } from "@playwright/test";

test.describe("Student Learning & Enrollment Journey", () => {
  test("loads homepage and displays platform title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Nexura/i);
  });

  test("navigates to courses page and checks course listings", async ({ page }) => {
    await page.goto("/courses");
    await expect(page.locator("h1")).toContainText(/Courses/i);
  });
});
