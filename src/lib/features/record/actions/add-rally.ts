import type { Record } from "@/src/entities/record";
import type { ReduxRecording } from "@/src/lib/features/record/types";

export const addRally = async (
  params: { recordId: string; setNum: number },
  recording: ReduxRecording,
  record: Record
) => {
  const { recordId, setNum } = params;
  try {
    const res = await fetch(`/api/records/${recordId}/sets/${setNum}/rallies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recording),
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const rallies = await res.json();
    record.sets[setNum].rallies = rallies;
    return record;
  } catch (error) {
    console.error("[POST /api/records]", error);
  }
};
