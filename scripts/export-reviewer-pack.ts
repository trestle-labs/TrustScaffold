import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { createClient } from '@supabase/supabase-js';

import { TSC_CRITERIA, expandCriteriaCodes } from '../lib/tsc-criteria';

type TemplateRow = {
  slug: string;
  name: string;
  description: string;
  tsc_category: string;
  criteria_mapped: string[];
  output_filename_pattern: string;
  markdown_template: string;
};

const root = process.cwd();
const outputRoot = path.join(root, 'docs', 'reviewer-pack');
const templatesDir = path.join(outputRoot, 'templates');

function loadLocalEnv() {
  const envPath = path.join(root, '.env.local');
  const env = readFileSync(envPath, 'utf8');

  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function criteriaDescription(code: string) {
  const descriptions: Record<string, string> = {
    CC1: 'Control Environment (COSO principles 1-5)',
    CC2: 'Communication and Information (COSO principles 13-15)',
    CC3: 'Risk Assessment (COSO principles 6-9)',
    CC4: 'Monitoring Activities (COSO principles 16-17)',
    CC5: 'Control Activities (COSO principles 10-12)',
    CC6: 'Logical and Physical Access Controls',
    CC7: 'System Operations',
    CC8: 'Change Management',
    CC9: 'Risk Mitigation',
    A1: 'Availability',
    C1: 'Confidentiality',
    PI1: 'Processing Integrity',
    P1: 'Privacy: Notice',
    P2: 'Privacy: Choice and Consent',
    P3: 'Privacy: Collection',
    P4: 'Privacy: Use, Retention, and Disposal',
    P5: 'Privacy: Access',
    P6: 'Privacy: Disclosure and Notification',
    P7: 'Privacy: Data Quality',
    P8: 'Privacy: Monitoring and Enforcement',
    COMMON: 'Universal common-control foundation',
    ISO27001: 'ISO 27001 high-water-mark requirements',
    HIPAA: 'HIPAA high-water-mark requirements',
    PCI: 'PCI-DSS high-water-mark requirements',
    GDPR: 'GDPR / privacy high-water-mark requirements',
    CCPA: 'CCPA / CPRA privacy high-water-mark requirements',
  };

  return descriptions[code] ?? code;
}

function sortedCriteria(templates: TemplateRow[]) {
  const order = ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'A1', 'C1', 'PI1', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'COMMON', 'ISO27001', 'HIPAA', 'PCI', 'GDPR', 'CCPA'];
  const present = new Set(templates.flatMap((template) => template.criteria_mapped));
  return [...order.filter((code) => present.has(code)), ...[...present].filter((code) => !order.includes(code)).sort()];
}

function templateSupportsCriterion(template: TemplateRow, criterionCode: string) {
  if (template.slug === 'evidence-checklist') return true;
  if (template.slug === 'system-description' && /^(A1|C1|PI1|P[1-8])\./.test(criterionCode)) return true;

  return expandCriteriaCodes(template.criteria_mapped).includes(criterionCode);
}

