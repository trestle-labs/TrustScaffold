'use client';

import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ControlMapEdge, ControlMapGraph, ControlMapNode } from '@trestle-labs/core';
import { cn } from '@/lib/utils';

type Props = {
  graph: ControlMapGraph;
};

type StageOption = 'All' | string;

const nodeTypeOrder: ControlMapNode['type'][] = ['answer', 'framework', 'control', 'subservice', 'document'];

const nodeTypeLabel: Record<ControlMapNode['type'], string> = {
  answer: 'Answers',
  framework: 'Frameworks',
  control: 'Controls',
  subservice: 'Sub-service Orgs',
  document: 'Generated Docs',
};

const nodeTypeClasses: Record<ControlMapNode['type'], string> = {
  answer: 'border-blue-200 bg-blue-50',
  framework: 'border-violet-200 bg-violet-50',
  control: 'border-emerald-200 bg-emerald-50',
  subservice: 'border-amber-200 bg-amber-50',
  document: 'border-slate-200 bg-slate-50',
};

function edgeKey(edge: ControlMapEdge) {
  return `${edge.from}->${edge.to}:${edge.label}`;
}

export function ControlMapCanvas({ graph }: Props) {
  const [activeStage, setActiveStage] = useState<StageOption>('All');

  const nodeById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes]);

  const stageOptions = useMemo(() => {
    const stages = new Set<string>();

    graph.nodes.forEach((node) => {
      stages.add(node.stage);
    });

    return ['All', ...Array.from(stages).sort()];
  }, [graph.nodes]);

  const filteredEdges = useMemo(() => {
    if (activeStage === 'All') {
      return graph.edges;
    }

    return graph.edges.filter((edge) => {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      return from?.stage === activeStage || to?.stage === activeStage;
    });
  }, [activeStage, graph.edges, nodeById]);

  const visibleNodeIds = useMemo(() => {
    if (activeStage === 'All') {
      return new Set(graph.nodes.map((node) => node.id));
    }

    const ids = new Set<string>();
    filteredEdges.forEach((edge) => {
      ids.add(edge.from);
      ids.add(edge.to);
    });

    graph.nodes
      .filter((node) => node.stage === activeStage)
      .forEach((node) => ids.add(node.id));

    return ids;
  }, [activeStage, filteredEdges, graph.nodes]);

  const visibleNodes = useMemo(
    () => graph.nodes.filter((node) => visibleNodeIds.has(node.id)),
    [graph.nodes, visibleNodeIds],
  );

  const nodeColumns = useMemo(() => {
    return nodeTypeOrder.map((type) => ({
      type,
      nodes: visibleNodes.filter((node) => node.type === type),
    }));
  }, [visibleNodes]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Map Lens</CardTitle>
          <CardDescription>
            Filter the relationship map by stage to understand how one area of answers affects frameworks, controls, sub-service organizations, and generated documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {stageOptions.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(stage)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                activeStage === stage
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-secondary',
              )}
            >
              {stage}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-3 xl:grid-cols-5">
        {nodeColumns.map((column) => (
          <Card key={column.type}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{nodeTypeLabel[column.type]}</CardTitle>
              <CardDescription>{column.nodes.length} visible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {column.nodes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No nodes in this lens.</p>
              ) : (
                column.nodes.map((node) => (
                  <div key={node.id} className={cn('rounded-xl border p-2', nodeTypeClasses[node.type])}>
                    <p className="text-xs font-semibold text-foreground">{node.label}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{node.stage}</p>
                    {node.description ? <p className="mt-1 text-[11px] text-muted-foreground">{node.description}</p> : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Paths</CardTitle>
          <CardDescription>
            Read these as directional paths: source node {'->'} target node with the reason for the connection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredEdges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No relationships match this lens yet.</p>
          ) : (
            filteredEdges.map((edge) => {
              const from = nodeById.get(edge.from);
              const to = nodeById.get(edge.to);

              if (!from || !to) {
                return null;
              }

              return (
                <div key={edgeKey(edge)} className="rounded-xl border border-border bg-secondary/20 px-3 py-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{from.type}</Badge>
                    <span className="font-medium text-foreground">{from.label}</span>
                    <span className="text-muted-foreground">-&gt;</span>
                    <Badge variant="secondary">{to.type}</Badge>
                    <span className="font-medium text-foreground">{to.label}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{edge.label}</p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
