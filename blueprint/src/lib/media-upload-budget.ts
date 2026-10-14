export const MEDIA_STORAGE_BUDGET_BYTES = 8_000_000_000;
export const MEDIA_UPLOAD_BUDGET_PER_MONTH = 100_000;

export type MediaBudgetRecord = {
  month: string;
  baselineBytes: number;
  reservedBytes: number;
  uploadRequests: number;
};

type VersionedMediaBudget = { value: unknown; revision: string };

export type MediaBudgetStore = {
  getVersioned(id: string): Promise<VersionedMediaBudget | null>;
  compareAndSet(
    id: string,
    expectedRevision: string | null,
    value: MediaBudgetRecord,
  ): Promise<{ applied: boolean }>;
  updateIf(
    id: string,
    args: {
      where: Record<string, string | number | { lte?: number; lt?: number }>;
      delta: {
        reservedBytes: { inc: number };
        uploadRequests: { inc: number };
      };
    },
  ): Promise<{ applied: boolean }>;
};

export type ExistingMedia = { size: number | null };
export type MediaPage = {
  items: ExistingMedia[];
  cursor?: string;
  hasMore: boolean;
};

function parseMediaBudgetRecord(value: unknown): MediaBudgetRecord | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (
    typeof record.month !== "string" ||
    !Number.isSafeInteger(record.baselineBytes) ||
    !Number.isSafeInteger(record.reservedBytes) ||
    !Number.isSafeInteger(record.uploadRequests) ||
    Number(record.baselineBytes) < 0 ||
    Number(record.reservedBytes) < 0 ||
    Number(record.uploadRequests) < 0
  ) {
    return undefined;
  }
  return {
    month: record.month,
    baselineBytes: Number(record.baselineBytes),
    reservedBytes: Number(record.reservedBytes),
    uploadRequests: Number(record.uploadRequests),
  };
}

function currentMonth(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function existingMediaBytes(
  list: (cursor?: string) => Promise<MediaPage>,
): Promise<number> {
  let cursor: string | undefined;
  let bytes = 0;
  do {
    const page = await list(cursor);
    for (const item of page.items) {
      if (
        !Number.isSafeInteger(item.size) ||
        item.size === null ||
        item.size < 0
      ) {
        throw new Error(
          "Cannot verify current Blueprint media usage; new uploads are blocked.",
        );
      }
      bytes += item.size;
      if (!Number.isSafeInteger(bytes)) {
        throw new Error(
          "Blueprint media usage is invalid; new uploads are blocked.",
        );
      }
    }
    cursor = page.cursor;
    if (page.hasMore && !cursor) {
      throw new Error(
        "Could not continue reading Blueprint media usage; new uploads are blocked.",
      );
    }
  } while (cursor);
  return bytes;
}

async function getOrCreateMonth(
  store: MediaBudgetStore,
  month: string,
  baselineBytes: () => Promise<number>,
): Promise<MediaBudgetRecord> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = await store.getVersioned(month);
    if (current) {
      const value = parseMediaBudgetRecord(current.value);
      if (!value || value.month !== month)
        throw new Error("Blueprint media budget ledger is invalid.");
      return value;
    }

    const value: MediaBudgetRecord = {
      month,
      baselineBytes: await baselineBytes(),
      reservedBytes: 0,
      uploadRequests: 0,
    };
    if (!Number.isSafeInteger(value.baselineBytes) || value.baselineBytes < 0) {
      throw new Error(
        "Cannot verify current Blueprint media usage; new uploads are blocked.",
      );
    }
    const result = await store.compareAndSet(month, null, value);
    if (result.applied) return value;
  }
  throw new Error(
    "Could not initialize Blueprint media budget; new uploads are blocked.",
  );
}

export async function reserveBlueprintMediaUpload(
  input: { size: number },
  options: {
    store: MediaBudgetStore;
    list: (cursor?: string) => Promise<MediaPage>;
    now?: Date;
  },
): Promise<void> {
  if (!Number.isSafeInteger(input.size) || input.size < 0) {
    throw new Error("Upload size is invalid; new uploads are blocked.");
  }

  const month = currentMonth(options.now ?? new Date());
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const current = await getOrCreateMonth(options.store, month, () =>
      existingMediaBytes(options.list),
    );
    const maxReservedBytes =
      MEDIA_STORAGE_BUDGET_BYTES - current.baselineBytes - input.size;
    if (
      maxReservedBytes < 0 ||
      current.uploadRequests >= MEDIA_UPLOAD_BUDGET_PER_MONTH
    ) {
      throw new Error(
        "Blueprint media free-tier upload budget reached; no further uploads are allowed this month.",
      );
    }

    const result = await options.store.updateIf(month, {
      where: {
        month,
        reservedBytes: { lte: maxReservedBytes },
        uploadRequests: { lt: MEDIA_UPLOAD_BUDGET_PER_MONTH },
      },
      delta: {
        reservedBytes: { inc: input.size },
        uploadRequests: { inc: 1 },
      },
    });
    if (result.applied) return;
  }
  throw new Error(
    "Could not reserve Blueprint media free-tier quota; no further uploads are allowed.",
  );
}
