export type GeneratedDocStatus = 'draft' | 'approved' | 'archived';

import { formatDisplayLabel } from '@/lib/utils';

type StatusBadgeVariant = 'warning' | 'success' | 'neutral';

type StatusDisplay = {
  badgeVariant: StatusBadgeVariant;
  actionLabel: string;
  cardClassName: string;
  summaryText: string;
};

type SectionDisplay = {
  id: string;
  title: string;
  description: string;
  wrapperClassName: string;
  countVariant: StatusBadgeVariant;
};

const STATUS_DISPLAY: Record<GeneratedDocStatus, StatusDisplay> = {
  draft: {
    badgeVariant: 'warning',
    actionLabel: 'Review and approve',
    cardClassName: 'border-border bg-card',
    summaryText: 'Review the rendered document, then approve or archive it.',
  },
  approved: {
    badgeVariant: 'success',
    actionLabel: 'View approved document',
    cardClassName: 'border-emerald-200 bg-emerald-50/55 dark:border-emerald-900 dark:bg-emerald-950/20',
    summaryText: 'Approved and eligible for export.',
  },
  archived: {
    badgeVariant: 'neutral',
    actionLabel: 'View archived document',
    cardClassName: 'border-slate-200 bg-slate-50/70 opacity-80 dark:border-slate-800 dark:bg-slate-950/20',
    summaryText: 'Archived and excluded from active export.',
  },
};

export const GENERATED_DOC_SECTIONS: Record<GeneratedDocStatus, SectionDisplay> = {
  draft: {
    id: 'drafts',
    title: 'Drafts Awaiting Review',
    description: 'Open a draft to inspect, approve, regenerate, or archive it. Raw Markdown is collapsed so the list stays easy to scan.',
    wrapperClassName: 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/15',
    countVariant: 'warning',
  },
  approved: {
    id: 'approved',
    title: 'Approved For Export',
    description: 'Approved documents are locked for export and shown separately from drafts.',
    wrapperClassName: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/15',
    countVariant: 'success',
  },
  archived: {
    id: 'archived',
    title: 'Archived Documents',
    description: 'Archived documents are excluded from active review and export.',
    wrapperClassName: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/20',
    countVariant: 'neutral',
  },
};

export function isGeneratedDocStatus(status: string): status is GeneratedDocStatus {
  return status === 'draft' || status === 'approved' || status === 'archived';
}

export function getGeneratedDocStatusDisplay(status: string): StatusDisplay {
  if (isGeneratedDocStatus(status)) {
    return STATUS_DISPLAY[status];
  }

  return STATUS_DISPLAY.draft;
}

export function getGeneratedDocStatusLabel(status: string): string {
  return formatDisplayLabel(status);
}
