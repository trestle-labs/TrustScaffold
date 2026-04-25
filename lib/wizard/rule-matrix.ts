import type { WizardData } from './schema';

export const wizardStepIds = [
  'welcome',
  'infrastructure',
  'system-scope',
  'governance',
  'tsc-selection',
  'security-assessment',
  'security-tooling',
  'operations',
  'review',
  'generate',
] as const;

export const wizardStepLabels: Record<WizardStepId, string> = {
  welcome: 'Welcome',
  'system-scope': 'System Scope',
  governance: 'Governance',
  'tsc-selection': 'Trust Service Criteria',
  infrastructure: 'Infrastructure',
  'security-assessment': 'Security Assessment',
  'security-tooling': 'Security Tooling',
  operations: 'Operations',
  review: 'Review',
  generate: 'Generate',
};

export type WizardStepId = typeof wizardStepIds[number];
export type WizardRuleKind = 'branching' | 'recommendation' | 'warning' | 'deep-dive';
export type WizardFieldPath = string;

export interface WizardRuleOption {
  value: string;
  label: string;
  description: string;
}

interface WizardRuleBase {
  id: string;
  kind: WizardRuleKind;
  step: WizardStepId;
  title: string;
  summary: string;
  criteria?: string[];
  anchorField?: WizardFieldPath;
  when: (data: WizardData) => boolean;
}

export interface WizardBranchingRule extends WizardRuleBase {
  kind: 'branching';
  effect: 'show-field' | 'show-guidance';
  targetField?: WizardFieldPath;
}

export interface WizardRecommendationRule extends WizardRuleBase {
  kind: 'recommendation';
  recommendation: string;
}

export interface WizardWarningRule extends WizardRuleBase {
  kind: 'warning';
  severity: 'info' | 'warning';
  recommendation: string;
}

export interface WizardDeepDiveRule extends WizardRuleBase {
  kind: 'deep-dive';
  field: WizardFieldPath;
  label: string;
  description: string;
  recommendation: string;
  options: WizardRuleOption[];
}

export type WizardRule = WizardBranchingRule | WizardRecommendationRule | WizardWarningRule | WizardDeepDiveRule;

export interface WizardAnswerPathCluster {
  id: string;
  title: string;
  goal: string;
  ruleIds: string[];
  setup: string[];
  expectedOutcomes: string[];
}

export interface WizardDecisionTraceItem {
  id: string;
  kind: WizardRuleKind;
  step: WizardStepId;
  stepLabel: string;
  title: string;
  summary: string;
  recommendation?: string;
  criteria?: string[];
}

export const wizardBaseValidationFieldsByStep: Record<WizardStepId, WizardFieldPath[]> = {
  welcome: ['company.name', 'company.website', 'company.primaryContactName', 'company.primaryContactEmail', 'company.industry', 'company.orgAge', 'company.complianceMaturity', 'company.targetAuditType'],
  'system-scope': ['scope.systemName', 'scope.systemDescription', 'scope.dataTypesHandled'],
  governance: ['governance.acknowledgementCadence', 'training.securityAwarenessTrainingTool', 'training.trainingCadence'],
  'tsc-selection': ['tscSelections.availability', 'tscSelections.confidentiality', 'tscSelections.processingIntegrity', 'tscSelections.privacy'],
  infrastructure: ['infrastructure.cloudProviders', 'infrastructure.type', 'infrastructure.idpProvider', 'operations.vcsProvider', 'operations.hrisProvider'],
  'security-assessment': ['securityAssessment.documentReview.readiness', 'securityAssessment.logReview.readiness', 'securityAssessment.rulesetReview.readiness', 'securityAssessment.configReview.readiness', 'securityAssessment.networkAnalysis.readiness', 'securityAssessment.fileIntegrity.readiness'],
  'security-tooling': ['securityTooling.penetrationTestFrequency'],
  operations: ['operations.ticketingSystem', 'operations.versionControlSystem', 'operations.onCallTool', 'operations.terminationSlaHours', 'operations.onboardingSlaDays', 'operations.policyPublicationMethod'],
  review: [],
  generate: [],
};

