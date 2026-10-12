import defaultMdxComponents from "fumadocs-ui/mdx";

import { AnnotatedDiff } from "@/components/annotated-diff";
import { StatusBadge } from "@/components/status-badge";
import {
  ActionItems,
  AfterRelease,
  Deviations,
  ReviewDetails,
  ReviewFocus,
} from "@/components/review-sections";
import { RiskTable } from "@/components/risk-table";
import { Scenario } from "@/components/scenario";
import {
  ScenarioResults,
  Scenarios,
  TestPlan,
} from "@/components/scenario-cards";
import { TLDR } from "@/components/tldr";

export function changeMdxComponents<TDecisionCards>(
  decisionCardsAdapter: TDecisionCards,
) {
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
    DecisionCards: decisionCardsAdapter,
  };
}

export function featureMdxComponents() {
  return {
    ...defaultMdxComponents,
    StatusBadge,
  };
}
