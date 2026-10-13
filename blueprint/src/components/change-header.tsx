import { ChangeMetricsBadges } from "@/components/figure-badges";
import { Badge } from "@/components/ui/badge";
import type { ChangeMetrics, ChangeStatus } from "@/lib/github-change-data";

export function ChangeHeader({
  title,
  status,
  mergedAt,
  metrics,
  scenarioCount,
}: {
  title: string;
  status: ChangeStatus;
  mergedAt?: string;
  metrics?: ChangeMetrics;
  scenarioCount: number;
}) {
  return (
    <header className="not-prose mb-6 flex flex-col gap-3">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={status === "merged" ? "secondary" : "outline"}>
          {status === "merged" ? "已合併" : "進行中"}
        </Badge>
        {mergedAt && (
          <time
            dateTime={mergedAt}
            className="text-xs text-muted-foreground tabular-nums"
          >
            {mergedAt.slice(0, 10)}
          </time>
        )}
      </div>
      <ChangeMetricsBadges metrics={metrics} scenarioCount={scenarioCount} />
    </header>
  );
}
