import { fireEvent, render, screen } from "@testing-library/react";

import { blockSchema } from "../lib/emdash-change-record";
import { installStepWalkthroughController } from "../lib/step-walkthrough-controller";

const state = (headline: string) => ({ headline, lines: [] });
const walkthrough = {
  _type: "step_walkthrough",
  _version: 1,
  title: "Conflict walkthrough",
  flow: [
    { id: "compose", label: "Compose", kind: "terminal" },
    { id: "check", label: "Check", kind: "decision" },
    {
      id: "conflict",
      label: "Conflict",
      kind: "decision",
      branch: { under: "check", note: "stale" },
    },
  ],
  actors: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  systemLabel: "server",
  scenarios: [
    {
      id: "happy",
      label: "Happy",
      intro: "Both in sync.",
      steps: [
        {
          title: "Compose",
          node: "compose",
          actors: { a: state("1"), b: state("1") },
          system: "idle",
        },
        {
          title: "Check",
          node: "check",
          actors: { a: state("2"), b: state("1") },
          system: "ok",
        },
      ],
    },
  ],
};

function Harness() {
  const step = (
    scenario: string,
    index: number,
    node: string,
    title: string,
  ) => (
    <div
      key={`${scenario}-${index}`}
      data-step={index}
      data-node={node}
      hidden={index !== 0}
    >
      <p data-step-title>{title}</p>
    </div>
  );
  const panel = (id: string, titles: [string, string][], hidden: boolean) => (
    <div data-scenario-panel={id} hidden={hidden}>
      {titles.map(([node, title], index) => step(id, index, node, title))}
      <button type="button" data-step-nav="previous" disabled>
        previous {id}
      </button>
      {titles.map((_, index) => (
        <button
          key={index}
          type="button"
          data-step-target={index}
          aria-label={`${id} step ${index + 1}`}
        />
      ))}
      <button type="button" data-step-nav="next">
        next {id}
      </button>
    </div>
  );
  return (
    <section data-step-walkthrough>
      <p data-step-status data-testid="status" />
      <span data-flow-node="compose" data-testid="compose" />
      <span data-flow-node="check" data-testid="check" />
      <span data-flow-node="conflict" data-testid="conflict" />
      <button type="button" data-scenario="happy" aria-pressed="true">
        Happy
      </button>
      <button type="button" data-scenario="race" aria-pressed="false">
        Race
      </button>
      {panel(
        "happy",
        [
          ["compose", "Happy compose"],
          ["check", "Happy check"],
        ],
        false,
      )}
      {panel(
        "race",
        [
          ["check", "Race check"],
          ["conflict", "Race conflict"],
        ],
        true,
      )}
    </section>
  );
}

const title = (text: string) =>
  screen.getByText(text, { selector: "[data-step-title]" });

describe("step walkthrough", () => {
  it("steps through a scenario and highlights each step's flow node", () => {
    render(<Harness />);
    installStepWalkthroughController(document);

    expect(title("Happy compose")).toBeVisible();
    expect(screen.getByTestId("compose")).toHaveAttribute(
      "data-active",
      "true",
    );

    fireEvent.click(screen.getByText("next happy"));
    expect(title("Happy check")).toBeVisible();
    expect(title("Happy compose")).not.toBeVisible();
    expect(screen.getByTestId("check")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("compose")).not.toHaveAttribute("data-active");
    expect(screen.getByText("next happy")).toBeDisabled();
    expect(screen.getByLabelText("happy step 2")).toHaveAttribute(
      "aria-current",
      "step",
    );

    expect(screen.getByTestId("status")).toHaveTextContent("Happy check");

    fireEvent.click(screen.getByLabelText("happy step 1"));
    expect(title("Happy compose")).toBeVisible();
    expect(screen.getByText("previous happy")).toBeDisabled();
  });

  it("switches scenario from its first step", () => {
    render(<Harness />);
    installStepWalkthroughController(document);
    fireEvent.click(screen.getByText("next happy"));

    fireEvent.click(screen.getByRole("button", { name: "Race" }));

    expect(screen.getByRole("button", { name: "Race" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Happy" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(title("Happy check")).not.toBeVisible();
    expect(title("Race check")).toBeVisible();
    expect(screen.getByTestId("check")).toHaveAttribute("data-active", "true");
    fireEvent.click(screen.getByText("next race"));
    expect(title("Race conflict")).toBeVisible();
    expect(screen.getByTestId("status")).toHaveTextContent("Race conflict");
    expect(screen.getByTestId("conflict")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("accepts a complete walkthrough", () => {
    expect(blockSchema.safeParse(walkthrough).success).toBe(true);
  });

  const messages = (value: unknown) => {
    const result = blockSchema.safeParse(value);
    return result.success
      ? []
      : result.error.issues.map(({ message }) => message);
  };

  it.each([
    [
      "a step names an unknown flow node",
      { node: "missing" },
      "Step node must name a flow node.",
    ],
    [
      "a step omits an actor's state",
      { actors: { a: state("1") } },
      "Every step must give each actor's state exactly once.",
    ],
  ])("rejects a walkthrough where %s", (_, change, message) => {
    const [first, second] = walkthrough.scenarios[0].steps;
    const invalid = {
      ...walkthrough,
      scenarios: [
        {
          ...walkthrough.scenarios[0],
          steps: [{ ...first, ...change }, second],
        },
      ],
    };
    expect(messages(invalid)).toContain(message);
  });

  it("rejects a branch hanging under another branch", () => {
    const invalid = {
      ...walkthrough,
      flow: [
        ...walkthrough.flow,
        {
          id: "deeper",
          label: "Deeper",
          kind: "process",
          branch: { under: "conflict", note: "" },
        },
      ],
    };
    expect(messages(invalid)).toContain(
      "A branch must sit under a main-row flow node.",
    );
  });
});
