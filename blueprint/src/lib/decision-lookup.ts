import type { DecisionRecord } from "@/lib/decision-record";

function decisionNumber(record: DecisionRecord): number {
  return Number(record.id);
}

export function allDecisionsFrom(records: DecisionRecord[]): DecisionRecord[] {
  return [...records].sort((a, b) => decisionNumber(a) - decisionNumber(b));
}

export function decisionsForFrom(
  records: DecisionRecord[],
  capability: string,
): DecisionRecord[] {
  return records
    .filter((record) => record.capabilities.includes(capability))
    .sort((a, b) => decisionNumber(a) - decisionNumber(b));
}

export function decisionsByIdFrom(
  records: DecisionRecord[],
  ids: string[],
): DecisionRecord[] {
  const byId = new Map(records.map((record) => [record.id, record]));
  return ids.flatMap((id) => {
    const record = byId.get(id);
    return record ? [record] : [];
  });
}
