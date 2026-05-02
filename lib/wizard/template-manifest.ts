import type { WizardData } from './schema';
import { selectedCriteriaCodes } from './schema';
import { documentGenerationRules } from './document-generation-rules';

export interface TemplateManifestEntry {
  slug: string;
  name: string;
  tsc: string;
  criteriaHint: string;
  description: string;
}

export function getExpectedTemplates(selections: WizardData['tscSelections'] | WizardData): TemplateManifestEntry[] {
  const hasWizardContext = 'scope' in selections && 'tscSelections' in selections;
  const criteria = hasWizardContext ? new Set(selectedCriteriaCodes(selections)) : null;
  const tscSelections = hasWizardContext ? selections.tscSelections : selections;
  const includeIso27001 = hasWizardContext ? selections.governance.iso27001.targeted : false;

  return documentGenerationRules
    .filter((rule) => {
      if (!criteria) {
        return rule.scope === 'security' || rule.scope === 'common' || (rule.scope === 'iso27001' && includeIso27001)
          || ((rule.scope === 'availability' || rule.scope === 'confidentiality' || rule.scope === 'processingIntegrity' || rule.scope === 'privacy')
            && tscSelections[rule.scope] === true);
      }

      return rule.criteriaMapped.some((criterion) => criteria.has(criterion));
    })
    .map((rule) => ({
      slug: rule.slug,
    name: rule.name,
    tsc: rule.tsc,
    criteriaHint: rule.criteriaHint,
    description: rule.description,
    }));
}
