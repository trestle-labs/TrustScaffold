import { getExpectedTemplates } from '@/lib/wizard/template-manifest';
import { computeAssessmentSummary } from '@/lib/wizard/security-scoring';
import {
  businessModelOptions,
  complianceMaturityOptions,
  deliveryModelOptions,
  selectedCriteriaCodes,
  selectedTscLabels,
  soxApplicabilityOptions,
  type WizardData,
} from '@/lib/wizard/schema';

export type Severity = 'High' | 'Medium' | 'Low';

export type ReportFinding = {
  severity: Severity;
  title: string;
  detail: string;
  criteria: string[];
  remediation: string;
};

export type AuditReportDoc = {
  id: string;
  title: string;
  status: string;
  updated_at?: string;
};

export type AuditReportComparisonItem = {
  label: string;
  before: string;
  after: string;
};

export type AuditReportModel = {
  overallScore: number;
  overallScoreBand: string;
  selectedTsc: string[];
  selectedCriteria: string[];
  findings: ReportFinding[];
  openGaps: Array<{ domain: string; gap: string }>;
  expectedTemplateCount: number;
  assessment: ReturnType<typeof computeAssessmentSummary>;
  activeDocs: AuditReportDoc[];
  approvedDocCount: number;
  comparison: AuditReportComparisonItem[];
  companySummary: {
    name: string;
    contact: string;
    businessModel: string;
    deliveryModel: string;
    maturityLabel: string;
    soxLabel: string;
    systemName: string;
    phiInScope: boolean;
    cdeInScope: boolean;
  };
};

