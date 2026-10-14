import {
  allDecisionsFrom,
  decisionsByIdFrom,
  decisionsForFrom,
} from "./decision-lookup";
import type { DecisionRecord } from "./decision-record";

function record(id: string, capabilities: string[]): DecisionRecord {
  return {
    schemaVersion: 2,
    id,
    title: `Title ${id}`,
    capabilities,
    decision: `Decision ${id}`,
  };
}

describe("decision lookup", () => {
  const records = [
    record("0010", ["team-management/roles"]),
    record("0002", ["team-management/roles/detail"]),
    record("0001", ["team-management/roles", "game-recording/statistics"]),
  ];

  it("returns every record sorted by decision number without reordering its source", () => {
    expect(allDecisionsFrom(records).map(({ id }) => id)).toEqual([
      "0001",
      "0002",
      "0010",
    ]);
    expect(records.map(({ id }) => id)).toEqual(["0010", "0002", "0001"]);
  });

  it("matches capabilities exactly and sorts matching decisions", () => {
    expect(
      decisionsForFrom(records, "team-management/roles").map(({ id }) => id),
    ).toEqual(["0001", "0010"]);
    expect(
      decisionsForFrom(records, "team-management/roles/detail").map(
        ({ id }) => id,
      ),
    ).toEqual(["0002"]);
    expect(decisionsForFrom(records, "missing")).toEqual([]);
  });

  it("returns requested ids in order and skips unknown ids", () => {
    expect(
      decisionsByIdFrom(records, ["0010", "0099", "0001"]).map(({ id }) => id),
    ).toEqual(["0010", "0001"]);
  });
});
