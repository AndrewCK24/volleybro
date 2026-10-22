import assert from "node:assert/strict";
import test from "node:test";

import {
  isWorkerSegfault,
  LANE_COMMANDS,
  LANE_NAMES,
  laneStages,
  planLanes,
  withSegfaultRerun,
} from "../verify.js";

test("full run requested runs every lane", () => {
  const plan = planLanes(["src/foo.ts"], { all: true, full: true });
  for (const lane of Object.keys(plan)) {
    assert.equal(plan[lane].run, true);
    assert.equal(plan[lane].reason, "full run requested");
  }
});

test("unresolved merge-base runs every lane", () => {
  const plan = planLanes(null, { all: true });
  for (const lane of Object.keys(plan)) {
    assert.equal(plan[lane].run, true);
    assert.equal(plan[lane].reason, "no integration merge-base");
  }
});

test("root config change runs every lane and names the path", () => {
  const plan = planLanes(["src/foo.ts", "package.json"], { all: true });
  for (const lane of Object.keys(plan)) {
    assert.equal(plan[lane].run, true);
    assert.equal(plan[lane].reason, "package.json changed");
  }
});

test("blueprint-only diff runs only static and blueprint", () => {
  const plan = planLanes(["blueprint/content/x.mdx"], { all: true });
  assert.equal(plan.static.run, true);
  assert.equal(plan.blueprint.run, true);
  assert.equal(plan.blueprint.reason, "blueprint/content/x.mdx changed");
  assert.equal(plan["app-test"].run, false);
  assert.equal(plan["app-build"].run, false);
});

test("app-only diff runs static, app-test and app-build, not blueprint", () => {
  const plan = planLanes(["src/components/foo.tsx"], { all: true });
  assert.equal(plan.static.run, true);
  assert.equal(plan["app-test"].run, true);
  assert.equal(plan["app-test"].reason, "src/components/foo.tsx changed");
  assert.equal(plan.integration.run, false);
  assert.equal(plan.workflow.run, false);
  assert.equal(plan["app-build"].run, true);
  assert.equal(plan.blueprint.run, false);
});

test("docs-only diff runs only static", () => {
  const plan = planLanes(["docs/testing-strategy.md"], { all: true });
  assert.equal(plan.static.run, true);
  assert.equal(plan["app-test"].run, false);
  assert.equal(plan["app-build"].run, false);
  assert.equal(plan.blueprint.run, false);
});

test("a markdown file inside src counts as docs", () => {
  const plan = planLanes(["src/components/README.md"], { all: true });
  assert.equal(plan.static.run, true);
  assert.equal(plan["app-test"].run, false);
  assert.equal(plan["app-build"].run, false);
  assert.equal(plan.blueprint.run, false);
});

test("default (non --all) mode ignores scoping", () => {
  const plan = planLanes(["docs/testing-strategy.md"], { all: false });
  assert.equal(plan.static.run, true);
  assert.equal(plan["app-test"].run, true);
  assert.equal(plan["app-build"].run, false);
  assert.equal(plan.blueprint.run, false);
});

test("root config patterns widen to every lane", () => {
  for (const changed of [
    "tsconfig.json",
    "eslint.config.mjs",
    "jest.config.ts",
  ]) {
    const plan = planLanes(["docs/a.md", changed], { all: true });
    for (const lane of LANE_NAMES) assert.equal(plan[lane].run, true, changed);
  }
  assert.equal(
    planLanes(["src/tsconfig.json"], { all: true }).blueprint.run,
    false,
  );
});

test("Blueprint and app-test run alone after the parallel lanes", () => {
  const full = planLanes(["package.json"], { all: true });
  assert.deepEqual(laneStages(full), [
    ["static", "workflow", "integration", "app-build"],
    ["blueprint"],
    ["app-test"],
  ]);

  const byDefault = planLanes([]);
  assert.deepEqual(laneStages(byDefault), [["static"], ["app-test"]]);

  const docsOnly = planLanes(["blueprint/x.mdx"], { all: true });
  assert.deepEqual(laneStages(docsOnly), [["static"], ["blueprint"]]);
});

