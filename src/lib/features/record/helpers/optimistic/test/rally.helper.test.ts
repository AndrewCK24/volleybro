import {
  createRallyHelper,
  updateRallyHelper,
} from "@/lib/features/record/helpers";
import { Position } from "@/entities/team";
import { EntryType, MoveType } from "@/entities/record";
import type { Rally, Record } from "@/entities/record";

describe("rally.helper.ts", () => {
  const mockRally: Rally = {
    win: true,
    home: {
      score: 1,
      type: MoveType.ATTACK,
      num: 1,
      player: { _id: "player-1", zone: 1 },
    },
    away: {
      score: 0,
      type: MoveType.DEFENSE,
      num: 1,
      player: { _id: "rival-1", zone: 1 },
    },
  };

  const createMockRecord = (): Record => ({
    _id: "record-1",
    win: false,
    team_id: "team-1",
    info: {
      scoring: {
        setCount: 5,
        decidingSetPoints: 15,
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
            starting: [
              { _id: "player-1", position: Position.OH },
              { _id: "player-2", position: Position.MB },
            ],
            liberos: [{ _id: "player-7", position: Position.L }],
            substitutes: [{ _id: "player-8", position: Position.OH }],
          },
          away: {
            options: {
              liberoReplaceMode: 0,
              liberoReplacePosition: Position.NONE,
            },
            starting: [{ _id: "rival-1", position: Position.OH }],
            liberos: [],
            substitutes: [{ _id: "rival-2", position: Position.OH }],
          },
        },
        entries: [
          {
            type: EntryType.RALLY,
            data: {
              win: true,
              home: {
                score: 0,
                type: MoveType.SERVING,
                num: 1,
                player: { _id: "player-1", zone: 1 },
              },
              away: {
                score: 0,
                type: MoveType.RECEPTION,
                num: 1,
                player: { _id: "rival-1", zone: 1 },
              },
            },
          },
        ],
        options: { serve: "home" },
      },
    ],
    teams: {
      home: {
        _id: "team-1",
        name: "Home Team",
        players: [
          {
            _id: "player-1",
            name: "Player 1",
            number: 1,
            stats: [
              {
                [MoveType.ATTACK]: { success: 0, error: 0 },
                [MoveType.SERVING]: { success: 1, error: 0 },
                [MoveType.BLOCKING]: { success: 0, error: 0 },
                [MoveType.RECEPTION]: { success: 0, error: 0 },
                [MoveType.DEFENSE]: { success: 0, error: 0 },
                [MoveType.SETTING]: { success: 0, error: 0 },
              },
            ],
          },
        ],
        staffs: [],
        stats: [
          {
            [MoveType.ATTACK]: { success: 0, error: 0 },
            [MoveType.SERVING]: { success: 1, error: 0 },
            [MoveType.BLOCKING]: { success: 0, error: 0 },
            [MoveType.RECEPTION]: { success: 0, error: 0 },
            [MoveType.DEFENSE]: { success: 0, error: 0 },
            [MoveType.SETTING]: { success: 0, error: 0 },
            [MoveType.UNFORCED]: { success: 0, error: 0 },
            rotation: 0,
            timeout: 2,
            substitution: 6,
            challenge: 2,
          },
        ],
      },
      away: {
        _id: "team-2",
        name: "Away Team",
        players: [
          {
            _id: "rival-1",
            name: "Rival 1",
            number: 1,
            stats: [
              {
                [MoveType.RECEPTION]: { success: 0, error: 1 },
                [MoveType.ATTACK]: { success: 0, error: 0 },
                [MoveType.SERVING]: { success: 0, error: 0 },
                [MoveType.BLOCKING]: { success: 0, error: 0 },
                [MoveType.DEFENSE]: { success: 0, error: 0 },
                [MoveType.SETTING]: { success: 0, error: 0 },
              },
            ],
          },
        ],
        staffs: [],
        stats: [
          {
            [MoveType.RECEPTION]: { success: 0, error: 1 },
            [MoveType.ATTACK]: { success: 0, error: 0 },
            [MoveType.SERVING]: { success: 0, error: 0 },
            [MoveType.BLOCKING]: { success: 0, error: 0 },
            [MoveType.DEFENSE]: { success: 0, error: 0 },
            [MoveType.SETTING]: { success: 0, error: 0 },
            [MoveType.UNFORCED]: { success: 0, error: 0 },
            rotation: 0,
            timeout: 2,
            substitution: 6,
            challenge: 2,
          },
        ],
      },
    },
  });

  describe("createRallyOptimistic", () => {
    const mockParams = {
      recordId: "record-1",
      setIndex: 0,
      entryIndex: 1,
    };

    test("should create new rally entry at specified index", () => {
      const mockRecord = createMockRecord();

      const result = createRallyHelper(mockParams, mockRally, mockRecord);

      expect(result.sets[0].entries[1]).toEqual({
        type: EntryType.RALLY,
        data: mockRally,
      });
    });

    test("should update player stats when home team wins", () => {
      const mockRecord = createMockRecord();
      const result = createRallyHelper(mockParams, mockRally, mockRecord);

      expect(
        result.teams.home.players[0].stats[0][MoveType.ATTACK].success
      ).toBe(1);
    });

    test("should update team stats when home team wins", () => {
      const mockRecord = createMockRecord();

      const result = createRallyHelper(mockParams, mockRally, mockRecord);

      expect(result.teams.home.stats[0][MoveType.ATTACK].success).toBe(1);
      expect(result.teams.away.stats[0][MoveType.DEFENSE].error).toBe(1);
    });

    test("should update rotation when winning and the last rally is lost", () => {
      const mockRecord = createMockRecord();

      // add a lost rally before the winning rally for rotation
      (mockRecord.sets[0].entries[0].data as Rally).win = false;

      const result = createRallyHelper(mockParams, mockRally, mockRecord);

      expect(result.teams.home.stats[0].rotation).toBe(1);
    });

    test("should not update rotation when winning serving team", () => {
      const mockRecord = createMockRecord();

      // Set home team as serving team
      mockRecord.sets[0].options.serve = "home";

      const result = createRallyHelper(mockParams, mockRally, mockRecord);

      expect(result.teams.home.stats[0].rotation).toBe(0);
    });
  });

  describe("updateRallyOptimistic", () => {
    const mockParams = {
      recordId: "record-1",
      setIndex: 0,
      entryIndex: 0,
    };

    const newRally: Rally = {
      win: true,
      home: {
        score: 1,
        type: MoveType.ATTACK, // Changed from SERVING to ATTACK
        num: 1,
        player: { _id: "player-1", zone: 1 },
      },
      away: {
        score: 0,
        type: MoveType.DEFENSE, // Changed from RECEPTION to DEFENSE
        num: 1,
        player: { _id: "rival-1", zone: 1 },
      },
    };

    test("should update existing rally entry with new data", () => {
      const mockRecord = createMockRecord();

      const result = updateRallyHelper(mockParams, newRally, mockRecord);

      expect(result.sets[0].entries[0]).toEqual({
        type: EntryType.RALLY,
        data: newRally,
      });
    });

    test("should update player and team stats when rally details change", () => {
      const mockRecord = createMockRecord();

      const result = updateRallyHelper(mockParams, newRally, mockRecord);

      // Original stats should be removed
      expect(
        result.teams.home.players[0].stats[0][MoveType.ATTACK].success
      ).toBe(1);

      // New stats should be added
      expect(
        result.teams.home.players[0].stats[0][MoveType.SERVING].success
      ).toBe(0);

      // Team stats should also be updated
      expect(result.teams.home.stats[0][MoveType.SERVING].success).toBe(0);
      expect(result.teams.away.stats[0][MoveType.RECEPTION].error).toBe(0);
      expect(result.teams.home.stats[0][MoveType.ATTACK].success).toBe(1);
      expect(result.teams.away.stats[0][MoveType.DEFENSE].error).toBe(1);
    });

    test("should update player and team stats when changing a rally from lost to won", () => {
      const mockRecord = createMockRecord();
      const mockParams = { recordId: "record-1", setIndex: 0, entryIndex: 1 };
      const lostRally: Rally = {
        win: false,
        home: {
          score: 1,
          type: MoveType.ATTACK,
          num: 1,
          player: { _id: "player-1", zone: 1 },
        },
        away: {
          score: 1,
          type: MoveType.BLOCKING,
          num: 1,
          player: { _id: "rival-1", zone: 1 },
        },
      };
      createRallyHelper(mockParams, lostRally, mockRecord);

      // Change the first rally from lost to win
      const result = updateRallyHelper(mockParams, newRally, mockRecord);

      // Original stats should be removed
      expect(result.teams.home.players[0].stats[0][MoveType.ATTACK].error).toBe(
        0
      );

      // New stats should be added
      expect(
        result.teams.home.players[0].stats[0][MoveType.ATTACK].success
      ).toBe(1);

      // Team stats should also be updated
      expect(result.teams.home.stats[0][MoveType.ATTACK].error).toBe(0);
      expect(result.teams.away.stats[0][MoveType.BLOCKING].success).toBe(0);
      expect(result.teams.home.stats[0][MoveType.ATTACK].success).toBe(1);
      expect(result.teams.away.stats[0][MoveType.DEFENSE].error).toBe(1);
    });

    test("should throw error when entry is not a rally", () => {
      const mockRecord = createMockRecord();
      mockRecord.sets[0].entries[0].type = EntryType.TIMEOUT;

      expect(() => {
        updateRallyHelper(mockParams, newRally, mockRecord);
      }).toThrow("Entry is not a rally");
    });

    test("should update rotation when rally win status changes", () => {
      const mockRecord = createMockRecord();
      // Add a second rally so we can see rotation change
      mockRecord.sets[0].entries.push({
        type: EntryType.RALLY,
        data: {
          win: true,
          home: {
            score: 2,
            type: MoveType.ATTACK,
            num: 1,
            player: { _id: "player-1", zone: 1 },
          },
          away: {
            score: 0,
            type: MoveType.DEFENSE,
            num: 1,
            player: { _id: "rival-1", zone: 1 },
          },
        },
      });

      // Change the first rally from win to loss
      const newRally: Rally = {
        win: false, // Changed from true to false
        home: {
          score: 0,
          type: MoveType.ATTACK,
          num: 1,
          player: { _id: "player-1", zone: 1 },
        },
        away: {
          score: 1,
          type: MoveType.BLOCKING,
          num: 1,
          player: { _id: "rival-1", zone: 1 },
        },
      };

      const result = updateRallyHelper(mockParams, newRally, mockRecord);

      // Rotation should be updated since we've changed win status
      expect(result.teams.home.stats[0].rotation).toBe(1);
    });

    test("should not change rotation when win status remains the same", () => {
      const mockRecord = createMockRecord();

      const result = updateRallyHelper(mockParams, newRally, mockRecord);

      // Rotation should remain unchanged
      expect(result.teams.home.stats[0].rotation).toBe(0);
    });
  });
});