function type1DocumentationExpectation(criterionCode: string) {
  const expectations: Record<string, string> = {
    'CC1.1': 'Code of conduct, acceptable use, disciplinary process, and policy acknowledgement expectations.',
    'CC1.2': 'Board/advisory or executive oversight documentation, meeting cadence, and risk reporting expectations.',
    'CC1.3': 'Organizational structure, reporting lines, roles, and authority documentation.',
    'CC1.4': 'Hiring, background check, training, competence, and security-awareness documentation.',
    'CC1.5': 'Control ownership, accountability, exception approval, and performance/accountability expectations.',
    'CC2.1': 'Policy/evidence information used to operate controls and support audit readiness.',
    'CC2.2': 'Internal communication of security, policy, control, and deficiency information.',
    'CC2.3': 'External communication channels, contracts, security commitments, support, release, and privacy notices.',
    'CC3.1': 'Defined security, availability, confidentiality, privacy, processing, and system objectives.',
    'CC3.2': 'Risk register, risk identification, analysis, ownership, treatment, and review procedure.',
    'CC3.3': 'Fraud-risk consideration in the risk assessment process.',
    'CC3.4': 'Change-driven risk review for infrastructure, personnel, vendor, regulatory, and product changes.',
    'CC4.1': 'Internal audit, control monitoring, separate evaluation, and ongoing monitoring procedures.',
    'CC4.2': 'Deficiency logging, communication, remediation, escalation, and closure evidence expectations.',
    'CC5.1': 'Control activities mapped to access, change, operations, vendor, and data protection risks.',
    'CC5.2': 'General technology controls over identity, infrastructure, encryption, monitoring, and SDLC.',
    'CC5.3': 'Policies defining expected control behavior, review, approval, and exceptions.',
    'CC6.1': 'Logical access architecture, MFA, identity provider, cloud access, and least-privilege requirements.',
    'CC6.2': 'User registration, authorization, access request, approval, and onboarding expectations.',
    'CC6.3': 'Access modification, role review, recertification, offboarding, and revocation expectations.',
    'CC6.4': 'Physical access requirements for offices, remote work, data centers, and hybrid/on-prem assets.',
    'CC6.5': 'Credential, token, device, media, and data disposal requirements.',
    'CC6.6': 'External access protection, cloud/network safeguards, WAF, IDS/IPS, and monitoring expectations.',
    'CC6.7': 'Transmission security, encryption, data movement, export, and approved-system restrictions.',
    'CC6.8': 'Malware prevention, endpoint protection, MDM, vulnerability detection, and alerting expectations.',
    'CC7.1': 'Vulnerability management, configuration monitoring, SAST/dependency scanning, and remediation expectations.',
    'CC7.2': 'Security event monitoring, cloud logs, SIEM, alerting, and evidence retention expectations.',
    'CC7.3': 'Security event triage, severity, evaluation, escalation, and incident classification procedure.',
    'CC7.4': 'Incident containment, eradication, communication, and response lifecycle procedure.',
    'CC7.5': 'Incident recovery, post-incident review, lessons learned, and corrective action expectations.',
    'CC8.1': 'Change authorization, design, review, testing, approval, deployment, emergency change, and rollback expectations.',
    'CC9.1': 'Business disruption risk mitigation, continuity planning, recovery objectives, and resilience documentation.',
    'CC9.2': 'Vendor due diligence, assurance review, subservice organizations, CSOCs, and ongoing monitoring.',
    'A1.1': 'Capacity monitoring, saturation thresholds, autoscaling, performance monitoring, and service-health evidence.',
    'A1.2': 'Environmental, cloud, region, hybrid, failover, network, backup, and dependency protection documentation.',
    'A1.3': 'Recovery plan, backup restore, DR test, RTO/RPO validation, remediation, and retest evidence.',
    'C1.1': 'Confidential information identification, classification, approved handling, encryption, and access restrictions.',
    'C1.2': 'Confidential information retention, disposal, deletion, destruction, subprocessor lifecycle, and evidence.',
    'PI1.1': 'Processing objectives, quality information, completeness, accuracy, timeliness, and authorization expectations.',
    'PI1.2': 'Input validation, approved sources, duplicate detection, authorization, and business-rule controls.',
    'PI1.3': 'Processing workflow monitoring, exception queues, retry/failure handling, and correction controls.',
    'PI1.4': 'Output review, report QA, delivery completeness, accuracy, timeliness, and authorization controls.',
    'PI1.5': 'Processing storage, retention, protection, correction, and disposal expectations.',
    'P1.1': 'Privacy notice commitments and contact channel.',
    'P2.1': 'Choice and consent commitments where opt-in consent is required.',
    'P3.1': 'Collection limitation and purpose alignment for personal information.',
    'P3.2': 'Explicit consent communication where sensitive or opt-in categories apply.',
    'P4.1': 'Use limitation and privacy-purpose alignment.',
    'P4.2': 'Privacy retention commitments and retention schedule alignment.',
    'P4.3': 'Personal information disposal and deletion expectations.',
    'P5.1': 'Data subject access request intake, acknowledgement, verification, and closure process.',
    'P5.2': 'Correction, amendment, downstream propagation, and closure process.',
    'P6.1': 'Authorized third-party disclosure commitments and consent alignment.',
    'P6.2': 'Disclosure recordkeeping expectations.',
    'P6.3': 'Unauthorized disclosure detection, logging, investigation, and escalation expectations.',
    'P6.4': 'Third-party privacy commitments and contract expectations.',
    'P6.5': 'Third-party privacy compliance review and vendor monitoring expectations.',
    'P6.6': 'Breach/incident notification expectations for data subjects, customers, regulators, and other parties.',
    'P6.7': 'Accounting of personal information held and disclosed.',
    'P7.1': 'Data quality, accuracy, completeness, relevance, correction, and downstream update process.',
    'P8.1': 'Privacy complaint handling, monitoring, enforcement, escalation, and remediation process.',
  };

  return expectations[criterionCode] ?? 'Reviewer to confirm documentation expectation for this criterion.';
}

