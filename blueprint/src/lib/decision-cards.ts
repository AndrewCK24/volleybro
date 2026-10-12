import { decisionsById } from "@/lib/decisions-index";
import type { DecisionRecord } from "@/lib/decision-record";

export type DecisionCardEntry = {
  record: DecisionRecord;
  supersededHref?: string;
};

export function decisionCardsForIds(ids: string[]): DecisionCardEntry[] {
  const idsOnPage = new Set(ids);
  return decisionsById(ids).map((record) => {
    const replacement = record.supersededBy;
    if (!replacement) return { record };
    if (idsOnPage.has(replacement)) {
      return { record, supersededHref: `#adr-${replacement}` };
    }

    const [capability] = decisionsById([replacement])[0]?.capabilities ?? [];
    return {
      record,
      supersededHref: capability
        ? `/features/${capability}#adr-${replacement}`
        : undefined,
    };
  });
}
