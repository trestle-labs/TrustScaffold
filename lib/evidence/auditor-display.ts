import type { EvidenceStatus, RevisionSource } from '@/lib/types';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'info' | 'success' | 'warning' | 'neutral' | 'danger';

const REVISION_SOURCE_LABELS: Record<RevisionSource, string> = {
  generated: 'Drafted by System',
  reviewer_edited: 'Edited by Reviewer',
  approved: 'Approved by Admin',
  exported: 'Exported to Git',
  merged: 'Merged in GitHub',
};

const REVISION_SOURCE_BADGE_VARIANTS: Record<RevisionSource, BadgeVariant> = {
  generated: 'info',
  reviewer_edited: 'warning',
  approved: 'success',
  exported: 'default',
  merged: 'secondary',
};

const EVIDENCE_STATUS_BADGE_VARIANTS: Record<EvidenceStatus, BadgeVariant> = {
  PASS: 'success',
  FAIL: 'danger',
  ERROR: 'warning',
  UNKNOWN: 'neutral',
};

export function getRevisionSourceLabel(source: string): string {
  return REVISION_SOURCE_LABELS[source as RevisionSource] ?? source;
}

export function getRevisionSourceBadgeVariant(source: string): BadgeVariant {
  return REVISION_SOURCE_BADGE_VARIANTS[source as RevisionSource] ?? 'neutral';
}

export function getEvidenceStatusBadgeVariant(status: string): BadgeVariant {
  return EVIDENCE_STATUS_BADGE_VARIANTS[status as EvidenceStatus] ?? 'neutral';
}
