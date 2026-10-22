/**
 * Playwright runs the end-to-end tests in test/e2e/; `pnpm test:smoke` selects the @smoke subset.
 * Environment (a missing value fails the test that needs it, never skips it):
 *   PRODUCTION_ALIAS    hostname under test, no scheme
 *   AUTH_GOOGLE_ID      expected Google OAuth client id
 *   SMOKE_STORAGE_STATE exported storageState JSON of the test account (Better Auth session cookie only)
 *   SMOKE_USER_EMAIL    email get-session must return
 *   SMOKE_TEAM_ID       id of the read-only test team
 * Report path comes from PLAYWRIGHT_JSON_OUTPUT_NAME.
 */
import { defineConfig, devices } from "@playwright/test";

const sessionCookie = /better-auth\.session_token$/;

// An unset or unparsable value yields an empty state, so the session test fails on its own.
function sessionState() {
  try {
    const { cookies } = JSON.parse(process.env.SMOKE_STORAGE_STATE ?? "");
    return {
      cookies: cookies
        .filter((c: { name: string }) => sessionCookie.test(c.name))
        // expires -1 is a session cookie: no expiry is injected
        .map((c: object) => ({ ...c, expires: -1 })),
      origins: [],
    };
  } catch {
    return { cookies: [], origins: [] };
  }
}

export default defineConfig({
  testDir: "test/e2e",
  testMatch: "*.e2e.ts",
  retries: 1,
  reporter: [["list"], ["json"]],
  use: {
    baseURL: `https://${process.env.PRODUCTION_ALIAS}`,
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "oauth",
      testMatch: "oauth.e2e.ts",
      use: { storageState: { cookies: [], origins: [] } },
    },
    {
      name: "chromium",
      testMatch: "session.e2e.ts",
      use: { ...devices["Desktop Chrome"], storageState: sessionState() },
    },
    {
      name: "webkit",
      testMatch: "session.e2e.ts",
      use: { ...devices["Desktop Safari"], storageState: sessionState() },
    },
  ],
});