function writeTemplateFiles(templates: TemplateRow[]) {
  for (const template of templates) {
    const filePath = path.join(templatesDir, template.output_filename_pattern.replace(/{{.*?}}/g, template.slug));
    const expandedCriteria = expandCriteriaCodes(template.criteria_mapped).join(', ');
    const body = `# ${template.name}\n\n` +
      `> Baseline reviewer copy. Handlebars placeholders such as \`{{organization_name}}\` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.\n\n` +
      `<!-- Mapping: ${expandedCriteria} -->\n\n` +
      `| Field | Value |\n` +
      `| --- | --- |\n` +
      `| Template slug | \`${template.slug}\` |\n` +
      `| TSC category | ${template.tsc_category} |\n` +
      `| Criteria mapped | ${template.criteria_mapped.join(', ')} |\n` +
      `| Purpose | ${template.description} |\n` +
      `| Output filename | \`${template.output_filename_pattern}\` |\n\n` +
      `---\n\n` +
      template.markdown_template.trim() +
      `\n`;

    writeFileSync(filePath, body);
  }
}

function writeReadme(templates: TemplateRow[]) {
  const readme = `# TrustScaffold Baseline Template Reviewer Pack\n\n` +
    `This packet is intended for independent SOC 2 Type I / Trust Services Criteria documentation review before customer, organization, or company-specific answers are merged into the templates.\n\n` +
    `## What Is Included\n\n` +
    `- \`${templates.length}\` active baseline templates exported from the local TrustScaffold template library.\n` +
    `- A criterion-level SOC 2 Type I documentation coverage matrix.\n` +
    `- A category-level coverage matrix for TSC and COSO-oriented review.\n` +
    `- A reviewer checklist for marking coverage as covered, partially covered, missing, not applicable, or requiring CPA judgment.\n\n` +
    `## How To Review\n\n` +
    `1. Read [REVIEW_SCOPE.md](REVIEW_SCOPE.md) to confirm the purpose, boundaries, and expected reviewer output.\n` +
    `2. Use [TYPE1_DOCUMENTATION_COVERAGE.md](TYPE1_DOCUMENTATION_COVERAGE.md) to review each SOC 2 criterion at the documentation/design level.\n` +
    `3. Use [COVERAGE_MATRIX.md](COVERAGE_MATRIX.md) to confirm category-level TSC/COSO coverage.\n` +
    `4. Use [TEMPLATE_INDEX.md](TEMPLATE_INDEX.md) to open each baseline document.\n` +
    `5. Use [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) to record independent reviewer conclusions.\n` +
    `6. Return findings using [REVIEWER_FINDINGS_TEMPLATE.md](REVIEWER_FINDINGS_TEMPLATE.md).\n` +
    `7. Review files in [templates/](templates/) with placeholders preserved. Placeholders indicate where wizard/company data will be inserted later.\n\n` +
    `## Review Boundary\n\n` +
    `This pack evaluates whether the baseline content model minimally covers documentation normally assessed in a SOC 2 Type I design-of-controls review. It does not prove that a specific company has implemented the controls. A company-specific generated document set and supporting evidence are still required before audit use.\n\n` +
    `## COSO Relationship\n\n` +
    `SOC 2 Common Criteria CC1-CC5 align to COSO principles: control environment, risk assessment, control activities, information and communication, and monitoring. CC6-CC9 and optional Availability, Confidentiality, Processing Integrity, and Privacy criteria extend the review into system-specific trust service commitments.\n`;

  writeFileSync(path.join(outputRoot, 'README.md'), readme);
}

