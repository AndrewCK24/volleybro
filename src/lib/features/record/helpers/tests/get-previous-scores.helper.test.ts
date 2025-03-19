import { getPreviousScores } from "@/lib/features/record/helpers";
import { type Record, EntryType, MoveType } from "@/entities/record";

describe("getPreviousScores", () => {
  test("should return correct scores when previous Rally exists", () => {
    const mockRecord = {
      sets: [
        {
          entries: [
            {
              type: EntryType.RALLY,
              data: {
                win: true,
                home: { score: 10, type: MoveType.SERVING, num: 1 },
                away: { score: 8, type: MoveType.RECEPTION, num: 1 },
              },
            },
          ],
        },
      ],
    } as Record;

    const setIndex = 0;
    const entryIndex = 1; // Look for rally before entryIndex

    const scores = getPreviousScores(mockRecord, setIndex, entryIndex);

    expect(scores).toEqual({ home: 10, away: 8 });
  });

  test("should return zero scores when no previous Rally exists", () => {
    // Create Record object without Rally
    const mockRecord = {
      sets: [
        {
          entries: [
            {
              type: EntryType.TIMEOUT, // Non-RALLY type
              data: {},
            },
          ],
        },
      ],
    } as Record;

    const setIndex = 0;
    const entryIndex = 1;

    const scores = getPreviousScores(mockRecord, setIndex, entryIndex);

    expect(scores).toEqual({ home: 0, away: 0 });
  });

  test("should return zero scores when entryIndex is 0", () => {
    const mockRecord = { sets: [{ entries: [] }] } as Record;

    const setIndex = 0;
    const entryIndex = 0; // No previous entry

    const scores = getPreviousScores(mockRecord, setIndex, entryIndex);

    expect(scores).toEqual({ home: 0, away: 0 });
  });

  test("should get scores from most recent Rally when multiple entries exist", () => {
    const mockRecord = {
      sets: [
        {
          entries: [
            {
              type: EntryType.RALLY,
              data: {
                win: true,
                home: { score: 5, type: MoveType.SERVING, num: 1 },
                away: { score: 3, type: MoveType.RECEPTION, num: 1 },
              },
            },
            {
              type: EntryType.TIMEOUT,
              data: {},
            },
            {
              type: EntryType.RALLY,
              data: {
                win: false,
                home: { score: 15, type: MoveType.ATTACK, num: 2 },
                away: { score: 16, type: MoveType.BLOCKING, num: 2 },
              },
            },
          ],
        },
      ],
    } as Record;

    const setIndex = 0;
    const entryIndex = 3; // Look for rally before entryIndex=3

    const scores = getPreviousScores(mockRecord, setIndex, entryIndex);

    expect(scores).toEqual({ home: 15, away: 16 });
  });
});
