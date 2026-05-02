import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { renderTemplate } from '@/lib/documents/template-engine';
import { buildTemplatePayload } from '@/lib/wizard/template-payload';
import { defaultWizardValues, type WizardData } from '@/lib/wizard/schema';
import { getActiveWizardRules } from '@/lib/wizard/rule-matrix';

type WizardDataOverrides = {
  [K in keyof WizardData]?: WizardData[K] extends unknown[] ? WizardData[K] : Partial<WizardData[K]>;
};

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(haystack: string, needle: string, message: string) {
  assert(haystack.includes(needle), `${message}: expected output to include "${needle}"`);
}

function makeWizardData(overrides: WizardDataOverrides): WizardData {
  return {
    ...defaultWizardValues,
    company: { ...defaultWizardValues.company, ...overrides.company },
    governance: { ...defaultWizardValues.governance, ...overrides.governance },
    training: { ...defaultWizardValues.training, ...overrides.training },
    scope: { ...defaultWizardValues.scope, ...overrides.scope },
    tscSelections: { ...defaultWizardValues.tscSelections, ...overrides.tscSelections },
    infrastructure: { ...defaultWizardValues.infrastructure, ...overrides.infrastructure },
    subservices: overrides.subservices ?? defaultWizardValues.subservices,
    securityTooling: { ...defaultWizardValues.securityTooling, ...overrides.securityTooling },
    operations: { ...defaultWizardValues.operations, ...overrides.operations },
    securityAssessment: {
      ...defaultWizardValues.securityAssessment,
      ...overrides.securityAssessment,
    },
  };
}

function extractTemplate(seedSql: string, slug: string): string {
  const marker = `\n    '${slug}',`;
  const slugIndex = seedSql.indexOf(marker);
  assert(slugIndex >= 0, `Could not find template slug ${slug} in seed.sql`);

  const templateStart = seedSql.indexOf('$$---', slugIndex);
  assert(templateStart >= 0, `Could not find markdown template start for ${slug}`);

  const templateEnd = seedSql.indexOf('$$,', templateStart);
  assert(templateEnd >= 0, `Could not find markdown template end for ${slug}`);

  return seedSql.slice(templateStart + 2, templateEnd);
}

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

const seedSql = readFileSync(resolve(process.cwd(), 'supabase/seed.sql'), 'utf8');
const systemDescriptionTemplate = extractTemplate(seedSql, 'system-description');
const privacyTemplate = extractTemplate(seedSql, 'privacy-notice-consent-policy');
const dataClassificationTemplate = extractTemplate(seedSql, 'data-classification-handling-policy');
const pciTokenizationTemplate = extractTemplate(seedSql, 'tokenization-cardholder-data-policy');

run('Bundle J smoke path surfaces PHI review state and generated PHI language', () => {
  const data = makeWizardData({
    company: {
      name: 'HealthCo',
      industry: 'Healthcare',
      complianceMaturity: 'some-experience',
      targetAuditType: 'type1',
    },
    scope: {
      systemName: 'HealthCo Portal',
      systemDescription: 'a healthcare workflow platform that stores regulated patient and member information',
      dataTypesHandled: ['Customer PII', 'Employee data', 'Authentication secrets'],
      containsPhi: true,
      hasCardholderDataEnvironment: false,
      hipaa: {
        ...defaultWizardValues.scope.hipaa,
        phiElements: ['name', 'dob', 'diagnosis-codes', 'insurance-info', 'medication', 'lab-results'],
      },
    },
    tscSelections: {
      security: true,
      privacy: true,
      confidentiality: true,
      availability: false,
      processingIntegrity: false,
    },
  });

  const rules = getActiveWizardRules(data, 'review');
  assert(!rules.some((rule) => rule.id === 'review-privacy-scope-warning'), 'PHI path should not show privacy warning when Privacy TSC is selected');
  assert(data.scope.containsPhi, 'PHI field should remain true for the review source data');
  assert(!data.scope.hasCardholderDataEnvironment, 'CDE field should remain false for the review source data');

  const payload = buildTemplatePayload(data, { workspaceOrganizationName: data.company.name });
  const renderedSystem = renderTemplate(systemDescriptionTemplate, payload, 'system-description');
  const renderedPrivacy = renderTemplate(privacyTemplate, payload, 'privacy-notice-consent-policy');

  assertIncludes(renderedSystem, 'Protected health information (PHI) is identified as regulated data', 'system description PHI language');
  assertIncludes(renderedPrivacy, '## HIPAA Administrative Safeguards', 'privacy template HIPAA section heading');
  assertIncludes(renderedPrivacy, 'Access changes and terminations are coordinated through', 'privacy template HIPAA safeguard detail');
  assertIncludes(renderedPrivacy, 'handles protected health information', 'privacy template PHI language');
  assertIncludes(payload.phi_elements_text, 'Diagnosis codes', 'payload should retain selected PHI element labels');
});

run('Bundle K smoke path surfaces CDE review state and generated CDE language', () => {
  const data = makeWizardData({
    company: {
      name: 'PaymentsCo',
      industry: 'Financial Technology',
      complianceMaturity: 'some-experience',
      targetAuditType: 'type1',
    },
    scope: {
      systemName: 'PaymentsCo Checkout',
      systemDescription: 'a payment processing platform with a segmented cardholder data environment for checkout and settlement operations',
      dataTypesHandled: ['Payment data', 'Customer PII', 'Authentication secrets'],
      containsPhi: false,
      hasCardholderDataEnvironment: true,
      pci: {
        ...defaultWizardValues.scope.pci,
        cardholderDataElements: ['pan', 'cardholder-name', 'expiration-date', 'tokenized-pan'],
      },
    },
    tscSelections: {
      security: true,
      privacy: true,
      confidentiality: true,
      availability: false,
      processingIntegrity: false,
    },
  });

  const rules = getActiveWizardRules(data, 'review');
  assert(!rules.some((rule) => rule.id === 'review-cde-confidentiality-warning'), 'CDE path should not show confidentiality warning when Confidentiality TSC is selected');
  assert(!data.scope.containsPhi, 'PHI field should remain false for the review source data');
  assert(data.scope.hasCardholderDataEnvironment, 'CDE field should remain true for the review source data');

  const payload = buildTemplatePayload(data, { workspaceOrganizationName: data.company.name });
  const renderedSystem = renderTemplate(systemDescriptionTemplate, payload, 'system-description');
  const renderedClassification = renderTemplate(dataClassificationTemplate, payload, 'data-classification-handling-policy');
  const renderedPciTokenization = renderTemplate(pciTokenizationTemplate, payload, 'tokenization-cardholder-data-policy');

  assertIncludes(renderedSystem, 'cardholder data environment (CDE) is explicitly defined', 'system description CDE language');
  assertIncludes(renderedSystem, '### PCI Segmentation Responsibilities', 'system description PCI section heading');
  assertIncludes(renderedSystem, 'Changes affecting segmentation controls are reviewed through', 'system description PCI responsibility detail');
  assertIncludes(renderedClassification, 'operates an in-scope cardholder data environment (CDE)', 'data classification CDE language');
  assertIncludes(renderedPciTokenization, 'Cardholder data in scope: Primary account number (PAN), Cardholder name, Expiration date, and Tokenized PAN or network token', 'PCI tokenization template should reflect selected PCI data elements');
});

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}