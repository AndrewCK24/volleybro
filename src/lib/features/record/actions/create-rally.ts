import type { Record } from "@/entities/record";
import type { ReduxRecording } from "@/lib/features/record/types";

export const createRally = async (
  params: { recordId: string; setIndex: number; rallyIndex: number },
  recording: ReduxRecording,
  record: Record
) => {
  const { recordId, setIndex, rallyIndex } = params;
  try {
    const res = await fetch(
      `/api/records/${recordId}/sets/rallies?si=${setIndex}&ri=${rallyIndex}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recording),
      }
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const rallies = await res.json();
    record.sets[setIndex].rallies = rallies;
    return record;
  } catch (error) {
    console.error("[POST /api/records]", error);
  }
};