test("a decision record change runs Blueprint verification, not application or integration builds", () => {
  const plan = planLanes(
    ["blueprint/content/decisions/0092-ci-runs-everything.json"],
    { all: true },
  );
  assert.equal(plan.integration.run, false);
  assert.equal(plan["app-build"].run, false);
  assert.equal(plan["app-test"].run, false);
  assert.equal(plan.workflow.run, false);
  assert.equal(plan.blueprint.run, true);
  assert.equal(
    LANE_COMMANDS.blueprint.some((command) => command.includes("build")),
    true,
  );
});

test("a backend source change plans the integration tests", () => {
  for (const changed of [
    "src/infrastructure/db/repositories/game.repository.mongo.ts",
    "src/app/api/games/route.ts",
    "src/lib/api/wrappers.ts",
  ]) {
    const plan = planLanes([changed], { all: true });
    assert.equal(plan.integration.run, true, changed);
    assert.equal(plan.integration.reason, `${changed} changed`);
  }
});

test("an integration test change plans the integration tests, not the app lanes", () => {
  const plan = planLanes(["test/integration/api/game-rally.itest.ts"], {
    all: true,
  });
  assert.equal(plan.integration.run, true);
  assert.equal(plan["app-test"].run, false);
  assert.equal(plan["app-build"].run, false);
});

test("workflow tooling plans the workflow tests, and only the app's own scripts plan the app lanes", () => {
  for (const changed of [
    "scripts/check-workflow.js",
    ".github/workflows/ci.yml",
  ]) {
    const plan = planLanes([changed], { all: true });
    assert.equal(plan.workflow.run, true, changed);
    assert.equal(plan["app-build"].run, false, changed);
    assert.equal(plan.integration.run, false, changed);
  }
  const icons = planLanes(["scripts/generate-icons.js"], { all: true });
  assert.equal(icons["app-build"].run, true);
  assert.equal(icons.workflow.run, false);
});

test("pnpm verify runs static analysis and unit tests, and static no longer runs the workflow tests", () => {
  const plan = planLanes([]);
  assert.deepEqual(laneStages(plan), [["static"], ["app-test"]]);
  assert.equal(
    LANE_COMMANDS.static.some((command) => command.includes("test:workflow")),
    false,
  );
});

test("only a Jest lane whose worker died with SIGSEGV counts as a worker crash", () => {
  const crash =
    "A jest worker process (pid=4242) was terminated by another process: signal=SIGSEGV";
  assert.equal(isWorkerSegfault("app-test", crash), true);
  assert.equal(isWorkerSegfault("blueprint", crash), true);
  assert.equal(isWorkerSegfault("static", crash), false);
  assert.equal(isWorkerSegfault("app-test", "Expected 2, received 3"), false);
});

function attempts(...results) {
  let calls = 0;
  const runOnce = async () => results[calls++];
  return { runOnce, calls: () => calls };
}

test("a Jest lane that died with a worker SIGSEGV reruns exactly once", async () => {
  const crash = {
    ok: false,
    output: "terminated by another process: signal=SIGSEGV",
  };
  const passing = attempts(crash, { ok: true, output: "" });
  const result = await withSegfaultRerun("app-test", passing.runOnce);
  assert.deepEqual(result, {
    attempt: { ok: true, output: "" },
    retried: true,
  });
  assert.equal(passing.calls(), 2);

  const crashesTwice = attempts(crash, crash);
  const failed = await withSegfaultRerun("app-test", crashesTwice.runOnce);
  assert.equal(failed.attempt.ok, false);
  assert.equal(crashesTwice.calls(), 2);
});

test("an ordinary failure or a pass does not rerun the lane", async () => {
  for (const first of [
    { ok: false, output: "Expected 2, received 3" },
    { ok: true, output: "signal=SIGSEGV" },
  ]) {
    const run = attempts(first);
    const result = await withSegfaultRerun("app-test", run.runOnce);
    assert.equal(result.retried, false);
    assert.equal(run.calls(), 1);
  }
});