export const wizardRuleMatrix: WizardRule[] = [
  {
    id: 'welcome-first-time-guidance',
    kind: 'branching',
    step: 'governance',
    title: 'First-time compliance guidance',
    summary: 'Show the first-time guidance banner and starter recommendations when the company is new to compliance.',
    criteria: ['CC1.1', 'CC1.4'],
    effect: 'show-guidance',
    when: (data) => data.company.complianceMaturity === 'first-time',
  },
  {
    id: 'governance-board-frequency',
    kind: 'branching',
    step: 'governance',
    title: 'Board meeting frequency follow-up',
    summary: 'Show board meeting cadence only when a board or advisory function exists.',
    criteria: ['CC1.2'],
    effect: 'show-field',
    anchorField: 'governance.hasBoardOrAdvisory',
    targetField: 'governance.boardMeetingFrequency',
    when: (data) => data.governance.hasBoardOrAdvisory,
  },
  {
    id: 'governance-security-officer-title',
    kind: 'branching',
    step: 'governance',
    title: 'Security officer title follow-up',
    summary: 'Show the title field only when a specific security owner exists.',
    criteria: ['CC1.2'],
    effect: 'show-field',
    anchorField: 'governance.hasDedicatedSecurityOfficer',
    targetField: 'governance.securityOfficerTitle',
    when: (data) => data.governance.hasDedicatedSecurityOfficer,
  },
  {
    id: 'governance-org-chart-maintenance',
    kind: 'branching',
    step: 'governance',
    title: 'Org chart maintenance follow-up',
    summary: 'Show maintenance method only when an org chart exists.',
    criteria: ['CC1.3'],
    effect: 'show-field',
    anchorField: 'governance.hasOrgChart',
    targetField: 'governance.orgChartMaintenance',
    when: (data) => data.governance.hasOrgChart,
  },
  {
    id: 'governance-internal-audit-frequency',
    kind: 'branching',
    step: 'governance',
    title: 'Internal audit cadence follow-up',
    summary: 'Show audit cadence only when a formal internal audit or monitoring program exists.',
    criteria: ['CC4.1', 'CC4.2'],
    effect: 'show-field',
    anchorField: 'governance.hasInternalAuditProgram',
    targetField: 'governance.internalAuditFrequency',
    when: (data) => data.governance.hasInternalAuditProgram,
  },
  {
    id: 'governance-training-tool-recommendations',
    kind: 'recommendation',
    step: 'governance',
    title: 'Vendor-aware training guidance',
    summary: 'Recommend training platforms when current sub-service organizations imply an obvious training ecosystem match.',
    criteria: ['CC1.4'],
    recommendation: 'Promote vendor-aware training suggestions and explain which current sub-service organizations triggered them.',
    anchorField: 'training.securityAwarenessTrainingTool',
    when: (data) => data.subservices.some((subservice) => /knowbe4|proofpoint|wombat|hoxhunt|curricula|wizer|ninjio|living security|microsoft|office 365|entra|google|workspace|rippling/i.test(`${subservice.name} ${subservice.role}`)),
  },
  {
    id: 'governance-no-board-warning',
    kind: 'warning',
    step: 'governance',
    title: 'No formal oversight body selected',
    summary: 'No board or advisory group means the wizard should ask how security and risk oversight actually happens today.',
    criteria: ['CC1.2'],
    severity: 'warning',
    recommendation: 'Document the real oversight path, even if it is founder-led or external-advisor-led, so the generated governance language stays truthful.',
    anchorField: 'governance.hasBoardOrAdvisory',
    when: (data) => !data.governance.hasBoardOrAdvisory,
  },
  {
    id: 'governance-no-board-deep-dive',
    kind: 'deep-dive',
    step: 'governance',
    title: 'How is risk oversight handled today?',
    summary: 'Capture the actual oversight path when there is no formal board or advisory body.',
    criteria: ['CC1.2'],
    anchorField: 'governance.hasBoardOrAdvisory',
    field: 'governance.oversightApproachWhenNoBoard',
    label: 'Current oversight approach',
    description: 'If there is no board or advisory group, who actually reviews major security, compliance, or risk decisions today?',
    recommendation: 'Pick the closest real operating model. Auditors prefer an honest founder-led process over a fictional governance structure.',
    options: [
      { value: 'founder-ceo', label: 'Founder / CEO reviews it', description: 'A founder or CEO is the primary reviewer for security and risk decisions.' },
      { value: 'executive-team', label: 'Executive team reviews it', description: 'The leadership team discusses risk and control issues together.' },
      { value: 'engineering-leadership', label: 'Engineering leadership reviews it', description: 'Engineering or product leadership currently owns the review loop.' },
      { value: 'external-advisor', label: 'External advisor or consultant reviews it', description: 'A trusted outside advisor provides oversight even without a formal board.' },
      { value: 'informal-as-needed', label: 'Informal, case-by-case only', description: 'There is no steady oversight body and decisions are made ad hoc.' },
    ],
    when: (data) => !data.governance.hasBoardOrAdvisory,
  },
  {
    id: 'governance-no-security-officer-warning',
    kind: 'warning',
    step: 'governance',
    title: 'No designated security owner selected',
    summary: 'Without a named security owner, the wizard should capture who is actually accountable for the program.',
    criteria: ['CC1.2'],
    severity: 'warning',
    recommendation: 'Record the real owner now, even if it is temporary or shared, so policies and evidence requests point to the right person.',
    anchorField: 'governance.hasDedicatedSecurityOfficer',
    when: (data) => !data.governance.hasDedicatedSecurityOfficer,
  },
  {
    id: 'governance-no-security-officer-deep-dive',
    kind: 'deep-dive',
    step: 'governance',
    title: 'Who currently owns the security program?',
    summary: 'Capture the real owner when there is no formal security officer or CISO.',
    criteria: ['CC1.2'],
    anchorField: 'governance.hasDedicatedSecurityOfficer',
    field: 'governance.securityProgramOwnerWhenNoOfficer',
    label: 'Current security program owner',
    description: 'Who is currently accountable for the security program, even if that is not their official title?',
    recommendation: 'This becomes the practical owner for policies, audits, and remediation follow-up until the organization formalizes the role.',
    options: [
      { value: 'founder-ceo', label: 'Founder / CEO', description: 'The founder or CEO currently owns security accountability.' },
      { value: 'cto-vp-engineering', label: 'CTO / VP Engineering', description: 'Engineering leadership owns the security program today.' },
      { value: 'it-ops-lead', label: 'IT / Ops lead', description: 'A systems, IT, or operations leader is acting as the security owner.' },
      { value: 'fractional-consultant', label: 'Fractional consultant or vCISO', description: 'An external specialist is currently guiding the security program.' },
      { value: 'shared-ownership', label: 'Shared ownership', description: 'Responsibility is spread across multiple leaders.' },
      { value: 'no-clear-owner', label: 'No clear owner yet', description: 'There is not currently a single accountable owner.' },
    ],
    when: (data) => !data.governance.hasDedicatedSecurityOfficer,
  },
  {
    id: 'governance-no-internal-audit-warning',
    kind: 'warning',
    step: 'governance',
    title: 'No formal controls monitoring program selected',
    summary: 'Without a formal internal audit program, the wizard should capture what review loop exists instead.',
    criteria: ['CC4.1', 'CC4.2'],
    severity: 'warning',
    recommendation: 'Document the informal review pattern you use today so remediation planning and evidence requests are grounded in reality.',
    anchorField: 'governance.hasInternalAuditProgram',
    when: (data) => !data.governance.hasInternalAuditProgram,
  },
  {
    id: 'governance-no-internal-audit-deep-dive',
    kind: 'deep-dive',
    step: 'governance',
    title: 'How are controls reviewed today?',
    summary: 'Capture the current monitoring loop when there is no formal internal audit program.',
    criteria: ['CC4.1', 'CC4.2'],
    anchorField: 'governance.hasInternalAuditProgram',
    field: 'governance.controlMonitoringApproachWhenNoInternalAudit',
    label: 'Current monitoring approach',
    description: 'What actually happens today when someone checks whether controls are working?',
    recommendation: 'Even ad hoc founder review or occasional external review is better to document than leaving the monitoring story blank.',
    options: [
      { value: 'ad-hoc-founder-review', label: 'Ad hoc founder or executive review', description: 'Leaders review issues or controls as needed, but not on a fixed cadence.' },
      { value: 'manager-review', label: 'Manager or team lead review', description: 'Managers or team leads periodically check controls without a formal audit program.' },
      { value: 'external-consultant-review', label: 'External consultant review', description: 'A consultant or outside specialist reviews controls from time to time.' },
      { value: 'customer-driven-remediation', label: 'Only when a customer or auditor asks', description: 'Controls are typically reviewed in response to external requests.' },
      { value: 'none-today', label: 'No real review loop today', description: 'There is no current controls monitoring practice.' },
    ],
    when: (data) => !data.governance.hasInternalAuditProgram,
  },
  {
    id: 'tsc-privacy-scope-warning',
    kind: 'warning',
    step: 'tsc-selection',
    title: 'Privacy-like data is in scope without Privacy TSC',
    summary: 'Customer PII or PHI is already in scope, but Privacy is still out of scope in the TSC step.',
    criteria: ['P1-P8'],
    severity: 'warning',
    recommendation: 'Decide whether Privacy should be in scope now or document the reason it remains out of scope despite the current data profile.',
    when: (data) => (data.scope.dataTypesHandled.includes('Customer PII') || data.scope.containsPhi) && !data.tscSelections.privacy,
  },
  {
    id: 'tsc-cde-confidentiality-warning',
    kind: 'warning',
    step: 'tsc-selection',
    title: 'Cardholder data environment is in scope without Confidentiality TSC',
    summary: 'A cardholder data environment is marked in scope, but Confidentiality is still out of scope in the TSC step.',
    criteria: ['C1'],
    severity: 'warning',
    recommendation: 'Confirm whether Confidentiality should be added to scope or document why the payment environment remains out of scope for confidentiality-focused controls.',
    when: (data) => data.scope.hasCardholderDataEnvironment && !data.tscSelections.confidentiality,
  },
  {
    id: 'operations-mfa-entra-guidance',
    kind: 'branching',
    step: 'operations',
    title: 'Entra MFA setup guidance',
    summary: 'Show Entra-specific MFA setup guidance when MFA is required and Entra ID is the selected IdP.',
    criteria: ['CC6.1'],
    effect: 'show-guidance',
    anchorField: 'operations.requiresMfa',
    when: (data) => data.operations.requiresMfa && data.infrastructure.idpProvider === 'Entra ID',
  },
  {
    id: 'operations-mfa-okta-guidance',
    kind: 'branching',
    step: 'operations',
    title: 'Okta MFA setup guidance',
    summary: 'Show Okta-specific MFA setup guidance when MFA is required and Okta is the selected IdP.',
    criteria: ['CC6.1'],
    effect: 'show-guidance',
    anchorField: 'operations.requiresMfa',
    when: (data) => data.operations.requiresMfa && data.infrastructure.idpProvider === 'Okta',
  },
  {
    id: 'operations-peer-review-github-guidance',
    kind: 'branching',
    step: 'operations',
    title: 'GitHub peer review guidance',
    summary: 'Show GitHub branch-protection guidance when peer review is required and GitHub is the VCS provider.',
    criteria: ['CC8.1'],
    effect: 'show-guidance',
    anchorField: 'operations.requiresPeerReview',
    when: (data) => data.operations.requiresPeerReview && data.operations.vcsProvider === 'GitHub',
  },
  {
    id: 'operations-peer-review-azure-guidance',
    kind: 'branching',
    step: 'operations',
    title: 'Azure DevOps peer review guidance',
    summary: 'Show Azure DevOps branch-policy guidance when peer review is required and Azure DevOps is the VCS provider.',
    criteria: ['CC8.1'],
    effect: 'show-guidance',
    anchorField: 'operations.requiresPeerReview',
    when: (data) => data.operations.requiresPeerReview && data.operations.vcsProvider === 'Azure DevOps',
  },
  {
    id: 'operations-aws-scp-guidance',
    kind: 'branching',
    step: 'operations',
    title: 'AWS SCP guidance',
    summary: 'Show AWS SCP guidance when AWS is part of the selected infrastructure profile.',
    criteria: ['CC6.1'],
    effect: 'show-guidance',
    anchorField: 'operations.requiresPeerReview',
    when: (data) => data.infrastructure.cloudProviders.includes('aws'),
  },
  {
    id: 'operations-no-mfa-warning',
    kind: 'warning',
    step: 'operations',
    title: 'MFA is not currently required',
    summary: 'MFA is one of the first technically-enforced controls auditors look for.',
    criteria: ['CC6.1'],
    severity: 'warning',
    recommendation: 'Capture the real blocker now so the remediation plan can be specific instead of generic.',
    anchorField: 'operations.requiresMfa',
    when: (data) => !data.operations.requiresMfa,
  },
  {
    id: 'operations-no-mfa-deep-dive',
    kind: 'deep-dive',
    step: 'operations',
    title: 'What is blocking MFA rollout?',
    summary: 'Capture the most honest reason MFA is not yet required.',
    criteria: ['CC6.1'],
    anchorField: 'operations.requiresMfa',
    field: 'operations.mfaGapReason',
    label: 'Current MFA gap',
    description: 'Why is MFA not required for the workforce or for privileged access today?',
    recommendation: 'Choose the blocker that most accurately reflects the current state so the generated checklist can suggest the right next step.',
    options: [
      { value: 'not-configured-yet', label: 'Not configured yet', description: 'The organization intends to require MFA but has not finished configuration.' },
      { value: 'legacy-tooling-limitations', label: 'Legacy tooling or app limitations', description: 'A key system does not yet support the MFA plan cleanly.' },
      { value: 'rollout-in-progress', label: 'Rollout is in progress', description: 'MFA is being deployed in stages but is not yet universal.' },
      { value: 'limited-to-admins-today', label: 'Only admins have MFA today', description: 'MFA exists for privileged users but not for the broader workforce.' },
      { value: 'not-prioritized-yet', label: 'Not prioritized yet', description: 'The organization has not yet prioritized MFA rollout.' },
    ],
    when: (data) => !data.operations.requiresMfa,
  },
  {
    id: 'operations-no-peer-review-warning',
    kind: 'warning',
    step: 'operations',
    title: 'Peer review is not currently enforced',
    summary: 'Without enforced peer review, change control language can become misleading if the wizard assumes a formal gate exists.',
    criteria: ['CC8.1'],
    severity: 'warning',
    recommendation: 'Document the real review pattern now so the generated SDLC and change-management language matches actual practice.',
    anchorField: 'operations.requiresPeerReview',
    when: (data) => !data.operations.requiresPeerReview,
  },
  {
    id: 'operations-no-peer-review-deep-dive',
    kind: 'deep-dive',
    step: 'operations',
    title: 'How are production changes reviewed today?',
    summary: 'Capture the current review path when a formal peer-review gate is not required.',
    criteria: ['CC8.1'],
    anchorField: 'operations.requiresPeerReview',
    field: 'operations.changeReviewApproachWhenNoPeerReview',
    label: 'Current change review approach',
    description: 'If merges are not blocked on peer review, what actually happens before production-affecting changes are shipped?',
    recommendation: 'Pick the closest real practice. Auditors care that the documented process matches reality, even if it is immature.',
    options: [
      { value: 'author-self-review', label: 'Author self-review only', description: 'The engineer shipping the change is the only reviewer.' },
      { value: 'pairing-without-gate', label: 'Pairing or informal second set of eyes', description: 'Someone else may look, but there is no enforced merge gate.' },
      { value: 'founder-or-lead-approval', label: 'Founder or team lead approval', description: 'A senior person approves changes outside the VCS gate.' },
      { value: 'post-deploy-review', label: 'Reviewed after deployment', description: 'Changes are checked after they are already live.' },
      { value: 'none-today', label: 'No real review path today', description: 'There is no meaningful review step before or after deployment.' },
    ],
    when: (data) => !data.operations.requiresPeerReview,
  },
  {
    id: 'infrastructure-multi-cloud-warning',
    kind: 'warning',
    step: 'infrastructure',
    title: 'Multi-cloud footprint increases control coordination risk',
    summary: 'More than one cloud provider is selected, which usually means identity, logging, and change-management controls must be standardized across providers.',
    criteria: ['CC6.1', 'CC7.2', 'CC9.2'],
    severity: 'warning',
    recommendation: 'Confirm how access, logging, backup, and vendor-management controls stay consistent across each cloud provider before generation.',
    when: (data) => data.infrastructure.cloudProviders.length > 1,
  },
  {
    id: 'infrastructure-hybrid-warning',
    kind: 'warning',
    step: 'infrastructure',
    title: 'Hybrid infrastructure needs explicit ownership boundaries',
    summary: 'Cloud services and self-hosted hardware are both in scope, so physical, environmental, and operational boundaries need to be stated clearly.',
    criteria: ['CC6.1', 'CC6.6', 'A1.2'],
    severity: 'warning',
    recommendation: 'Document which controls are inherited from cloud providers versus which controls remain your responsibility for on-premises or colocated systems.',
    when: (data) => data.infrastructure.hostsOwnHardware && data.infrastructure.cloudProviders.length > 0,
  },
  {
    id: 'generate-no-subservices-warning',
    kind: 'warning',
    step: 'generate',
    title: 'No sub-service organizations captured',
    summary: 'Vendor-management language will be thin if the system depends on vendors but none are captured.',
    criteria: ['CC9.2'],
    severity: 'info',
    recommendation: 'If the system relies on cloud, identity, HRIS, support, or other vendors, add them before generation so policy language and evidence prompts are accurate.',
    when: (data) => data.subservices.filter((subservice) => subservice.name.trim()).length === 0,
  },
  {
    id: 'review-privacy-scope-warning',
    kind: 'warning',
    step: 'review',
    title: 'Privacy contradiction remains unresolved at review',
    summary: 'The review step still sees customer PII or PHI in scope without Privacy TSC selected.',
    criteria: ['P1-P8'],
    severity: 'warning',
    recommendation: 'Resolve the contradiction before generating drafts so the system description and TSC scope do not tell different stories.',
    when: (data) => (data.scope.dataTypesHandled.includes('Customer PII') || data.scope.containsPhi) && !data.tscSelections.privacy,
  },
  {
    id: 'review-cde-confidentiality-warning',
    kind: 'warning',
    step: 'review',
    title: 'Payment environment contradiction remains unresolved at review',
    summary: 'The review step still sees a cardholder data environment in scope without Confidentiality TSC selected.',
    criteria: ['C1'],
    severity: 'warning',
    recommendation: 'Resolve the contradiction before generating drafts so the payment-environment story and selected TSC scope do not diverge.',
    when: (data) => data.scope.hasCardholderDataEnvironment && !data.tscSelections.confidentiality,
  },
  {
    id: 'generate-privacy-scope-warning',
    kind: 'warning',
    step: 'generate',
    title: 'Privacy-like data selected without Privacy TSC',
    summary: 'The system handles customer PII or PHI, but Privacy TSC is not selected.',
    criteria: ['P1-P8'],
    severity: 'warning',
    recommendation: 'Confirm whether Privacy should be added to scope or explicitly document why Privacy TSC is out of scope despite the selected data profile.',
    when: (data) => (data.scope.dataTypesHandled.includes('Customer PII') || data.scope.containsPhi) && !data.tscSelections.privacy,
  },
  {
    id: 'generate-cde-confidentiality-warning',
    kind: 'warning',
    step: 'generate',
    title: 'Cardholder data environment selected without Confidentiality TSC',
    summary: 'The system marks a cardholder data environment in scope, but Confidentiality TSC is not selected.',
    criteria: ['C1'],
    severity: 'warning',
    recommendation: 'Confirm whether Confidentiality should be added to scope or explicitly document why the payment environment remains outside confidentiality-focused controls.',
    when: (data) => data.scope.hasCardholderDataEnvironment && !data.tscSelections.confidentiality,
  },
];

