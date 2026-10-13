import {
  Code,
  FileText,
  GitCommitHorizontal,
  ListChecks,
  Minus,
  Plus,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChangeMetrics } from "@/lib/github-change-data";

type Figure = {
  key: string;
  value: number | null | undefined;
  text: (value: number) => string;
  Icon: LucideIcon;
  className: string;
  srLabel?: string;
};

const plural = (value: number, unit: string) =>
  `${value} ${unit}${value === 1 ? "" : "s"}`;

export function ChangeMetricsBadges({
  metrics,
  scenarioCount,
}: {
  metrics?: ChangeMetrics;
  scenarioCount: number;
}) {
  const figures: Figure[] = [
    {
      key: "commits",
      value: metrics?.commits,
      text: (value) => plural(value, "commit"),
      Icon: GitCommitHorizontal,
      className: "border-info/40 bg-info/10 text-info-text",
    },
    {
      key: "files",
      value: metrics?.filesChanged,
      text: (value) => plural(value, "file"),
      Icon: FileText,
      className: "border-border bg-muted text-foreground",
    },
    {
      key: "insertions",
      value: metrics?.additions,
      text: (value) => `${value}`,
      Icon: Plus,
      srLabel: "lines added",
      className: "border-success/40 bg-success/10 text-success-text",
    },
    {
      key: "deletions",
      value: metrics?.deletions,
      text: (value) => `${value}`,
      Icon: Minus,
      srLabel: "lines removed",
      className: "border-error/40 bg-error/10 text-error-text",
    },
    {
      key: "src",
      value: metrics?.srcFiles,
      text: (value) => plural(value, "src file"),
      Icon: Code,
      className: "border-warning/40 bg-warning/10 text-warning-text",
    },
    {
      key: "scenarios",
      value: scenarioCount,
      text: (value) => plural(value, "scenario"),
      Icon: ListChecks,
      className: "border-border bg-transparent text-muted-foreground",
    },
  ];
  const shown = figures.filter(
    (figure): figure is Figure & { value: number } =>
      figure.value !== undefined && figure.value !== null && figure.value > 0,
  );
  if (shown.length === 0) return null;
  return (
    <ul
      aria-label="Change figures"
      className="m-0 flex list-none flex-wrap gap-1.5 p-0"
    >
      {shown.map(({ key, value, text, Icon, className: tone, srLabel }) => (
        <li key={key} className="m-0 p-0">
          <Badge
            variant="outline"
            className={cn("gap-1 whitespace-nowrap tabular-nums", tone)}
          >
            <Icon aria-hidden="true" />
            {text(value)}
            {srLabel && <span className="sr-only">{srLabel}</span>}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
