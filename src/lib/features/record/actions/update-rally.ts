import type { Record, Rally } from "@/entities/record";

export const updateRally = async (
  params: { recordId: string; setIndex: number; entryIndex: number },
  recording: Rally,
  record: Record
) => {
  const { recordId, setIndex, entryIndex } = params;
  try {
    const res = await fetch(
      `/api/records/${recordId}/sets/rallies?si=${setIndex}&ei=${entryIndex}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recording),
      }
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const entries = await res.json();
    record.sets[setIndex].entries = entries;
    return record;
  } catch (error) {
    console.error("[UPDATE Rally]", error);
  }
};