function optionLabel(options: ReadonlyArray<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function scoreLabel(score: number) {
  if (score >= 85) return 'Strong';
  if (score >= 65) return 'Developing';
  if (score >= 40) return 'Early';
  return 'Nascent';
}

export function buildFindings(data: WizardData, overallScore: number) {
  const findings: ReportFinding[] = [];

  if (!data.operations.requiresMfa) {
    findings.push({
      severity: 'High',
      title: 'MFA requirement not enforced across workforce access',
      detail: 'Operations answers indicate MFA is not universally required, which weakens identity assurance and privileged access controls.',
      criteria: ['CC6.1', 'CC6.2', 'CC6.3'],
      remediation: 'Enforce MFA through the primary identity provider for all interactive workforce access and administrative actions.',
    });
  }

  if (!data.operations.requiresPeerReview) {
    findings.push({
      severity: 'Medium',
      title: 'Peer review for production changes is not mandatory',
      detail: 'Change control posture relies on ad-hoc review paths, reducing assurance that changes are authorized and tested.',
      criteria: ['CC8.1', 'CC8.2'],
      remediation: 'Require at least one independent reviewer for production changes and preserve evidence in the ticketing system.',
    });
  }

  if (!data.operations.hasRiskRegister) {
    findings.push({
      severity: 'High',
      title: 'Risk register process is not established',
      detail: 'No formal risk register is declared, limiting management visibility and lifecycle tracking of known risks.',
      criteria: ['CC3.2', 'CC3.3', 'CC4.1'],
      remediation: 'Implement a risk register with owners, target dates, status cadence, and evidence links for mitigation actions.',
    });
  }

  if (!data.governance.hasInternalAuditProgram) {
    findings.push({
      severity: 'Medium',
      title: 'Internal control monitoring program is not formalized',
      detail: 'Governance responses indicate no dedicated internal audit cadence, increasing risk of control drift over time.',
      criteria: ['CC4.1', 'CC4.2'],
      remediation: 'Define a recurring control monitoring cadence with documented walkthroughs, exceptions, and remediation tracking.',
    });
  }

  if (data.scope.containsPhi && !data.company.websiteHasPrivacyNotice) {
    findings.push({
      severity: 'High',
      title: 'PHI-adjacent operations with weak outward privacy posture',
      detail: 'PHI is in scope, while public privacy disclosures are incomplete; this creates consistency and trust risks in external commitments.',
      criteria: ['HIPAA', 'P1.1', 'CC2.2'],
      remediation: 'Publish and maintain an accurate privacy notice aligned to healthcare data handling and request channels.',
    });
  }

  if (data.scope.hasCardholderDataEnvironment && !data.securityAssessment.networkAnalysis.hasNetworkSegmentation) {
    findings.push({
      severity: 'High',
      title: 'Cardholder scope declared without confirmed segmentation',
      detail: 'Cardholder data environment is in scope but network segmentation is not established in the security assessment.',
      criteria: ['PCI', 'CC6.1', 'CC6.6'],
      remediation: 'Document and enforce segmented boundaries for CDE systems with controlled ingress/egress and periodic validation.',
    });
  }

  if (overallScore < 50) {
    findings.push({
      severity: 'Medium',
      title: 'Overall control maturity is below audit-ready threshold',
      detail: 'Aggregate assessment scoring indicates foundational control implementation is still in early stages.',
      criteria: ['CC1-CC9'],
      remediation: 'Prioritize top control gaps by impact and complete evidence-backed implementation before formal audit scoping.',
    });
  }

  return findings;
}

function yesNo(value: boolean) {
  return value ? 'Yes' : 'No';
}

export function buildComparison(current: WizardData, previous?: WizardData | null): AuditReportComparisonItem[] {
  if (!previous) {
    return [];
  }

  const fields = [
    { label: 'Contains PHI', before: yesNo(previous.scope.containsPhi), after: yesNo(current.scope.containsPhi) },
    { label: 'Has Cardholder Data Environment', before: yesNo(previous.scope.hasCardholderDataEnvironment), after: yesNo(current.scope.hasCardholderDataEnvironment) },
    { label: 'MFA Required', before: yesNo(previous.operations.requiresMfa), after: yesNo(current.operations.requiresMfa) },
    { label: 'Peer Review Required', before: yesNo(previous.operations.requiresPeerReview), after: yesNo(current.operations.requiresPeerReview) },
    { label: 'Risk Register', before: yesNo(previous.operations.hasRiskRegister), after: yesNo(current.operations.hasRiskRegister) },
    { label: 'Internal Audit Program', before: yesNo(previous.governance.hasInternalAuditProgram), after: yesNo(current.governance.hasInternalAuditProgram) },
    { label: 'Privacy TSC Selected', before: yesNo(previous.tscSelections.privacy), after: yesNo(current.tscSelections.privacy) },
    { label: 'Availability TSC Selected', before: yesNo(previous.tscSelections.availability), after: yesNo(current.tscSelections.availability) },
  ];

  return fields.filter((item) => item.before !== item.after);
}

export function buildAuditReportModel(current: WizardData, docs: AuditReportDoc[], previous?: WizardData | null): AuditReportModel {
  const assessment = computeAssessmentSummary(current);
  const selectedCriteria = selectedCriteriaCodes(current);
  const selectedTsc = selectedTscLabels(current);
  const expectedTemplates = getExpectedTemplates(current);
  const findings = buildFindings(current, assessment.overallScore);
  const openGaps = assessment.domains.flatMap((domain) =>
    domain.gaps.slice(0, 2).map((gap) => ({ domain: domain.label, gap })),
  );
  const comparison = buildComparison(current, previous);

  const activeDocs = docs.filter((doc) => doc.status !== 'archived');
  const approvedDocCount = docs.filter((doc) => doc.status === 'approved').length;

  return {
    overallScore: assessment.overallScore,
    overallScoreBand: scoreLabel(assessment.overallScore),
    selectedTsc,
    selectedCriteria,
    findings,
    openGaps,
    expectedTemplateCount: expectedTemplates.length,
    assessment,
    activeDocs,
    approvedDocCount,
    comparison,
    companySummary: {
      name: current.company.name,
      contact: `${current.company.primaryContactName} (${current.company.primaryContactEmail})`,
      businessModel: optionLabel(businessModelOptions, current.company.businessModel),
      deliveryModel: optionLabel(deliveryModelOptions, current.company.deliveryModel),
      maturityLabel: optionLabel(complianceMaturityOptions, current.company.complianceMaturity),
      soxLabel: optionLabel(soxApplicabilityOptions, current.company.soxApplicability),
      systemName: current.scope.systemName,
      phiInScope: current.scope.containsPhi,
      cdeInScope: current.scope.hasCardholderDataEnvironment,
    },
  };
}

export function buildAuditReportMarkdown({
  organizationName,
  generatedAt,
  model,
}: {
  organizationName: string;
  generatedAt: string;
  model: AuditReportModel;
}) {
  const findingsBlock = model.findings.length
    ? model.findings.map((finding, index) => (
        `${index + 1}. [${finding.severity}] ${finding.title}\n` +
        `   - Detail: ${finding.detail}\n` +
        `   - Criteria: ${finding.criteria.join(', ')}\n` +
        `   - Remediation: ${finding.remediation}`
      )).join('\n')
    : 'No high-priority pattern findings were generated from the current answers.';

  const comparisonBlock = model.comparison.length
    ? model.comparison.map((item, index) => `${index + 1}. ${item.label}: ${item.before} -> ${item.after}`).join('\n')
    : 'No material differences detected versus the prior baseline.';

  const domainBlock = model.assessment.domains
    .map((domain) => `- ${domain.label}: ${domain.score}% (${domain.answered}/${domain.total}) [readiness: ${domain.readiness}]`)
    .join('\n');

  const gapsBlock = model.openGaps.length
    ? model.openGaps.slice(0, 8).map((item) => `- [${item.domain}] ${item.gap}`).join('\n')
    : '- No major open gaps detected.';

  return [
    `# TrustScaffold Audit Report`,
    '',
    `Generated: ${generatedAt}`,
    `Organization: ${organizationName}`,
    '',
    '## Executive Summary',
    `- Overall posture: ${model.overallScore}% (${model.overallScoreBand})`,
    `- Completed assessment domains: ${model.assessment.completedDomains}/${model.assessment.totalDomains}`,
    `- Active generated docs: ${model.activeDocs.length} (${model.approvedDocCount} approved)`,
    `- Expected template set size: ${model.expectedTemplateCount}`,
    '',
    '## Entity and Scope',
    `- Company: ${model.companySummary.name || organizationName}`,
    `- Contact: ${model.companySummary.contact}`,
    `- Business profile: ${model.companySummary.businessModel} (${model.companySummary.deliveryModel})`,
    `- Compliance maturity: ${model.companySummary.maturityLabel}`,
    `- SOX/ITGC applicability: ${model.companySummary.soxLabel}`,
    `- System in scope: ${model.companySummary.systemName}`,
    `- PHI in scope: ${yesNo(model.companySummary.phiInScope)}`,
    `- CDE in scope: ${yesNo(model.companySummary.cdeInScope)}`,
    '',
    '## Framework Footprint',
    `- Selected TSC: ${model.selectedTsc.join(', ')}`,
    `- Criteria/tags: ${model.selectedCriteria.join(', ')}`,
    '',
    '## Domain Assessment',
    domainBlock,
    '',
    '## Auditor Findings Preview',
    findingsBlock,
    '',
    '## Period-over-Period Comparison',
    comparisonBlock,
    '',
    '## Open Evidence Gaps',
    gapsBlock,
  ].join('\n');
}