function writeReviewScope() {
  const scope = `# Reviewer Scope\n\n` +
    `## Review Objective\n\n` +
    `Determine whether the TrustScaffold baseline template pack minimally covers the documentation normally assessed during a SOC 2 Type I design-of-controls review before organization-specific facts, answers, control owners, system descriptions, or evidence are inserted.\n\n` +
    `## Primary Review Question\n\n` +
    `If a company completed the TrustScaffold wizard honestly and generated company-specific documents from this baseline set, would the baseline template library provide a reasonable starting point for documenting the design of controls mapped to the selected Trust Services Criteria?\n\n` +
    `## In Scope\n\n` +
    `- Baseline template language in [templates/](templates/).\n` +
    `- Criteria-level coverage in [TYPE1_DOCUMENTATION_COVERAGE.md](TYPE1_DOCUMENTATION_COVERAGE.md).\n` +
    `- Category-level TSC and COSO-oriented coverage in [COVERAGE_MATRIX.md](COVERAGE_MATRIX.md).\n` +
    `- Whether each selected SOC 2 criterion has enough policy, procedure, system-description, or evidence-request language to support Type I design review.\n` +
    `- Whether placeholders are clear enough to produce auditable company-specific language after wizard completion.\n` +
    `- Whether control owners, cadences, review expectations, exception handling, and evidence expectations are present where needed.\n\n` +
    `## Out Of Scope\n\n` +
    `- Whether any specific company has implemented the controls.\n` +
    `- Whether operating effectiveness evidence is sufficient for SOC 2 Type II.\n` +
    `- Whether a specific CPA firm will accept generated documents without modification.\n` +
    `- Legal advice, privacy counsel advice, HIPAA attestation, PCI DSS validation, or formal CPA opinion.\n` +
    `- Testing live application behavior, authentication, data storage, exports, or evidence ingestion.\n\n` +
    `## Review Modes\n\n` +
    `| Mode | Criteria To Review | Use When |\n` +
    `| --- | --- | --- |\n` +
    `| Security-only SOC 2 Type I | CC1.1-CC9.2 | Reviewing the minimum SOC 2 Security category baseline. |\n` +
    `| Security + Availability | CC1.1-CC9.2 and A1.1-A1.3 | Availability commitments are expected in the report. |\n` +
    `| Security + Confidentiality | CC1.1-CC9.2 and C1.1-C1.2 | Confidential customer or company information commitments are expected. |\n` +
    `| Security + Processing Integrity | CC1.1-CC9.2 and PI1.1-PI1.5 | Completeness, accuracy, timeliness, validity, or authorization of processing is in scope. |\n` +
    `| Security + Privacy | CC1.1-CC9.2 and P1.1-P8.1 | Personal information privacy commitments are in scope. |\n` +
    `| All TSC categories | All rows in TYPE1_DOCUMENTATION_COVERAGE.md | Reviewing the broadest baseline template set. |\n\n` +
    `## Reviewer Assessment Scale\n\n` +
    `| Assessment | Meaning |\n` +
    `| --- | --- |\n` +
    `| Sufficient | Baseline language appears adequate for Type I design documentation, subject to company-specific completion and evidence. |\n` +
    `| Partial | Baseline language exists but should be strengthened, split into procedures, or made more specific. |\n` +
    `| Missing | Baseline language does not adequately address the criterion or expected documentation area. |\n` +
    `| N/A | Criterion is outside the selected engagement scope. |\n\n` +
    `## Requested Reviewer Output\n\n` +
    `Return findings using [REVIEWER_FINDINGS_TEMPLATE.md](REVIEWER_FINDINGS_TEMPLATE.md). For each finding, include the affected criterion, affected template, severity, rationale, and recommended language or remediation.\n`;

  writeFileSync(path.join(outputRoot, 'REVIEW_SCOPE.md'), scope);
}

