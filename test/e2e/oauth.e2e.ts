import { expect, test } from "@playwright/test";
import { required } from "./env";

test("@smoke oauth configuration", async ({ request }) => {
  const alias = required("PRODUCTION_ALIAS");
  const clientId = required("AUTH_GOOGLE_ID");

  const response = await request.post("/api/auth/sign-in/social", {
    data: { provider: "google", callbackURL: "/", disableRedirect: true },
  });
  expect(response.ok()).toBe(true);
  const url = new URL((await response.json()).url);

  expect(url.host).toBe("accounts.google.com");
  expect(url.searchParams.get("client_id")).toBe(clientId);
  expect(url.searchParams.get("redirect_uri")).toBe(
    `https://${alias}/api/auth/callback/google`,
  );
});
