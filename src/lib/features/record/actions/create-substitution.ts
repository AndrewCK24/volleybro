import type { Record, Substitution } from "@/entities/record";

export const createSubstitution = async (
  params: { recordId: string; setIndex: number; entryIndex: number },
  substitution: Substitution,
  record: Record
) => {
  const { recordId, setIndex, entryIndex } = params;
  try {
    const res = await fetch(
      `/api/records/${recordId}/sets/substitutions?si=${setIndex}&ei=${entryIndex}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(substitution),
      }
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const entries = await res.json();
    record.sets[setIndex].entries = entries;
    return record;
  } catch (error) {
    console.error("[CREATE Substitution]", error);
  }
};