function writeReviewerFindingsTemplate() {
  const template = `# Reviewer Findings Template\n\n` +
    `Use this file to return independent review findings for the TrustScaffold baseline template pack.\n\n` +
    `## Review Summary\n\n` +
    `| Field | Reviewer Response | Reviewer Notes |\n` +
    `| --- | --- | --- |\n` +
    `| Reviewer name / firm |  |  |\n` +
    `| Review date |  |  |\n` +
    `| Review mode | ☐ Security-only ☐ Security + Availability ☐ Security + Confidentiality ☐ Security + Processing Integrity ☐ Security + Privacy ☐ All TSC categories |  |\n` +
    `| Overall conclusion | ☐ Sufficient for readiness use ☐ Sufficient with changes ☐ Not sufficient yet ☐ Requires CPA-firm-specific interpretation |  |\n` +
    `| Highest severity finding | ☐ Critical ☐ High ☐ Medium ☐ Low ☐ None |  |\n\n` +
    `## Criteria Coverage Summary\n\n` +
    `| Area | Assessment | Reviewer Notes |\n` +
    `| --- | --- | --- |\n` +
    `| CC1 Control Environment / COSO 1-5 | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC2 Communication and Information / COSO 13-15 | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC3 Risk Assessment / COSO 6-9 | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC4 Monitoring Activities / COSO 16-17 | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC5 Control Activities / COSO 10-12 | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC6 Logical and Physical Access | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC7 System Operations | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC8 Change Management | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| CC9 Risk Mitigation | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| A1 Availability | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| C1 Confidentiality | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| PI1 Processing Integrity | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n` +
    `| P1-P8 Privacy | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |\n\n` +
    `## Reviewer Notes By Pack Section\n\n` +
    `Use this table to capture review notes for each major section of the reviewer pack, even when the note does not rise to the level of a formal finding.\n\n` +
    `| Pack Section | Reviewed? | Assessment | Reviewer Notes | Related Finding ID |\n` +
    `| --- | --- | --- | --- | --- |\n` +
    `| REVIEW_SCOPE.md | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n` +
    `| TYPE1_DOCUMENTATION_COVERAGE.md | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n` +
    `| COVERAGE_MATRIX.md | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n` +
    `| TEMPLATE_INDEX.md | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n` +
    `| REVIEW_CHECKLIST.md | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n` +
    `| templates/ baseline documents | ☐ Yes ☐ No ☐ N/A | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |  |\n\n` +
    `## Template Section Review Notes\n\n` +
    `Use this table for notes tied to a specific baseline template heading, section, criterion, or placeholder. Copy rows as needed.\n\n` +
    `| Template | Section / Heading | Criterion / Area | Assessment | Reviewer Notes | Related Finding ID |\n` +
    `| --- | --- | --- | --- | --- | --- |\n` +
    `|  |  |  | ☐ Sufficient ☐ Partial ☐ Missing ☐ Ambiguous ☐ Overclaim ☐ Placeholder issue ☐ Evidence alignment issue ☐ N/A |  |  |\n\n` +
    `## Findings\n\n` +
    `Copy this section for each finding.\n\n` +
    `### Finding 1: <short title>\n\n` +
    `| Field | Reviewer Response | Reviewer Notes |\n` +
    `| --- | --- | --- |\n` +
    `| Finding ID |  |  |\n` +
    `| Severity | ☐ Critical ☐ High ☐ Medium ☐ Low |  |\n` +
    `| Affected criterion / criteria |  |  |\n` +
    `| Affected template(s) |  |  |\n` +
    `| Affected section(s) / heading(s) |  |  |\n` +
    `| Assessment | ☐ Partial ☐ Missing ☐ Ambiguous ☐ Overclaim ☐ Placeholder issue ☐ Evidence alignment issue |  |\n` +
    `| Rationale |  |  |\n` +
    `| Recommended change |  |  |\n` +
    `| Suggested wording, if applicable |  |  |\n\n` +
    `## Cross-Cutting Comments\n\n` +
    `- Policy/procedure distinction:\n` +
    `- Placeholder clarity:\n` +
    `- Control ownership and cadence clarity:\n` +
    `- Evidence checklist alignment:\n` +
    `- System Description adequacy:\n` +
    `- CPA-firm-specific caveats:\n\n` +
    `## Final Recommendation\n\n` +
    `☐ Ready to use as a baseline template pack after company-specific completion.\n\n` +
    `☐ Ready after the findings above are addressed.\n\n` +
    `☐ Not ready; substantial template redesign is recommended before company-specific generation.\n`;

  writeFileSync(path.join(outputRoot, 'REVIEWER_FINDINGS_TEMPLATE.md'), template);
}

