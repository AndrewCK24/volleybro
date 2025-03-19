import { getServingStatus } from "@/lib/features/record/helpers";
import { type Record, EntryType, MoveType } from "@/entities/record";

describe("getServingStatus", () => {
  test("should return true when previous Rally was won", () => {
    // Create Record object with winning Rally
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

    const isServing = getServingStatus(mockRecord, setIndex, entryIndex);

    expect(isServing).toBe(true);
  });

  test("should return false when previous Rally was lost", () => {
    const mockRecord = {
      sets: [
        {
          entries: [
            {
              type: EntryType.RALLY,
              data: {
                win: false,
                home: { score: 8, type: MoveType.RECEPTION, num: 1 },
                away: { score: 10, type: MoveType.SERVING, num: 1 },
              },
            },
          ],
        },
      ],
    } as Record;

    const setIndex = 0;
    const entryIndex = 1;

    const isServing = getServingStatus(mockRecord, setIndex, entryIndex);

    expect(isServing).toBe(false);
  });

  test("should return initial serve setting when no previous Rally exists", () => {
    const mockRecord = {
      sets: [
        {
          options: { serve: "home" },
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

    const isServing = getServingStatus(mockRecord, setIndex, entryIndex);

    expect(isServing).toBe(true);
  });

  test("should return initial serve setting when entryIndex is 0", () => {
    const mockRecord = {
      sets: [
        {
          options: { serve: "away" },
          entries: [],
        },
      ],
    } as Record;

    const setIndex = 0;
    const entryIndex = 0; // No previous entry

    const isServing = getServingStatus(mockRecord, setIndex, entryIndex);

    expect(isServing).toBe(false);
  });
});
