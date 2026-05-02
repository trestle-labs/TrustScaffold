export const GLOSSARY_SOURCE_TYPE_LABELS: Record<string, string> = {
  'legal-dictionary': 'Legal Dictionary',
  'regulatory-guidance': 'Regulatory Guidance',
  'assurance-standard': 'Assurance Standard',
  internal: 'Internal',
};

export const GLOSSARY_STAGE_ORDER = [
  'Welcome',
  'Infrastructure',
  'System Scope',
  'Governance',
  'TSC Selection',
  'Security Assessment',
  'Security Tooling',
  'Operations',
  'Review',
  'Generate',
] as const;

export function getGlossarySourceTypeLabel(sourceType: string | undefined): string {
  if (!sourceType) {
    return 'Internal';
  }

  return GLOSSARY_SOURCE_TYPE_LABELS[sourceType] ?? sourceType;
}