function writeTemplateIndex(templates: TemplateRow[]) {
  const rows = templates.map((template) => {
    const fileName = template.output_filename_pattern.replace(/{{.*?}}/g, template.slug);
    return `| [${template.name}](templates/${fileName}) | \`${template.slug}\` | ${template.tsc_category} | ${template.criteria_mapped.join(', ')} | ${template.description} |`;
  });

  writeFileSync(
    path.join(outputRoot, 'TEMPLATE_INDEX.md'),
    `# Template Index\n\n| Template | Slug | TSC Category | Criteria | Purpose |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`,
  );
}

function writeCoverageMatrix(templates: TemplateRow[]) {
  const rows = sortedCriteria(templates).map((code) => {
    const supportingTemplates = templates
      .filter((template) => template.criteria_mapped.includes(code))
      .map((template) => template.name)
      .join('<br>');

    return `| ${code} | ${criteriaDescription(code)} | ${supportingTemplates} | Reviewer to confirm adequacy and engagement-specific fit. |`;
  });

  const coverage = `# TSC and COSO Coverage Matrix\n\n` +
    `This matrix shows baseline template coverage before company-specific facts are inserted. It is designed for independent review, not as a CPA opinion.\n\n` +
    `| Criteria | Review Area | Baseline Template Support | Reviewer Notes |\n` +
    `| --- | --- | --- | --- |\n` +
    `${rows.join('\n')}\n\n` +
    `## COSO Mapping For Common Criteria\n\n` +
    `| COSO Component | SOC 2 Common Criteria | Baseline Review Question |\n` +
    `| --- | --- | --- |\n` +
    `| Control Environment | CC1 | Do templates define integrity, oversight, structure, competence, and accountability expectations? |\n` +
    `| Risk Assessment | CC3 | Do templates define risk objectives, risk identification, fraud consideration, and change-driven risk review? |\n` +
    `| Control Activities | CC5 | Do templates establish technology and policy control activities that mitigate risks? |\n` +
    `| Information and Communication | CC2 | Do templates define internal and external communication obligations for control information? |\n` +
    `| Monitoring Activities | CC4 | Do templates define ongoing/separate evaluation, deficiency communication, and remediation tracking? |\n`;

  writeFileSync(path.join(outputRoot, 'COVERAGE_MATRIX.md'), coverage);
}

