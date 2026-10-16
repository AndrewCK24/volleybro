import { ChangeMetricsBadges } from "@/components/change-metrics-badges";
import { useChangeSummaries } from "@/lib/change-summary-client";
import { Badge } from "@/components/ui/badge";
import type { ChangeMetrics, ChangeStatus } from "@/lib/github-change-data";

export function ChangeHeader({
  title,
  slug,
  status: initialStatus,
  mergedAt: initialMergedAt,
  metrics: initialMetrics,
  scenarioCount,
}: {
  title: string;
  slug?: string;
  status: ChangeStatus;
  mergedAt?: string;
  metrics?: ChangeMetrics;
  scenarioCount: number;
}) {
  const remote = useChangeSummaries(Boolean(slug));
  const live = remote.changes?.find((change) => change.slug === slug);
  const status = slug ? live?.status : initialStatus;
  const mergedAt = slug ? live?.mergedAt : initialMergedAt;
  const metrics = slug ? live?.metrics : initialMetrics;
  return (
    <header className="not-prose mb-6 flex flex-col gap-3">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {status ? (
          <Badge variant={status === "merged" ? "secondary" : "outline"}>
            {status === "merged" ? "已合併" : "進行中"}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {remote.failed || remote.changes
              ? "暫時無法取得 PR 狀態"
              : "讀取 PR 狀態中…"}
          </span>
        )}
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
