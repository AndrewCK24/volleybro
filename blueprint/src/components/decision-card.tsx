"use client";

import { CardItem } from "@/components/card-list";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { DecisionRecord } from "@/lib/decision-record";
import { renderInline } from "@/lib/render-inline";
import { cn } from "@/lib/utils";

function VerdictBadge({ isAdopted }: { isAdopted: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "mt-0.5",
        isAdopted
          ? "bg-primary/10 text-primary-text dark:bg-primary/20"
          : "bg-error/10 text-error-text dark:bg-error/20",
      )}
    >
      {isAdopted ? "採用" : "棄用"}
    </Badge>
  );
}

export function DecisionCard({
  record,
  mode,
  supersededHref,
}: {
  record: DecisionRecord;
  mode: "compact" | "full";
  supersededHref?: string;
}) {
  if (mode === "compact") {
    return (
      <CardItem
        value={record.id}
        id={`adr-${record.id}`}
        summary={
          <>
            <Badge variant="outline">ADR-{record.id}</Badge>
            <span className="text-sm font-medium">
              {renderInline(record.title)}
            </span>
            {record.supersededBy && (
              <Badge variant="secondary">
                被 ADR-{record.supersededBy} 取代
              </Badge>
            )}
          </>
        }
      >
        {record.supersededBy && supersededHref && (
          <a href={supersededHref} className="text-sm">
            查看取代它的 ADR-{record.supersededBy}
          </a>
        )}
        <div className="flex items-start gap-2">
          <VerdictBadge isAdopted />
          <p className="m-0 text-sm text-foreground">
            {renderInline(record.decision)}
          </p>
        </div>
        {record.alternatives?.map((alternative) => (
          <div key={alternative.option} className="flex items-start gap-2">
            <VerdictBadge isAdopted={false} />
            <p className="m-0 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {renderInline(alternative.option)}
              </span>
              ：{renderInline(alternative.reason)}
            </p>
          </div>
        ))}
      </CardItem>
    );
  }

  return (
    <AccordionItem
      value={record.id}
      id={`adr-${record.id}`}
      className="relative scroll-mt-20 border-0"
    >
      <span className="absolute top-5 -left-5 size-2.5 rounded-full border-2 border-background bg-primary" />
      <AccordionTrigger className="hover:no-underline">
        <span className="flex min-w-0 flex-wrap items-center gap-2 pr-2">
          <Badge variant="outline">{record.id}</Badge>
          <span>{renderInline(record.title)}</span>
          {record.supersededBy && (
            <Badge variant="secondary">
              Superseded by {record.supersededBy}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pb-5">
        <div className="flex flex-wrap gap-1.5">
          {record.capabilities.map((capability) => (
            <Badge key={capability} variant="outline">
              {capability}
            </Badge>
          ))}
        </div>

        {record.context && (
          <div className="grid gap-1">
            <h4 className="m-0 text-sm font-semibold">Context</h4>
            <p className="m-0 text-sm text-muted-foreground">
              {renderInline(record.context)}
            </p>
          </div>
        )}

        <div className="grid gap-1">
          <h4 className="m-0 text-sm font-semibold">Decision</h4>
          <p className="m-0 text-sm">{renderInline(record.decision)}</p>
        </div>

        {record.alternatives && record.alternatives.length > 0 && (
          <div className="grid gap-2">
            <h4 className="m-0 text-sm font-semibold">
              Alternatives not chosen
            </h4>
            {record.alternatives.map((alternative) => (
              <div key={alternative.option} className="rounded-lg border p-3">
                <p className="m-0 text-sm font-medium">
                  {renderInline(alternative.option)}
                </p>
                <p className="m-0 mt-1 text-sm text-muted-foreground">
                  {renderInline(alternative.reason)}
                </p>
              </div>
            ))}
          </div>
        )}

        {record.consequences && (
          <div className="grid gap-1">
            <h4 className="m-0 text-sm font-semibold">Consequences</h4>
            <ul className="m-0 grid gap-1 pl-5 text-sm">
              {record.consequences.map((consequence) => (
                <li key={consequence}>{renderInline(consequence)}</li>
              ))}
            </ul>
          </div>
        )}

        {record.revisitTriggers && (
          <div className="grid gap-1">
            <h4 className="m-0 text-sm font-semibold">Revisit triggers</h4>
            <ul className="m-0 grid gap-1 pl-5 text-sm">
              {record.revisitTriggers.map((trigger) => (
                <li key={trigger}>{renderInline(trigger)}</li>
              ))}
            </ul>
          </div>
        )}

        {record.originChange && (
          <p className="m-0 text-xs text-muted-foreground">
            Origin Change: {renderInline(record.originChange)}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
