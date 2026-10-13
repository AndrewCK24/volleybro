import { ChangeMetricsBadges } from "@/components/figure-badges";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChangeStatus, ChangeSummary } from "@/lib/github-change-data";

const STATUS_CLASS: Record<ChangeStatus, string> = {
  "in-progress":
    "border-[color-mix(in_oklch,var(--warning)_40%,transparent)] bg-[color-mix(in_oklch,var(--warning)_12%,transparent)] text-warning",
  merged:
    "border-[color-mix(in_oklch,var(--primary)_35%,transparent)] bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] text-primary-text",
};

export function ChangeCard({ change }: { change: ChangeSummary }) {
  return (
    <a href={change.href} className="block text-inherit no-underline!">
      <Card className="gap-3 border-l-4 border-l-primary py-4 transition-colors hover:bg-muted/30">
        <CardHeader className="gap-2 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{change.title}</CardTitle>
            <Badge variant="outline" className={STATUS_CLASS[change.status]}>
              {change.status === "merged" ? "已合併" : "進行中"}
            </Badge>
            {(change.mergedAt ?? change.publishedAt) && (
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {(change.mergedAt ?? change.publishedAt)?.slice(0, 10)}
              </span>
            )}
          </div>
          {change.description && (
            <CardDescription className="leading-snug">
              {change.description}
            </CardDescription>
          )}
        </CardHeader>
        {(change.metrics || change.scenarioCount > 0) && (
          <CardContent className="px-4">
            <ChangeMetricsBadges
              metrics={change.metrics}
              scenarioCount={change.scenarioCount}
            />
          </CardContent>
        )}
      </Card>
    </a>
  );
}

export function ChangeCardList({ changes }: { changes: ChangeSummary[] }) {
  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      {changes.map((change) => (
        <ChangeCard key={change.slug} change={change} />
      ))}
    </div>
  );
}
