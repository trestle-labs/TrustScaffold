import Link from 'next/link';

import { ControlMapCanvas } from '@/components/wizard/control-map-canvas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { buildControlMapGraph } from '@trestle-labs/core';
import { mergeWizardData } from '@trestle-labs/core';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { wizardSchema } from '@trestle-labs/core';

export default async function ControlMapPage() {
  const context = await getDashboardContext();

  if (!context?.organization) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: draft }, { data: docs }] = await Promise.all([
    supabase
      .from('wizard_drafts')
      .select('payload, updated_at')
      .eq('organization_id', context.organization.id)
      .maybeSingle(),
    supabase
      .from('generated_docs')
      .select('id, title, status')
      .eq('organization_id', context.organization.id)
      .order('updated_at', { ascending: false }),
  ]);

  const parsedDraft = draft?.payload ? wizardSchema.safeParse(draft.payload) : null;

  if (!parsedDraft?.success) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Control Relationship Map</CardTitle>
            <CardDescription>
              This visual map is built from your saved wizard answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              No saved wizard draft is available yet. Complete and save the wizard first, then this page will show how your answers map to frameworks, controls, sub-service organizations, and generated documents.
            </p>
            <Button asChild>
              <Link href="/wizard">Open Policy Wizard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const graph = buildControlMapGraph(mergeWizardData(parsedDraft.data), docs ?? []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Control Relationship Map</CardTitle>
            <Badge variant="secondary">Visual Dependency View</Badge>
          </div>
          <CardDescription>
            Built from the current wizard draft and generated documents. Use this map to explain why controls appear, where sub-service organizations affect scope, and which outputs inherit each decision.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Nodes: {graph.nodes.length}</Badge>
          <Badge variant="outline">Paths: {graph.edges.length}</Badge>
          {draft?.updated_at ? <Badge variant="outline">Draft updated: {new Date(draft.updated_at).toLocaleString()}</Badge> : null}
        </CardContent>
      </Card>

      <ControlMapCanvas graph={graph} />
    </div>
  );
}
