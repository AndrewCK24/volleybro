"use client";

import { Scenario } from "@/components/scenario";
import { Badge } from "@/components/ui/badge";

export type ScenarioData = {
  id: string;
  given: string;
  when: string;
  then: string;
};

export function Scenarios({ items }: { items: ScenarioData[] }) {
  return (
    <div className="not-prose my-4 flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-1.5">
          <Badge variant="outline">{item.id}</Badge>
          <Scenario given={item.given} when={item.when} then={item.then} />
        </div>
      ))}
    </div>
  );
}
