/** @jest-environment node */

import {
  MEDIA_STORAGE_BUDGET_BYTES,
  MEDIA_UPLOAD_BUDGET_PER_MONTH,
  reserveBlueprintMediaUpload,
  type MediaBudgetRecord,
  type MediaBudgetStore,
} from "./media-upload-budget";

class MemoryBudget implements MediaBudgetStore {
  readonly rows = new Map<
    string,
    { value: MediaBudgetRecord; revision: string }
  >();

  async getVersioned(id: string) {
    return this.rows.get(id) ?? null;
  }

  async compareAndSet(
    id: string,
    expectedRevision: string | null,
    value: MediaBudgetRecord,
  ) {
    const current = this.rows.get(id);
    if (expectedRevision !== null || current) return { applied: false };
    this.rows.set(id, { value, revision: "1" });
    return { applied: true };
  }

  async updateIf(
    id: string,
    args: {
      where: Record<string, string | number | { lte?: number; lt?: number }>;
      delta: {
        reservedBytes: { inc: number };
        uploadRequests: { inc: number };
      };
    },
  ) {
    const current = this.rows.get(id);
    if (!current) return { applied: false };
    const { where } = args;
    if (where.month !== current.value.month) return { applied: false };
    const bytes = where.reservedBytes as { lte: number };
    const requests = where.uploadRequests as { lt: number };
    if (
      current.value.reservedBytes > bytes.lte ||
      current.value.uploadRequests >= requests.lt
    ) {
      return { applied: false };
    }
    this.rows.set(id, {
      value: {
        ...current.value,
        reservedBytes:
          current.value.reservedBytes + args.delta.reservedBytes.inc,
        uploadRequests:
          current.value.uploadRequests + args.delta.uploadRequests.inc,
      },
      revision: String(Number(current.revision) + 1),
    });
    return { applied: true };
  }
}

const now = new Date("2026-10-13T00:00:00.000Z");

describe("Blueprint media upload budget", () => {
  it("reserves storage and one upload operation before accepting an upload", async () => {
    const store = new MemoryBudget();
    await reserveBlueprintMediaUpload(
      { size: 128 },
      {
        store,
        now,
        list: async () => ({ items: [{ size: 1_000 }], hasMore: false }),
      },
    );

    expect(store.rows.get("2026-10")?.value).toEqual({
      month: "2026-10",
      baselineBytes: 1_000,
      reservedBytes: 128,
      uploadRequests: 1,
    });
  });

  it("fails closed when existing media leaves no storage headroom", async () => {
    await expect(
      reserveBlueprintMediaUpload(
        { size: 1 },
        {
          store: new MemoryBudget(),
          now,
          list: async () => ({
            items: [{ size: MEDIA_STORAGE_BUDGET_BYTES }],
            hasMore: false,
          }),
        },
      ),
    ).rejects.toThrow("free-tier upload budget reached");
  });

  it("fails closed when any existing media size is unknown", async () => {
    await expect(
      reserveBlueprintMediaUpload(
        { size: 1 },
        {
          store: new MemoryBudget(),
          now,
          list: async () => ({ items: [{ size: null }], hasMore: false }),
        },
      ),
    ).rejects.toThrow("Cannot verify current Blueprint media usage");
  });

  it("uses an atomic reservation so concurrent uploads cannot exceed the monthly storage budget", async () => {
    const store = new MemoryBudget();
    const list = async () => ({
      items: [{ size: MEDIA_STORAGE_BUDGET_BYTES - 10 }],
      hasMore: false,
    });
    const attempts = await Promise.allSettled([
      reserveBlueprintMediaUpload({ size: 6 }, { store, now, list }),
      reserveBlueprintMediaUpload({ size: 6 }, { store, now, list }),
    ]);

    expect(
      attempts.filter(({ status }) => status === "fulfilled"),
    ).toHaveLength(1);
    expect(attempts.filter(({ status }) => status === "rejected")).toHaveLength(
      1,
    );
    expect(store.rows.get("2026-10")?.value.reservedBytes).toBe(6);
  });

  it("blocks new uploads when the monthly operation reservation is exhausted", async () => {
    const store = new MemoryBudget();
    store.rows.set("2026-10", {
      revision: "1",
      value: {
        month: "2026-10",
        baselineBytes: 0,
        reservedBytes: 0,
        uploadRequests: MEDIA_UPLOAD_BUDGET_PER_MONTH,
      },
    });

    await expect(
      reserveBlueprintMediaUpload(
        { size: 1 },
        { store, now, list: async () => ({ items: [], hasMore: false }) },
      ),
    ).rejects.toThrow("free-tier upload budget reached");
  });
});
