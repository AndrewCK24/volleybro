import { ChangeMetricsBadges } from "@/components/change-metrics-badges";
import { ChangeLinkBadges } from "@/components/change-link-badges";
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
    <Card className="relative gap-3 border-l-4 border-l-primary py-4 transition-colors hover:bg-muted/30">
      <a
        href={change.href}
        aria-label={change.title}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <div className="pointer-events-none relative z-10 flex flex-col gap-3">
        <CardHeader className="gap-2 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{change.title}</CardTitle>
            <Badge variant="outline" className={STATUS_CLASS[change.status]}>
              {change.status === "merged" ? "已完成" : "進行中"}
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
        <CardContent className="flex flex-col gap-3 px-4">
          {(change.metrics || change.scenarioCount > 0) && (
            <ChangeMetricsBadges
              metrics={change.metrics}
              scenarioCount={change.scenarioCount}
            />
          )}
          <div className="pointer-events-auto">
            <ChangeLinkBadges
              pullRequests={change.pullRequests}
              capabilities={change.capabilities}
            />
          </div>
        </CardContent>
      </div>
    </Card>
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
