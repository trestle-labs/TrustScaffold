import type { WizardData } from './schema';
import { getSelectedDocumentGenerationRules } from './document-generation-rules';

export interface TemplateManifestEntry {
  name: string;
  tsc: string;
  criteriaHint: string;
  description: string;
}

export function getExpectedTemplates(selections: WizardData['tscSelections'] | WizardData): TemplateManifestEntry[] {
  return getSelectedDocumentGenerationRules(selections).map((rule) => ({
    name: rule.name,
    tsc: rule.tsc,
    criteriaHint: rule.criteriaHint,
    description: rule.description,
  }));
}
