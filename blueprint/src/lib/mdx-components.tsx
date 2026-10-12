import defaultMdxComponents from "fumadocs-ui/mdx";

import { AnnotatedDiff } from "@/components/AnnotatedDiff";
import { CardList } from "@/components/CardList";
import { DecisionCard } from "@/components/decision-card";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ActionItems,
  AfterRelease,
  Deviations,
  ReviewDetails,
  ReviewFocus,
} from "@/components/ReviewSections";
import { RiskTable } from "@/components/RiskTable";
import { Scenario } from "@/components/Scenario";
import {
  ScenarioResults,
  Scenarios,
  TestPlan,
} from "@/components/ScenarioCards";
import { TLDR } from "@/components/TLDR";
import { decisionsById } from "@/lib/decisions-index";

export function changeMdxComponents() {
  return {
    ...defaultMdxComponents,
    TLDR,
    AnchorAliases: ({ ids = [] }: { ids?: string[] }) => (
      <>
        {ids.map((id) => (
          <span key={id} id={id} />
        ))}
      </>
    ),
    Scenario,
    RiskTable,
    AnnotatedDiff,
    Scenarios,
    ScenarioResults,
    TestPlan,
    ActionItems,
    ReviewFocus,
    Deviations,
    AfterRelease,
    ReviewDetails,
    DecisionCards: ({ ids: decisionIds = [] }: { ids?: string[] }) => {
      const onPage = new Set(decisionIds);
      const cards = decisionsById(decisionIds).map((record) => {
        const replacement = record.supersededBy;
        if (!replacement) return { record };
        if (onPage.has(replacement)) {
          return { record, supersededHref: `#adr-${replacement}` };
        }
        const [capability] =
          decisionsById([replacement])[0]?.capabilities ?? [];
        return {
          record,
          supersededHref: capability
            ? `/features/${capability}#adr-${replacement}`
            : undefined,
        };
      });
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
    },
  };
}

export function featureMdxComponents() {
  return {
    ...defaultMdxComponents,
    StatusBadge,
  };
}
