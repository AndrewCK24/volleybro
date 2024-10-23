import type { Record, Substitution } from "@/entities/record";

export const createSubstitution = async (
  params: { recordId: string; setIndex: number; rallyIndex: number },
  substitution: Substitution,
  record: Record
) => {
  const { recordId, setIndex, rallyIndex } = params;
  try {
    const res = await fetch(
      `/api/records/${recordId}/sets/substitutions?si=${setIndex}&ri=${rallyIndex}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(substitution),
      }
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const substitutions = await res.json();
    record.sets[setIndex].substitutions = substitutions;
    return record;
  } catch (error) {
    console.error("[POST /api/records]", error);
  }
};