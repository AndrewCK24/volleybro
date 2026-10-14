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

  it("returns 400 for a body with an undeclared field", async () => {
    const consoleSpy = silenceConsoleError();
    const req = routeRequest("http://localhost/api/profiles", "PATCH", {
      isAdmin: true,
    });

    const res = await PATCH(req as never);
    const body = (await res.json()) as { code: string };

    expect(res.status).toBe(400);
    expect(body.code).toBe("VALIDATION");
    expect(mockUpdateProfileController).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // Clients from before the device-local active team still send this body.
  it("returns 200 and drops an activeTeamId an older client still sends", async () => {
    const profile = { userId: "user-1" };
    mockUpdateProfileController.mockResolvedValue(profile);
    const req = routeRequest("http://localhost/api/profiles", "PATCH", {
      activeTeamId: TEAM_ID,
    });

    const res = await PATCH(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(profile);
    expect(mockUpdateProfileController).toHaveBeenCalledWith({
      userId: SESSION.user.id,
      updates: {},
    });
  });
});
