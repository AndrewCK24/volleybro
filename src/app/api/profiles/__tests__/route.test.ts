import {
  routeRequest,
  silenceConsoleError,
} from "@test/support/http/route-request";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockUpdateProfileController =
  jest.fn<(input: unknown) => Promise<unknown>>();
const mockGetSession = jest.fn<() => Promise<unknown>>();

jest.mock("@/interface/controllers/user/profile.controller", () => ({
  updateProfileController: mockUpdateProfileController,
  getProfileController: jest.fn(),
  createProfileController: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}));

const SESSION = { user: { id: "user-1" } };
const TEAM_ID = "665f1c2b9d3e4a0012345678";

type RouteResponse = { status: number; json: () => Promise<unknown> };

let PATCH: (req: never) => Promise<RouteResponse>;

describe("PATCH /api/profiles", () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue(SESSION);
    ({ PATCH } = await import("../route"));
  });

  it.each([
    ["an undeclared field", { isAdmin: true }],
    ["the removed activeTeamId", { activeTeamId: TEAM_ID }],
  ])("returns 400 for a body with %s", async (_, payload) => {
    const consoleSpy = silenceConsoleError();
    const req = routeRequest("http://localhost/api/profiles", "PATCH", payload);

    const res = await PATCH(req as never);
    const body = (await res.json()) as { code: string };

    expect(res.status).toBe(400);
    expect(body.code).toBe("VALIDATION");
    expect(mockUpdateProfileController).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
