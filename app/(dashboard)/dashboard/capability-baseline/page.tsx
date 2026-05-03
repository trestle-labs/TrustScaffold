import type { Route } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { ensureCapabilityBaselineSnapshots } from '@/lib/dashboard/capability-baseline';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  metricPanelSurfaceClassName,
  mutedInsetSurfaceClassName,
  nestedPanelSurfaceClassName,
  warningPanelSurfaceClassName,
} from '@/lib/ui/card-surfaces';
import { cn } from '@/lib/utils';
import { wizardSchema } from '@trestle-labs/core';

export default async function CapabilityBaselinePage() {
  const context = await getDashboardContext();

  if (!context?.organization) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: docs, error: docsError }, { data: draft, error: draftError }] = await Promise.all([
    supabase
      .from('generated_docs')
      .select('id, status, updated_at')
      .eq('organization_id', context.organization.id),
    supabase
      .from('wizard_drafts')
      .select('updated_at, payload')
      .eq('organization_id', context.organization.id)
      .maybeSingle(),
  ]);

  if (docsError) {
    throw new Error(`Unable to load generated docs for capability baseline: ${docsError.message}`);
  }

  if (draftError) {
    throw new Error(`Unable to load wizard draft for capability baseline: ${draftError.message}`);
  }

  const parsedDraft = draft?.payload ? wizardSchema.safeParse(draft.payload) : null;
  if (!parsedDraft?.success) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Capability baseline detail</CardTitle>
            <CardDescription>
              TrustScaffold will generate a Learn / Align / Perform / Review baseline after a wizard draft exists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState className="p-5">
              <p className="font-semibold text-foreground">No capability baseline yet</p>
              <p className="mt-1">Save a wizard draft first, then this page will show scoring history, rationale, and owner guidance.</p>
              <Button asChild className="mt-3">
                <Link href={'/wizard' as Route}>Open wizard</Link>
              </Button>
            </EmptyState>
          </CardContent>
        </Card>
      </div>
    );
  }

  const draftUpdatedAt = draft?.updated_at ?? null;
  const draftUpdatedAtDate = draftUpdatedAt ? new Date(draftUpdatedAt) : null;
  const staleDocCount = draftUpdatedAtDate && docs
    ? docs.filter((doc) => doc.status !== 'archived' && new Date(doc.updated_at) < draftUpdatedAtDate).length
    : 0;

  const capabilityState = await ensureCapabilityBaselineSnapshots({
    supabase,
    organizationId: context.organization.id,
    wizardData: parsedDraft.data,
    draftUpdatedAt,
    docs: docs ?? [],
    staleDocCount,
  });

  const currentSnapshot = capabilityState.snapshots[0] ?? null;
  const previousSnapshot = capabilityState.snapshots[1] ?? null;
  const scoreDelta = currentSnapshot && previousSnapshot
    ? currentSnapshot.model.overallScore - previousSnapshot.model.overallScore
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Capability baseline detail</CardTitle>
            <Badge variant="secondary">Organization-specific OCEG baseline</Badge>
          </div>
          <CardDescription>
            This page turns the Learn / Align / Perform / Review model into a current operating baseline with history, rationale, and ownership guidance. It is designed to support management judgment and prioritization, not to claim audit readiness by itself.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className={metricPanelSurfaceClassName}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Overall baseline</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{capabilityState.model.overallScore}%</p>
            <p className="mt-1 text-xs text-muted-foreground">{capabilityState.model.overallBand} operating baseline</p>
          </div>
          <div className={metricPanelSurfaceClassName}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Trend since prior snapshot</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{scoreDelta === null ? 'New' : `${scoreDelta >= 0 ? '+' : ''}${scoreDelta}`}</p>
            <p className="mt-1 text-xs text-muted-foreground">Compared with the previous persisted baseline snapshot</p>
          </div>
          <div className={metricPanelSurfaceClassName}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Snapshot history</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{capabilityState.snapshots.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Recent baseline captures stored in the append-only audit log</p>
          </div>
          <div className={metricPanelSurfaceClassName}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current draft anchor</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{draftUpdatedAt ? new Date(draftUpdatedAt).toLocaleString() : 'Unknown'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Current snapshots are captured against the latest wizard draft and artifact state</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Priority assignments</CardTitle>
            <CardDescription>
              Ownership should be assigned by authority, not convenience. These are suggested governance owners for the current highest-value moves. Alignment and review work need executive or approver authority; perform work should be delegated to the teams that actually run the controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {capabilityState.model.priorities.map((priority) => (
              <div key={priority.title} className={cn(nestedPanelSurfaceClassName, 'space-y-3')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{priority.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{priority.detail}</p>
                  </div>
                  <Badge variant="secondary">{priority.areaLabel}</Badge>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <div className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recommended owner</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{priority.recommendedOwnerRole}</p>
                  </div>
                  <div className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Who makes the assignment</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{priority.assignmentAuthority}</p>
                  </div>
                </div>
                <div className={warningPanelSurfaceClassName}>
                  <p className="text-xs text-current/90">{priority.assignmentRationale}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment model</CardTitle>
            <CardDescription>
              A practical way to think about who should own the next move and who has the authority to make that assignment inside TrustScaffold.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className={metricPanelSurfaceClassName}>
              <p className="font-semibold text-foreground">1. Executive authority sets alignment and review ownership</p>
              <p className="mt-1">Founder / CEO, executive sponsor, or designated approver should assign work that changes scope, readiness, risk posture, or audit-facing review commitments.</p>
            </div>
            <div className={metricPanelSurfaceClassName}>
              <p className="font-semibold text-foreground">2. Program ownership coordinates execution</p>
              <p className="mt-1">The security or compliance program owner should break execution into function-owned tasks and assign Engineering, IT, HR, or Operations leads where the evidence is actually produced.</p>
            </div>
            <div className={metricPanelSurfaceClassName}>
              <p className="font-semibold text-foreground">3. Review owners should not be the only execution owners</p>
              <p className="mt-1">When possible, the person approving or reviewing control health should not be the sole person executing that same work. TrustScaffold’s model is strongest when execution and review are separated by role.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Area detail</CardTitle>
          <CardDescription>
            Deeper recommendations and framework-aware rationale for each OCEG area.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          {capabilityState.model.areas.map((area) => (
            <div key={area.key} className={cn(nestedPanelSurfaceClassName, 'space-y-3')}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{area.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{area.summary}</p>
                </div>
                <Badge variant="secondary">{area.score}%</Badge>
              </div>
              <div className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Why this score matters here</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {area.rationale.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current strengths</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {area.strengths.map((strength) => (
                      <li key={strength}>- {strength}</li>
                    ))}
                  </ul>
                </div>
                <div className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Highest-value gaps</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {area.gaps.map((gap) => (
                      <li key={gap}>- {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Snapshot history</CardTitle>
          <CardDescription>
            Persisted capability baselines captured from the current organization state over time so teams can see whether operating discipline is improving, stalling, or drifting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {capabilityState.snapshots.map((snapshot, index) => {
            const previous = capabilityState.snapshots[index + 1] ?? null;
            const delta = previous ? snapshot.model.overallScore - previous.model.overallScore : null;

            return (
              <div key={snapshot.id} className={cn(nestedPanelSurfaceClassName, 'space-y-3')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{new Date(snapshot.createdAt).toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Draft anchor: {snapshot.sourceDraftUpdatedAt ? new Date(snapshot.sourceDraftUpdatedAt).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Overall {snapshot.model.overallScore}%</Badge>
                    <Badge variant="outline">{delta === null ? 'Baseline' : `${delta >= 0 ? '+' : ''}${delta} vs previous`}</Badge>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  {snapshot.model.areas.map((area) => (
                    <div key={`${snapshot.id}-${area.key}`} className={cn(mutedInsetSurfaceClassName, 'border border-border')}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{area.label}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{area.score}%</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{area.band}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={'/dashboard' as Route}>Back to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={'/wizard' as Route}>Update wizard answers</Link>
        </Button>
      </div>
    </div>
  );
}
