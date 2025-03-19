import { getPreviousRally } from "@/lib/features/record/helpers";
import {
  type Record,
  type Rally,
  type Substitution,
  type Timeout,
  EntryType,
  Side,
  MoveType,
} from "@/entities/record";
import { Position } from "@/entities/team";

describe("getPreviousRally", () => {
  // Create basic test Record object
  const mockRally1: Rally = {
    win: true,
    home: { score: 1, type: MoveType.ATTACK, num: 1 },
    away: { score: 0, type: MoveType.DEFENSE, num: 1 },
  };

  const mockRally2: Rally = {
    win: false,
    home: { score: 1, type: MoveType.SERVING, num: 2 },
    away: { score: 1, type: MoveType.RECEPTION, num: 2 },
  };

  const mockSubstitution: Substitution = {
    team: Side.HOME,
    players: { in: "player2", out: "player1" },
  };

  const mockTimeout: Timeout = {
    team: Side.AWAY,
  };

  const mockRecord: Record = {
    _id: "test-record",
    win: false,
    team_id: "test-team",
    info: { scoring: { setCount: 5, decidingSetPoints: 15 } },
    teams: {
      home: {
        _id: "home-team",
        name: "Home Team",
        players: [],
        staffs: [],
        stats: [],
      },
      away: {
        _id: "away-team",
        name: "Away Team",
        players: [],
        staffs: [],
        stats: [],
      },
    },
    sets: [
      {
        win: false,
        lineups: {
          home: {
            options: {
              liberoReplaceMode: 0,
              liberoReplacePosition: Position.NONE,
            },
            starting: [],
            liberos: [],
            substitutes: [],
          },
        },
        options: {
          serve: "home",
          time: { start: "", end: "" },
        },
        entries: [
          { type: EntryType.RALLY, data: mockRally1 },
          { type: EntryType.SUBSTITUTION, data: mockSubstitution },
          { type: EntryType.TIMEOUT, data: mockTimeout },
          { type: EntryType.RALLY, data: mockRally2 },
        ],
      },
    ],
  };

  // Create test data with multiple sets
  const multiSetRecord: Record = {
    ...mockRecord,
    sets: [
      mockRecord.sets[0],
      {
        ...mockRecord.sets[0],
        entries: [
          {
            type: EntryType.RALLY,
            data: { ...mockRally1, home: { ...mockRally1.home, score: 5 } },
          },
        ],
      },
    ],
  };

  beforeEach(() => jest.clearAllMocks());

  test("should return null when entryIndex <= 0", () => {
    const result = getPreviousRally(mockRecord, 0, 0);
    expect(result).toBeNull();

    const resultNegative = getPreviousRally(mockRecord, 0, -1);
    expect(resultNegative).toBeNull();
  });

  test("should return null when there's no RALLY entry before the specified entryIndex", () => {
    // Create test data with only substitution and timeout
    const noRallyRecord: Record = {
      ...mockRecord,
      sets: [
        {
          ...mockRecord.sets[0],
          entries: [
            { type: EntryType.SUBSTITUTION, data: mockSubstitution },
            { type: EntryType.TIMEOUT, data: mockTimeout },
          ],
        },
      ],
    };

    const result = getPreviousRally(noRallyRecord, 0, 2);
    expect(result).toBeNull();
  });

  test("should return the most recent RALLY before the specified entryIndex", () => {
    // Before index 3, the most recent RALLY is mockRally1 at index 0
    const result = getPreviousRally(mockRecord, 0, 3);
    expect(result).toEqual(mockRally1);
  });

  test("should return the previous RALLY when there are multiple non-RALLY entries", () => {
    // Before index 3, there are two non-RALLY entries, then one RALLY
    const result = getPreviousRally(mockRecord, 0, 4);
    expect(result).toEqual(mockRally2);
  });

  test("should return null when there's no RALLY before index 0 in second set", () => {
    // No RALLY before index 0 in the second set
    const resultSet1 = getPreviousRally(multiSetRecord, 1, 0);
    expect(resultSet1).toBeNull();
  });

  test("should find previous RALLY in the same set only", () => {
    // There's a RALLY before index 1 in the second set
    const rallyInSet2 = {
      ...mockRally1,
      home: { ...mockRally1.home, score: 5 },
    };
    multiSetRecord.sets[1].entries.push({
      type: EntryType.TIMEOUT,
      data: mockTimeout,
    });
    const resultSet2 = getPreviousRally(multiSetRecord, 1, 1);
    expect(resultSet2).toEqual(rallyInSet2);
  });
});
