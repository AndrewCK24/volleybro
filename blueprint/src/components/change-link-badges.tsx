import { Badge } from "@/components/ui/badge";
import type { ChangeSummary } from "@/lib/github-change-data";

export function ChangeLinkBadges({
  pullRequests,
  capabilities,
}: Pick<ChangeSummary, "pullRequests" | "capabilities">) {
  const prs = pullRequests ?? [];
  const featureLinks = capabilities ?? [];
  if (prs.length === 0 && featureLinks.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {prs.map((pr) => (
        <Badge key={pr.url} variant="outline" asChild>
          <a href={pr.url} target="_blank" rel="noreferrer">
            PR #{pr.number}
          </a>
        </Badge>
      ))}
      {featureLinks.map((capability) => (
        <Badge key={capability.href} variant="outline" asChild>
          <a href={capability.href} aria-label={capability.fullLabel}>
            <span className="hidden md:inline">{capability.fullLabel}</span>
            <span className="md:hidden">{capability.shortLabel}</span>
          </a>
        </Badge>
      ))}
    </div>
  );
}