export const wizardAnswerPathClusters: WizardAnswerPathCluster[] = [
  {
    id: 'cluster-first-time-founder-led-governance',
    title: 'First-time, founder-led governance path',
    goal: 'Validate the first-time experience when formal oversight and internal audit are not yet established.',
    ruleIds: ['welcome-first-time-guidance', 'governance-no-board-deep-dive', 'governance-no-security-officer-deep-dive', 'governance-no-internal-audit-deep-dive'],
    setup: [
      'Set compliance maturity to first-time.',
      'Leave board/advisory unchecked.',
      'Leave designated security officer unchecked.',
      'Leave internal audit program unchecked.',
    ],
    expectedOutcomes: [
      'Governance shows first-time guidance.',
      'Each negative governance answer shows the matching deep-dive prompt.',
      'The user can capture founder-led or informal oversight instead of leaving the section underspecified.',
    ],
  },
  {
    id: 'cluster-okta-mfa-github-peer-review',
    title: 'Okta + MFA + GitHub peer review path',
    goal: 'Validate the strongest happy path for access and change-control guidance.',
    ruleIds: ['operations-mfa-okta-guidance', 'operations-peer-review-github-guidance'],
    setup: [
      'Select Okta as the IdP in Infrastructure.',
      'Select GitHub as the VCS provider in Operations.',
      'Enable MFA and peer review.',
    ],
    expectedOutcomes: [
      'Operations shows Okta MFA setup guidance.',
      'Operations shows GitHub branch-protection guidance.',
      'No negative-answer deep dives appear for MFA or peer review.',
    ],
  },
  {
    id: 'cluster-no-mfa-no-peer-review',
    title: 'No MFA + no peer review path',
    goal: 'Validate that weak-control answers trigger concrete follow-up questions rather than silently hiding guidance.',
    ruleIds: ['operations-no-mfa-deep-dive', 'operations-no-peer-review-deep-dive'],
    setup: [
      'Disable MFA.',
      'Disable peer review.',
    ],
    expectedOutcomes: [
      'Operations shows a warning and deep-dive prompt for MFA.',
      'Operations shows a warning and deep-dive prompt for peer review.',
      'The user must capture the real current operating model before advancing.',
    ],
  },
  {
    id: 'cluster-vendor-aware-training',
    title: 'Vendor-aware training recommendation path',
    goal: 'Validate that sub-service choices in System Scope affect Governance recommendations.',
    ruleIds: ['governance-training-tool-recommendations'],
    setup: [
      'Add recognizable sub-service vendors such as Microsoft, Google Workspace, or Rippling in System Scope.',
      'Navigate to Governance.',
    ],
    expectedOutcomes: [
      'Governance promotes matching training-tool recommendations.',
      'The recommendation feels explainable from the chosen vendor set.',
    ],
  },
  {
    id: 'cluster-privacy-warning-in-tsc-and-review',
    title: 'Privacy contradiction trace path',
    goal: 'Validate that privacy scope contradictions are visible before generation and remain explainable on the Review step.',
    ruleIds: ['tsc-privacy-scope-warning', 'review-privacy-scope-warning', 'generate-privacy-scope-warning'],
    setup: [
      'Select Customer PII in System Scope.',
      'Leave Privacy TSC unchecked.',
      'Visit the TSC Selection, Review, and Generate steps.',
    ],
    expectedOutcomes: [
      'The TSC step warns about the mismatch while the user is making scope decisions.',
      'The Review step decision trace still explains the unresolved contradiction.',
      'Generate keeps the warning until the scope mismatch is resolved.',
    ],
  },
  {
    id: 'cluster-multi-cloud-hybrid-warning',
    title: 'Multi-cloud and hybrid infrastructure path',
    goal: 'Validate that complex infrastructure footprints surface explicit warnings before generation.',
    ruleIds: ['infrastructure-multi-cloud-warning', 'infrastructure-hybrid-warning'],
    setup: [
      'Select at least two cloud providers in Infrastructure.',
      'Enable hostsOwnHardware.',
      'Navigate through Infrastructure and Review.',
    ],
    expectedOutcomes: [
      'Infrastructure warns that cross-cloud control consistency must be explained.',
      'Infrastructure warns that hybrid ownership boundaries must be documented.',
      'The Review decision trace repeats both warnings so they are visible before generation.',
    ],
  },
  {
    id: 'cluster-privacy-warning-at-generate',
    title: 'Privacy-scope contradiction path',
    goal: 'Validate that generate-time warnings catch a mismatch between selected data types and TSC scope.',
    ruleIds: ['generate-privacy-scope-warning'],
    setup: [
      'Select Customer PII in System Scope.',
      'Leave Privacy TSC unchecked.',
      'Navigate to Generate.',
    ],
    expectedOutcomes: [
      'Generate shows a privacy-scope warning.',
      'The user understands why the warning is present before drafts are created.',
    ],
  },
];

