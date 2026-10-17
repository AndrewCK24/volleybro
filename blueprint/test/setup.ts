import {
  clearImmediate as nodeClearImmediate,
  setImmediate as nodeSetImmediate,
} from "node:timers";
import "@testing-library/jest-dom";
import { releaseGates } from "../../test/support/gates";
import { server } from "../../test/support/msw/server";

globalThis.setImmediate ??= nodeSetImmediate as typeof setImmediate;
globalThis.clearImmediate ??= nodeClearImmediate;

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => {
  releaseGates();
  server.resetHandlers();
});
afterAll(() => server.close());
