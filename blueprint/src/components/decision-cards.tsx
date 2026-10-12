"use client";

import { CardList } from "@/components/card-list";
import { DecisionCard } from "@/components/decision-card";
import type { DecisionCardEntry } from "@/lib/decision-cards";

export function DecisionCardsList({ cards }: { cards: DecisionCardEntry[] }) {
  if (cards.length === 0) return null;

  return (
    <CardList>
      {cards.map(({ record, supersededHref }) => (
        <DecisionCard
          key={record.id}
          record={record}
          mode="compact"
          supersededHref={supersededHref}
        />
      ))}
    </CardList>
  );
}
