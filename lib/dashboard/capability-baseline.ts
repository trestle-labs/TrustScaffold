import 'server-only';

import type { CapabilityBaselineModel, WizardData } from '@trestle-labs/core';
import { buildCapabilityBaselineModel } from '@trestle-labs/core';
import type { SupabaseClient } from '@supabase/supabase-js';

type CapabilitySnapshotDetails = {
  baseline_signature: string;
  baseline: CapabilityBaselineModel;
  source_draft_updated_at: string | null;
  source_active_doc_count: number;
  source_approved_doc_count: number;
  source_stale_doc_count: number;
};

type AuditLogRow = {
  id: string;
  actor_user_id: string | null;
  details: unknown;
  created_at: string;
};

export type CapabilityBaselineSnapshot = {
  id: string;
  actorUserId: string | null;
  createdAt: string;
  signature: string;
  sourceDraftUpdatedAt: string | null;
  activeDocCount: number;
  approvedDocCount: number;
  staleDocCount: number;
  model: CapabilityBaselineModel;
};

function buildSnapshotDetails({
  model,
  draftUpdatedAt,
  activeDocCount,
  approvedDocCount,
  staleDocCount,
}: {
  model: CapabilityBaselineModel;
  draftUpdatedAt: string | null;
  activeDocCount: number;
  approvedDocCount: number;
  staleDocCount: number;
}): CapabilitySnapshotDetails {
  const snapshotCore = {
    sourceDraftUpdatedAt: draftUpdatedAt,
    activeDocCount,
    approvedDocCount,
    staleDocCount,
    overallScore: model.overallScore,
    overallBand: model.overallBand,
    areas: model.areas.map((area) => ({
      key: area.key,
      score: area.score,
      band: area.band,
      nextMove: area.nextMove,
    })),
    priorities: model.priorities.map((priority) => ({
      areaKey: priority.areaKey,
      title: priority.title,
      recommendedOwnerRole: priority.recommendedOwnerRole,
      assignmentAuthority: priority.assignmentAuthority,
    })),
  };

  return {
    baseline_signature: JSON.stringify(snapshotCore),
    baseline: model,
    source_draft_updated_at: draftUpdatedAt,
    source_active_doc_count: activeDocCount,
    source_approved_doc_count: approvedDocCount,
    source_stale_doc_count: staleDocCount,
  };
}

function parseSnapshot(row: AuditLogRow): CapabilityBaselineSnapshot | null {
  if (!row.details || typeof row.details !== 'object') {
    return null;
  }

  const details = row.details as Partial<CapabilitySnapshotDetails>;

  if (!details.baseline || typeof details.baseline !== 'object') {
    return null;
  }

  if (typeof details.baseline_signature !== 'string') {
    return null;
  }

  return {
    id: row.id,
    actorUserId: row.actor_user_id,
    createdAt: row.created_at,
    signature: details.baseline_signature,
    sourceDraftUpdatedAt: typeof details.source_draft_updated_at === 'string' ? details.source_draft_updated_at : null,
    activeDocCount: typeof details.source_active_doc_count === 'number' ? details.source_active_doc_count : 0,
    approvedDocCount: typeof details.source_approved_doc_count === 'number' ? details.source_approved_doc_count : 0,
    staleDocCount: typeof details.source_stale_doc_count === 'number' ? details.source_stale_doc_count : 0,
    model: details.baseline as CapabilityBaselineModel,
  };
}

export async function ensureCapabilityBaselineSnapshots({
  supabase,
  organizationId,
  wizardData,
  draftUpdatedAt,
  docs,
  staleDocCount,
}: {
  supabase: SupabaseClient;
  organizationId: string;
  wizardData: WizardData;
  draftUpdatedAt: string | null;
  docs: Array<{ status: string }>;
  staleDocCount: number;
}) {
  const model = buildCapabilityBaselineModel(wizardData, { docs, staleDocCount });
  const activeDocCount = docs.filter((doc) => doc.status !== 'archived').length;
  const approvedDocCount = docs.filter((doc) => doc.status === 'approved').length;
  const currentDetails = buildSnapshotDetails({
    model,
    draftUpdatedAt,
    activeDocCount,
    approvedDocCount,
    staleDocCount,
  });

  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, actor_user_id, details, created_at')
    .eq('organization_id', organizationId)
    .eq('action', 'capability_baseline.snapshot')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(`Unable to load capability baseline history: ${error.message}`);
  }

  const snapshots = (data ?? [])
    .map((row) => parseSnapshot(row as AuditLogRow))
    .filter(Boolean) as CapabilityBaselineSnapshot[];

  if (snapshots[0]?.signature === currentDetails.baseline_signature) {
    return { model, snapshots };
  }

  const { data: snapshotId, error: appendError } = await supabase.rpc('append_audit_log', {
    p_organization_id: organizationId,
    p_action: 'capability_baseline.snapshot',
    p_entity_type: 'capability_baseline',
    p_entity_id: null,
    p_details: currentDetails,
  });

  if (appendError) {
    throw new Error(`Unable to persist capability baseline snapshot: ${appendError.message}`);
  }

  const currentSnapshot: CapabilityBaselineSnapshot = {
    id: typeof snapshotId === 'string' ? snapshotId : 'current',
    actorUserId: null,
    createdAt: new Date().toISOString(),
    signature: currentDetails.baseline_signature,
    sourceDraftUpdatedAt: currentDetails.source_draft_updated_at,
    activeDocCount,
    approvedDocCount,
    staleDocCount,
    model,
  };

  return {
    model,
    snapshots: [currentSnapshot, ...snapshots].slice(0, 12),
  };
}
