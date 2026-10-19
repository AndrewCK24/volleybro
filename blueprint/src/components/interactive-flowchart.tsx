"use client";

import { mount, register } from "pele/core";
import flowchart from "pele/diagrams/flowchart";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { renderInline } from "@/lib/render-inline";
import {
  getInteractiveFlowchartModel,
  interactiveFlowchartPropsSchema,
  MAX_FLOWCHART_EDGES,
  MAX_FLOWCHART_SOURCE_LENGTH,
  type InteractiveFlowchartProps,
} from "@/lib/interactive-flowchart-data";

register(flowchart);

export function InteractiveFlowchart(props: InteractiveFlowchartProps) {
  const { source, details, paths } = props;
  const validation = useMemo(() => {
    const result = interactiveFlowchartPropsSchema.safeParse({
      source,
      details,
      paths,
    });
    return result.success
      ? { ...result, model: getInteractiveFlowchartModel(source)! }
      : result;
  }, [source, details, paths]);
  const chart = validation.success ? validation.data : null;
  const hostRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const pathNodeIdsRef = useRef<Set<string>>(new Set());
  const pathEdgeKeysRef = useRef<Set<string>>(new Set());
  const decorateRef = useRef<(() => void) | null>(null);
  const reactId = useId().replaceAll(":", "");
  const idPrefix = `blueprint-flowchart-${reactId}`;
  const [selection, setSelection] = useState<{
    source: string;
    id: string;
  } | null>(null);
  const [activePathId, setActivePathId] = useState("");
  const [renderFailure, setRenderFailure] = useState<{
    source: string;
    message: string;
  } | null>(null);
  const activeId =
    selection && selection.source === chart?.source ? selection.id : null;
  const renderError =
    renderFailure && renderFailure.source === chart?.source
      ? renderFailure.message
      : null;
  const activePath = chart?.paths?.find((path) => path.id === activePathId);
  const model = validation.success ? validation.model : null;

  useEffect(() => {
    pathNodeIdsRef.current = new Set(activePath?.nodeIds ?? []);
    pathEdgeKeysRef.current = new Set(
      activePath?.nodeIds
        .slice(1)
        .map((to, index) => `${activePath.nodeIds[index]}\u0000${to}`) ?? [],
    );
    decorateRef.current?.();
  }, [activeId, activePath]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!chart) return;
    const host = hostRef.current;
    if (!host) return;

    if (!model) return;
    const edgeEndpointsById = new Map<string, { from: string; to: string }>();
    const edgeIndexes = new Map<string, number>();
    for (const edge of model.edges) {
      const key = `${edge.start}\u0000${edge.end}`;
      const index = edgeIndexes.get(key) ?? 0;
      edgeIndexes.set(key, index + 1);
      edgeEndpointsById.set(`L_${edge.start}_${edge.end}_${index}`, {
        from: edge.start,
        to: edge.end,
      });
    }

    const decorate = () => {
      const svg = host.querySelector("svg");
      if (!svg) return;

      svg.querySelectorAll<SVGGElement>(".pele-node").forEach((node) => {
        const id = node.dataset.id ?? "";
        const selected = id === activeIdRef.current;
        const onPath = pathNodeIdsRef.current.has(id);
        node.setAttribute("role", "button");
        node.setAttribute("tabindex", "0");
        const label = node
          .querySelector(".pele-label")
          ?.textContent?.replace(/\s+/gu, " ")
          .trim();
        node.setAttribute("aria-label", label || id);
        node.setAttribute("aria-pressed", String(selected));
        if (onPath) node.setAttribute("aria-current", "step");
        else node.removeAttribute("aria-current");
        node.style.cursor = "pointer";
        const shape = node.querySelector<SVGElement>("rect, polygon, circle");
        if (!shape) return;
        shape.style.stroke = selected
          ? "var(--primary)"
          : onPath
            ? "var(--primary)"
            : "var(--border)";
        shape.style.strokeWidth = selected ? "3px" : onPath ? "2px" : "1px";
        shape.style.fill = selected
          ? "color-mix(in srgb, var(--primary) 18%, var(--card))"
          : onPath
            ? "color-mix(in srgb, var(--primary) 10%, var(--card))"
            : "var(--card)";
      });

      svg.querySelectorAll<SVGGElement>(".pele-edge").forEach((edge) => {
        const endpoints = edgeEndpointsById.get(edge.dataset.id ?? "");
        if (!endpoints) return;
        const active = pathEdgeKeysRef.current.has(
          `${endpoints.from}\u0000${endpoints.to}`,
        );
        const stroke = active ? "var(--primary)" : "var(--muted-foreground)";
        edge.style.opacity =
          pathNodeIdsRef.current.size === 0 || active ? "1" : "0.28";
        edge.style.stroke = stroke;
        edge.style.strokeWidth = active ? "2.5px" : "1px";
        edge.querySelectorAll<SVGElement>(".pele-marker").forEach((marker) => {
          marker.style.fill = stroke;
        });
      });
    };
    decorateRef.current = decorate;

    const selectNode = (id: string | null) => {
      if (!id) return;
      const nextId = activeIdRef.current === id ? null : id;
      activeIdRef.current = nextId;
      setSelection(nextId ? { source: chart.source, id: nextId } : null);
      decorate();
    };
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const renderedId = target.closest<SVGGElement>(".pele-node")?.dataset.id;
      selectNode(renderedId ?? null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const current = target.closest<SVGGElement>(".pele-node");
      if (!current) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(current.dataset.id ?? null);
        return;
      }

      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowUp"
      )
        return;
      event.preventDefault();
      const nodes = Array.from(
        host.querySelectorAll<SVGGElement>(".pele-node"),
      );
      const index = nodes.indexOf(current);
      const delta =
        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      nodes[(index + delta + nodes.length) % nodes.length]?.focus();
    };

    const diagram = mount(host, chart.source, {
      autoDirection: true,
      fontSize: 14,
      idPrefix,
      images: false,
      links: false,
      limit: MAX_FLOWCHART_SOURCE_LENGTH,
      maxEdges: MAX_FLOWCHART_EDGES,
      outputLimit: 120_000,
      responsive: false,
      onError(error) {
        setRenderFailure({
          source: chart.source,
          message: error instanceof Error ? error.message : String(error),
        });
      },
      onRender() {
        decorate();
      },
      zoom: "auto",
    });
    host.addEventListener("click", handleClick);
    host.addEventListener("keydown", handleKeyDown);

    return () => {
      host.removeEventListener("click", handleClick);
      host.removeEventListener("keydown", handleKeyDown);
      diagram.destroy();
      host.replaceChildren();
      decorateRef.current = null;
    };
  }, [chart, idPrefix, model]);

  if (!validation.success) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Flowchart unavailable:{" "}
        {validation.error.issues[0]?.message ?? "Invalid flowchart data."}
      </p>
    );
  }

  const validChart = validation.data;
  const activeDetail = activeId ? validChart.details[activeId] : undefined;
  const showDetail = Boolean(activeDetail?.body.trim());

  return (
    <section
      className="blueprint-interactive-flowchart my-6 min-w-0 space-y-3"
      aria-label="Interactive flowchart"
    >
      {validChart.paths && validChart.paths.length > 0 && (
        <label className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
          <span>Highlight path</span>
          <select
            aria-label="Highlight path"
            className="max-w-full min-w-0 rounded-md border border-border bg-background px-2 py-1 text-foreground"
            value={activePathId}
            onChange={(event) => setActivePathId(event.currentTarget.value)}
          >
            <option value="">All paths</option>
            {validChart.paths.map((path) => (
              <option key={path.id} value={path.id}>
                {path.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card p-3">
        <div
          ref={hostRef}
          className="min-h-40 w-full min-w-0 [&_.pele]:mx-auto [&_.pele]:max-w-none [&_.pele-node:focus-visible]:outline [&_.pele-node:focus-visible]:outline-2 [&_.pele-node:focus-visible]:outline-offset-4 [&_.pele-node:focus-visible]:outline-primary [&_.pele-node:hover_circle]:stroke-primary [&_.pele-node:hover_polygon]:stroke-primary [&_.pele-node:hover_rect]:stroke-primary"
          style={
            {
              "--pele-bg": "var(--background)",
              "--pele-fg": "var(--foreground)",
              "--pele-muted": "var(--muted-foreground)",
              "--pele-line": "var(--foreground)",
              "--pele-surface": "var(--card)",
              "--pele-surface-alt": "var(--muted)",
              "--pele-border": "var(--border)",
              "--pele-accent": "var(--primary)",
            } as React.CSSProperties
          }
        />
        {renderError && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            Flowchart render error: {renderError}
          </p>
        )}
      </div>
      {showDetail && activeDetail && (
        <aside className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <strong>{activeDetail.title}</strong>
          <p className="mt-1">{renderInline(activeDetail.body)}</p>
        </aside>
      )}
    </section>
  );
}