function writeType1DocumentationCoverage(templates: TemplateRow[]) {
  const rows = TSC_CRITERIA.map((criterion) => {
    const supportingTemplates = templates
      .filter((template) => templateSupportsCriterion(template, criterion.code))
      .map((template) => template.name)
      .join('<br>');

    return `| ${criterion.code} | ${criterion.title} | ${criterion.category} | ${type1DocumentationExpectation(criterion.code)} | ${supportingTemplates || '**Potential gap**'} | ☐ Sufficient ☐ Partial ☐ Missing ☐ N/A |  |`;
  });

  const document = `# SOC 2 Type I Documentation Coverage\n\n` +
    `This matrix is designed for independent review of the baseline template pack against a SOC 2 Type I documentation goal. Type I focuses on whether controls are suitably designed and implemented as of a point in time. The reviewer should confirm that the templates provide enough policy, procedure, system-description, and evidence-request language to support that design assessment before organization-specific facts are inserted.\n\n` +
    `This is not a CPA opinion. It is a structured review aid for deciding whether the baseline template library minimally covers documentation normally assessed for SOC 2 Type I readiness across the selected Trust Services Criteria.\n\n` +
    `| Criterion | Title | Category | Minimum Documentation Expectation | Baseline Template Support | Reviewer Assessment | Notes / Required Changes |\n` +
    `| --- | --- | --- | --- | --- | --- | --- |\n` +
    `${rows.join('\n')}\n\n` +
    `## Type I Review Notes\n\n` +
    `- For Security-only engagements, the primary baseline requirement is CC1.1 through CC9.2.\n` +
    `- Availability, Confidentiality, Processing Integrity, and Privacy rows should be reviewed when those categories are selected for the engagement.\n` +
    `- Documentation coverage means the template set contains design-level language for the control area. It does not prove the organization has implemented the control or retained evidence.\n` +
    `- The SOC 2 Evidence Checklist is included as supporting documentation because it defines the evidence the organization would need to provide once company-specific answers are inserted.\n`;

  writeFileSync(path.join(outputRoot, 'TYPE1_DOCUMENTATION_COVERAGE.md'), document);
}

function writeReviewChecklist(templates: TemplateRow[]) {
  const criteriaRows = sortedCriteria(templates).map((code) => `| ${code} | ${criteriaDescription(code)} | ☐ Covered ☐ Partial ☐ Missing ☐ N/A |  |`);
  const templateRows = templates.map((template) => `| ${template.name} | ☐ Ready ☐ Needs edits ☐ Not needed |  |`);

  const checklist = `# Independent Reviewer Checklist\n\n` +
    `Use this checklist to review the baseline template set before organization-specific facts are inserted.\n\n` +
    `## Criteria Coverage\n\n` +
    `| Criteria | Area | Reviewer Assessment | Notes / Required Changes |\n` +
    `| --- | --- | --- | --- |\n` +
    `${criteriaRows.join('\n')}\n\n` +
    `## Template-Level Review\n\n` +
    `| Template | Reviewer Assessment | Notes / Required Changes |\n` +
    `| --- | --- | --- |\n` +
    `${templateRows.join('\n')}\n\n` +
    `## Cross-Cutting Questions\n\n` +
    `- Does the baseline set distinguish policy, procedure, system description, and evidence-request content clearly enough?\n` +
    `- Are CC1-CC5 mapped clearly enough to COSO principles for a SOC 2 reviewer?\n` +
    `- Are CC6-CC9 controls specific enough for a SaaS/cloud environment without becoming company-specific?\n` +
    `- Are optional TSCs for Availability, Confidentiality, Processing Integrity, and Privacy sufficiently covered when selected?\n` +
    `- Are placeholders clear and reviewable before company-specific data is inserted?\n` +
    `- Are there claims that should be softened unless backed by evidence during company-specific generation?\n` +
    `- Are any templates missing expected audit evidence, ownership, cadence, exception handling, or review requirements?\n`;

  writeFileSync(path.join(outputRoot, 'REVIEW_CHECKLIST.md'), checklist);
}

async function main() {
  loadLocalEnv();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from('templates')
    .select('slug, name, description, tsc_category, criteria_mapped, output_filename_pattern, markdown_template')
    .eq('is_active', true)
    .order('output_filename_pattern', { ascending: true });

  if (error) throw new Error(error.message);

  const templates = data as TemplateRow[];
  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(templatesDir, { recursive: true });

  writeTemplateFiles(templates);
  writeReadme(templates);
  writeReviewScope();
  writeReviewerFindingsTemplate();
  writeTemplateIndex(templates);
  writeCoverageMatrix(templates);
  writeType1DocumentationCoverage(templates);
  writeReviewChecklist(templates);

  console.log(`Exported ${templates.length} templates to docs/reviewer-pack`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});