import { decisionsByIdFrom } from "@/lib/decision-lookup";
import type { DecisionRecord } from "@/lib/decision-record";

export type DecisionCardEntry = {
  record: DecisionRecord;
  supersededHref?: string;
};

export function decisionCardsFor(
  records: DecisionRecord[],
  ids: string[],
): DecisionCardEntry[] {
  const idsOnPage = new Set(ids);
  return decisionsByIdFrom(records, ids).map((record) => {
    const replacement = record.supersededBy;
    if (!replacement) return { record };
    if (idsOnPage.has(replacement)) {
      return { record, supersededHref: `#adr-${replacement}` };
    }

    const [capability] =
      decisionsByIdFrom(records, [replacement])[0]?.capabilities ?? [];
    return {
      record,
      supersededHref: capability
        ? `/features/${capability}#adr-${replacement}`
        : undefined,
    };
  });
}
