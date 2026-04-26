import { acronymGlossary } from '@/lib/acronyms';

export type GlossaryEntry = {
  term: string;
  definition: string;
};

const domainDefinitions: GlossaryEntry[] = [
  {
    term: 'Approved document',
    definition: 'A generated document version that has passed review and is marked as export-eligible.',
  },
  {
    term: 'Archived document',
    definition: 'A document version moved out of active review/export workflows.',
  },
  {
    term: 'Carve-out',
    definition: 'An audit reporting model where certain controls are excluded from your report and covered by a vendor report.',
  },
  {
    term: 'Control environment',
    definition: 'The overall set of governance, security, and operational controls that shape compliance posture.',
  },
  {
    term: 'Decision trace',
    definition: 'A rule-driven explanation of why warnings, recommendations, or deep-dive questions were shown in the wizard.',
  },
  {
    term: 'Draft document',
    definition: 'A generated policy artifact pending reviewer decision (approve, reject, or archive).',
  },
  {
    term: 'Evidence artifact',
    definition: 'A collected technical or procedural record used to support control operation during audit review.',
  },
  {
    term: 'Inclusive',
    definition: 'An audit reporting model where applicable controls are tested directly in your report scope.',
  },
  {
    term: 'Subservice organization',
    definition: 'A third-party provider your system relies on for infrastructure or control operations.',
  },
  {
    term: 'System Description',
    definition: 'A formal narrative defining what your system does, its boundaries, and related control context for the audit.',
  },
  {
    term: 'Template payload',
    definition: 'Structured wizard data passed into document templates during generation and regeneration.',
  },
  {
    term: 'Wizard draft',
    definition: 'The saved in-progress organization profile and control answers captured in the policy wizard.',
  },
];

const acronymEntries: GlossaryEntry[] = acronymGlossary.map((item) => ({
  term: item.shortForm,
  definition: item.longForm,
}));

export const glossaryEntries: GlossaryEntry[] = [...acronymEntries, ...domainDefinitions]
  .filter((entry, index, list) => list.findIndex((candidate) => candidate.term.toLowerCase() === entry.term.toLowerCase()) === index)
  .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
