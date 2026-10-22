import { AnnotatedDiff } from "@/components/annotated-diff";
import { InteractiveFlowchart } from "@/components/interactive-flowchart";
import { RiskTable } from "@/components/risk-table";
import { Scenario } from "@/components/scenario";
import { TLDR } from "@/components/tldr";

const flowchartSource =
  'flowchart TB\n  propose["Propose"]\n  review["Review"]\n  gate{"Approved?"}\n  merge["Merge\\nPR → main (integration)"]\n  ship["Ship"]\n  propose --> |"open PR"| review\n  review --> gate\n  gate --> |"yes"| merge\n  merge --> |"version PR + release gates"| ship\n  gate -.-> |"changes"| propose';

export const flowchartDetails: Record<string, { title: string; body: string }> =
  {
    propose: {
      title: "Propose",
      body: "An author opens a change proposal and drafts the design intent.",
    },
    review: {
      title: "Review",
      body: "Reviewers comment on the proposal and request changes as needed.",
    },
    gate: {
      title: "Approved?",
      body: "The decision point: reviewers either approve or send it back for changes.",
    },
    merge: {
      title: "Merge",
      body: "Once approved, the delivery batch merges into main; integration does not deploy production.",
    },
    ship: {
      title: "Ship",
      body: "An authorized version PR fixes the release revision; candidate checks, promotion and production smoke precede successful release.",
    },
  };

export const annotatedDiffCode = `sidebar={{
  tabs: [
    { title: "Changes", url: "/changes" },
    { title: "Features", url: "/features" },
    // New peer tab, registered alongside Changes and Features
    { title: "Design System", url: "/design-system" }, // [!code ++]
  ],
}}`;

export default function ComponentLibraryShowcase({
  annotatedDiffHtml,
}: {
  annotatedDiffHtml?: string;
} = {}) {
  return (
    <div>
      <h1>Component Library</h1>
      <p>
        Every kept blueprint component rendered with representative sample
        props. Use this page as a living-docs and visual-verification surface
        across light and dark themes.
      </p>

      <h2 id="status-progress">Status &amp; progress</h2>

      <h3>TLDR</h3>
      <TLDR>
        This change swaps the grayscale chart palette for the canonical colorful
        one, sources the warning and note accents from it, and replaces two thin
        components with the TLDR pattern.
      </TLDR>

      <section>
        <h3>Change content and PR review</h3>
        <p>
          An EmDash Change entry holds the reader-facing Change page. Ordinary
          content uses Portable Text; Blueprint typed blocks present decisions,
          risks, scenarios and diagrams.
        </p>
        <p>
          G2 review focus, verification, findings, rollout and developer actions
          belong in the GitHub PR. Change content is not republished at G2 and
          has no new Review tab or test-result wrapper.
        </p>
      </section>

      <h2 id="prose-explainers">Prose &amp; explainers</h2>

      <h3>Scenario</h3>
      <Scenario
        given="A set is tied 24-24 and the home team is serving"
        when="The home team wins two consecutive rallies"
        then="The set is awarded to the home team at 26-24"
      />

      <h2 id="tables-comparison">Tables &amp; comparison</h2>

      <h3>RiskTable</h3>
      <RiskTable
        risks={[
          {
            name: "Token drift between light and dark",
            severity: "critical",
            mitigation: "Single semantic token source consumed by both themes.",
          },
          {
            name: "Sidebar tree not scoped per section",
            severity: "warning",
            mitigation:
              "Track follow-up to give each section its own page tree.",
          },
          {
            name: "Static module map needs manual updates",
            severity: "info",
            mitigation: "Expand to dynamic discovery when pages grow.",
          },
          {
            name: "Components render in both themes",
            severity: "ok",
            mitigation: "Verified via this showcase page.",
          },
        ]}
      />

      <h3>AnnotatedDiff</h3>
      <AnnotatedDiff
        code={annotatedDiffCode}
        highlightedHtml={annotatedDiffHtml}
      />

      <h2 id="flowchart">Flowchart</h2>

      <h3>InteractiveFlowchart</h3>
      <InteractiveFlowchart
        source={flowchartSource}
        details={flowchartDetails}
      />
    </div>
  );
}

export const toc = [
  { title: "Status & progress", url: "#status-progress", depth: 2 },
  { title: "Prose & explainers", url: "#prose-explainers", depth: 2 },
  { title: "Tables & comparison", url: "#tables-comparison", depth: 2 },
  { title: "Flowchart", url: "#flowchart", depth: 2 },
];
