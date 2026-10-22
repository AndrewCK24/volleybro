import { expect, test } from "@playwright/test";
import { required } from "./env";

// A failed session check skips the team test.
test.describe.configure({ mode: "serial" });

test("@smoke session is valid", async ({ request }) => {
  const email = required("SMOKE_USER_EMAIL");

  const response = await request.get("/api/auth/get-session");
  expect(response.ok()).toBe(true);
  expect((await response.json())?.user?.email).toBe(email);
});

test("@smoke test team read-only page", async ({ page }) => {
  const teamId = required("SMOKE_TEAM_ID");

  await page.goto(`/team/${teamId}`);
  await expect(page.locator("p.text-primary-foreground")).not.toHaveText(
    /^(Loading\.\.\.)?$/,
  );
  await expect(
    page
      .locator(`a[href^="/team/${teamId}/players/"]:not([href$="/new"])`)
      .first(),
  ).toBeVisible();
});