export function getWizardStepId(stepIndex: number): WizardStepId {
  return wizardStepIds[Math.max(0, Math.min(stepIndex, wizardStepIds.length - 1))];
}

export function getActiveWizardRules(data: WizardData, step: WizardStepId, kind?: WizardRuleKind): WizardRule[] {
  return wizardRuleMatrix.filter((rule) => rule.step === step && rule.when(data) && (!kind || rule.kind === kind));
}

export function getActiveWizardRulesForField(data: WizardData, step: WizardStepId, anchorField: WizardFieldPath, kind?: WizardRuleKind): WizardRule[] {
  return getActiveWizardRules(data, step, kind).filter((rule) => rule.anchorField === anchorField);
}

export function getStepValidationFields(stepIndex: number, data: WizardData): WizardFieldPath[] {
  const step = getWizardStepId(stepIndex);
  const activeDeepDiveFields = getActiveWizardRules(data, step, 'deep-dive').map((rule) => (rule as WizardDeepDiveRule).field);
  return Array.from(new Set([...wizardBaseValidationFieldsByStep[step], ...activeDeepDiveFields]));
}

export function getWizardDecisionTrace(data: WizardData): WizardDecisionTraceItem[] {
  return wizardStepIds.flatMap((step) => getActiveWizardRules(data, step)).filter((rule) => {
    if (rule.kind === 'branching') {
      return rule.effect === 'show-guidance';
    }

    return true;
  }).map((rule) => ({
    id: rule.id,
    kind: rule.kind,
    step: rule.step,
    stepLabel: wizardStepLabels[rule.step],
    title: rule.title,
    summary: rule.summary,
    criteria: rule.criteria,
    recommendation: 'recommendation' in rule ? rule.recommendation : undefined,
  }));
}
