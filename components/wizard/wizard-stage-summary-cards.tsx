import type { Route } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { expandAcronymsInText } from '@/lib/acronyms';
import {
  acknowledgementCadenceOptions,
  businessModelOptions,
  complianceMaturityOptions,
  deliveryModelOptions,
  hasSoxApplicability,
  penTestFrequencyOptions,
  phishingFrequencyOptions,
  policyPublicationMethodOptions,
  selectedTscLabels,
  soxApplicabilityOptions,
  trainingCadenceOptions,
  type WizardData,
} from '@trestle-labs/core';
import { computeStepCompletions, type StepCompletion } from '@trestle-labs/core';
import { cn } from '@/lib/utils';

type SummaryRow = {
  label: string;
  value?: string | null;
  required?: boolean;
};

type SummaryNote = {
  title: string;
  body: string;
  tone: 'emerald' | 'blue';
};

type SummarySubservice = {
  name: string;
  detail: string;
};

type SummaryCard = {
  title: string;
  completionStatus: StepCompletion['status'];
  completionDetail?: string;
  rows: SummaryRow[];
  badges?: string[];
  badgeLabel?: string;
  notes?: SummaryNote[];
  subservices?: SummarySubservice[];
  actions: Array<{
    label: string;
    href: Route;
  }>;
};

const VALUE_LABEL_MAP = new Map<string, string>([
  ...businessModelOptions.map((option) => [option.value, option.label] as const),
  ...complianceMaturityOptions.map((option) => [option.value, option.label] as const),
  ...deliveryModelOptions.map((option) => [option.value, option.label] as const),
  ...acknowledgementCadenceOptions.map((option) => [option.value, option.label] as const),
  ...trainingCadenceOptions.map((option) => [option.value, option.label] as const),
  ...soxApplicabilityOptions.map((option) => [option.value, option.label] as const),
  ...phishingFrequencyOptions.map((option) => [option.value, option.label] as const),
  ...penTestFrequencyOptions.map((option) => [option.value, option.label] as const),
  ...policyPublicationMethodOptions.map((option) => [option.value, option.label] as const),
  ['type1', 'SOC 2 Type I'],
  ['type2', 'SOC 2 Type II'],
  ['unsure', 'Unsure'],
]);

function displayLabel(value: string) {
  return VALUE_LABEL_MAP.get(value) ?? value;
}

function combineStepStatuses(statuses: StepCompletion['status'][]): StepCompletion['status'] {
  if (statuses.every((status) => status === 'complete')) {
    return 'complete';
  }

  if (statuses.every((status) => status === 'empty')) {
    return 'empty';
  }

  return 'partial';
}

function completionBadgeClassName(status: StepCompletion['status']) {
  switch (status) {
    case 'complete':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'partial':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function completionLabel(status: StepCompletion['status']) {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'partial':
      return 'Partial';
    default:
      return 'Empty';
  }
}

function SummaryRowItem({ label, value, required }: SummaryRow) {
  const isEmpty = !value?.trim();
  const displayRowLabel = expandAcronymsInText(label);
  const displayRowValue = value ? expandAcronymsInText(value) : value;

  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="w-36 shrink-0 text-xs text-muted-foreground">{displayRowLabel}</span>
      {isEmpty ? (
        <span className={cn('text-xs italic', required ? 'font-medium text-amber-600' : 'text-muted-foreground/40')}>
          {required ? 'Required - missing' : '-'}
        </span>
      ) : (
        <span className="min-w-0 break-words text-foreground">{displayRowValue}</span>
      )}
    </div>
  );
}

function formatCloudProvider(provider: string) {
  switch (provider) {
    case 'aws':
      return 'Amazon Web Services (AWS)';
    case 'azure':
      return 'Microsoft Azure';
    case 'gcp':
      return 'Google Cloud Platform (GCP)';
    default:
      return provider;
  }
}

function buildSummaryCards(data: WizardData, organizationName: string, highWaterStep: number): SummaryCard[] {
  const stepStatuses = computeStepCompletions(data, highWaterStep);
  const welcomeStatus = stepStatuses.find((step) => step.step === 0)?.status ?? 'empty';
  const infrastructureStatus = stepStatuses.find((step) => step.step === 1)?.status ?? 'empty';
  const scopeStatus = stepStatuses.find((step) => step.step === 2)?.status ?? 'empty';
  const governanceStatus = stepStatuses.find((step) => step.step === 3)?.status ?? 'empty';
  const tscStatus = stepStatuses.find((step) => step.step === 4)?.status ?? 'empty';
  const toolingStatus = stepStatuses.find((step) => step.step === 6)?.status ?? 'empty';
  const operationsStatus = stepStatuses.find((step) => step.step === 7)?.status ?? 'empty';

  return [
    {
      title: 'Company',
      completionStatus: welcomeStatus,
      rows: [
        { label: 'Company Name', value: data.company.name, required: true },
        { label: 'Business Model', value: displayLabel(data.company.businessModel) },
        { label: 'Delivery Model', value: displayLabel(data.company.deliveryModel) },
        { label: 'Public Website In Scope', value: data.company.hasPublicWebsite ? 'Yes' : 'No' },
        {
          label: 'Org Relationship',
          value: data.company.organizationRelationship === 'same-as-company'
            ? 'Workspace org is the company'
            : `Workspace org governs ${data.company.name}`,
        },
        ...(data.company.organizationRelationship === 'governing-company'
          ? [{ label: 'Workspace Org', value: organizationName }]
          : []),
        { label: 'Website', value: data.company.hasPublicWebsite ? data.company.website : 'Not in scope' },
        { label: 'Website Collects Personal Data', value: data.company.hasPublicWebsite ? (data.company.websiteCollectsPersonalData ? 'Yes' : 'No') : 'N/A' },
        { label: 'Cookies / Analytics', value: data.company.hasPublicWebsite ? (data.company.websiteUsesCookiesAnalytics ? 'Yes' : 'No') : 'N/A' },
        { label: 'EU/UK Exposure', value: data.company.hasPublicWebsite ? (data.company.websiteTargetsEuOrUkResidents ? 'Yes' : 'No') : 'N/A' },
        { label: 'California Exposure', value: data.company.hasPublicWebsite ? (data.company.websiteTargetsCaliforniaResidents ? 'Yes' : 'No') : 'N/A' },
        { label: 'Privacy Notice', value: data.company.hasPublicWebsite ? (data.company.websiteHasPrivacyNotice ? 'Published' : 'Not documented') : 'N/A' },
        { label: 'Cookie Consent', value: data.company.hasPublicWebsite ? (data.company.websiteHasCookieBanner ? 'Available' : 'Not documented') : 'N/A' },
        { label: 'Data Subject Access Request (DSAR) channel', value: data.company.hasPublicWebsite ? (data.company.dsarRequestChannel || data.company.primaryContactEmail) : 'N/A' },
        { label: 'Contact Name', value: data.company.primaryContactName },
        { label: 'Contact Email', value: data.company.primaryContactEmail },
        { label: 'Industry', value: data.company.industry },
        { label: 'Compliance Maturity', value: displayLabel(data.company.complianceMaturity).replace(/ program$/i, '') },
        { label: 'SOX / ITGC Applicability', value: displayLabel(data.company.soxApplicability) },
        { label: 'Target Audit', value: displayLabel(data.company.targetAuditType) },
      ],
      actions: [{ label: 'Open Welcome', href: '/wizard?step=0' }],
    },
    {
      title: 'System scope',
      completionStatus: scopeStatus,
      rows: [
        { label: 'System Name', value: data.scope.systemName, required: true },
        { label: 'Description', value: data.scope.systemDescription, required: true },
        { label: 'Protected Health Information (PHI) in scope', value: data.scope.containsPhi ? 'Yes' : 'No' },
        { label: 'Cardholder Data Environment (CDE) in scope', value: data.scope.hasCardholderDataEnvironment ? 'Yes' : 'No' },
        { label: 'Tenancy', value: data.scope.isMultiTenant ? 'Multi-tenant SaaS' : 'Single-tenant' },
      ],
      badgeLabel: 'Data Types',
      badges: data.scope.dataTypesHandled,
      notes: [
        ...(data.scope.containsPhi
          ? [{
              title: 'HIPAA administrative safeguards preview',
              body: 'Generated drafts will include workforce access administration, HRIS and identity-driven access changes, PHI-aware training and sanctions expectations, incident escalation, and vendor oversight language for healthcare-regulated data.',
              tone: 'emerald' as const,
            }]
          : []),
        ...(data.scope.hasCardholderDataEnvironment
          ? [{
              title: 'PCI segmentation preview',
              body: 'Generated drafts will include cardholder data environment boundary ownership, segmentation change review, restricted connectivity expectations, administrative access controls, and vendor impact on the CDE.',
              tone: 'blue' as const,
            }]
          : []),
      ],
      actions: [{ label: 'Open System Scope', href: '/wizard?step=2' }],
    },
    {
      title: 'TSC & infrastructure',
      completionStatus: combineStepStatuses([infrastructureStatus, tscStatus]),
      completionDetail: `Infrastructure ${completionLabel(infrastructureStatus).toLowerCase()} · TSC ${completionLabel(tscStatus).toLowerCase()}`,
      rows: [
        { label: 'Cloud Providers', value: data.infrastructure.cloudProviders.map(formatCloudProvider).join(', ') || data.infrastructure.type || '-' },
        { label: 'Identity Provider (IdP)', value: data.infrastructure.idpProvider },
        { label: 'Availability Zones', value: data.infrastructure.usesAvailabilityZones ? 'Yes' : 'No' },
        { label: 'Virtual Private Network (VPN) logging', value: data.infrastructure.usesCloudVpn ? 'Enabled' : 'No' },
        ...(data.infrastructure.hostsOwnHardware ? [{ label: 'On-Premises Hardware', value: 'Yes' }] : []),
      ],
      badgeLabel: 'Trust Service Criteria',
      badges: selectedTscLabels(data),
      actions: [
        { label: 'Open Infrastructure', href: '/wizard?step=1' },
        { label: 'Open TSC', href: '/wizard?step=4' },
      ],
    },
    {
      title: 'Governance & training',
      completionStatus: governanceStatus,
      rows: [
        { label: 'Policy Acknowledgement', value: displayLabel(data.governance.acknowledgementCadence) },
        { label: 'Training Tool', value: data.training.securityAwarenessTrainingTool || undefined },
        { label: 'Training Cadence', value: displayLabel(data.training.trainingCadence) },
        ...(data.training.hasPhishingSimulation ? [{ label: 'Phishing Sim', value: displayLabel(data.training.phishingSimulationFrequency) }] : []),
      ],
      badges: [
        ...(data.governance.hasEmployeeHandbook ? ['Employee handbook'] : []),
        ...(data.governance.hasCodeOfConduct ? ['Code of conduct'] : []),
        ...(data.governance.hasDisciplinaryProcedures ? ['Disciplinary procedures'] : []),
        ...(data.governance.hasBoardOrAdvisory ? ['Board / advisory'] : []),
        ...(data.governance.hasDedicatedSecurityOfficer ? [data.governance.securityOfficerTitle || 'Security officer'] : []),
        ...(data.governance.hasOrgChart ? ['Org chart'] : []),
        ...(data.governance.hasJobDescriptions ? ['Job descriptions'] : []),
        ...(data.governance.hasInternalAuditProgram ? ['Internal audit'] : []),
      ],
      actions: [{ label: 'Open Governance', href: '/wizard?step=3' }],
    },
    ...(hasSoxApplicability(data)
      ? [{
          title: 'SOX / ITGC readiness',
          completionStatus: combineStepStatuses([governanceStatus, operationsStatus]),
          completionDetail: `Governance ${completionLabel(governanceStatus).toLowerCase()} · Operations ${completionLabel(operationsStatus).toLowerCase()}`,
          rows: [
            { label: 'Applicability Driver', value: displayLabel(data.company.soxApplicability) },
            { label: 'Internal Audit Program', value: data.governance.hasInternalAuditProgram ? 'Yes' : 'No' },
            { label: 'Risk Register', value: data.operations.hasRiskRegister ? 'Yes' : 'No' },
            { label: 'Multi-Factor Authentication (MFA) Required', value: data.operations.requiresMfa ? 'Yes' : 'No' },
            { label: 'Peer Review Required', value: data.operations.requiresPeerReview ? 'Yes' : 'No' },
            { label: 'Human Resources Information System (HRIS) Provider', value: data.operations.hrisProvider },
            { label: 'Ticketing System', value: data.operations.ticketingSystem },
            { label: 'Version Control System (VCS) / Branch-protection guide provider', value: data.operations.vcsProvider },
          ],
          badges: [
            'SOX template set enabled',
            ...(data.governance.hasInternalAuditProgram ? ['Internal audit cadence defined'] : []),
            ...(data.operations.hasRiskRegister ? ['Risk register available'] : []),
            ...(data.operations.requiresPeerReview ? ['Change approvals in workflow'] : []),
            ...(data.operations.requiresMfa ? ['Access hardening enabled'] : []),
          ],
          notes: [
            {
              title: 'SOX focus areas',
              body: [
                !data.governance.hasInternalAuditProgram ? 'internal-audit ownership' : null,
                !data.operations.hasRiskRegister ? 'risk-register discipline' : null,
                !data.operations.requiresPeerReview ? 'change-approval evidence' : null,
                !data.operations.requiresMfa ? 'strong access controls' : null,
              ].filter(Boolean).length
                ? `Before relying on the SOX documents, tighten ${[
                    !data.governance.hasInternalAuditProgram ? 'internal-audit ownership' : null,
                    !data.operations.hasRiskRegister ? 'risk-register discipline' : null,
                    !data.operations.requiresPeerReview ? 'change-approval evidence' : null,
                    !data.operations.requiresMfa ? 'strong access controls' : null,
                  ].filter(Boolean).join(', ')}.`
                : 'The current draft already covers the main governance and operations signals that the SOX template set expects.',
              tone: data.governance.hasInternalAuditProgram && data.operations.hasRiskRegister && data.operations.requiresPeerReview && data.operations.requiresMfa ? 'emerald' : 'blue',
            },
          ],
          actions: [
            { label: 'Open Welcome', href: '/wizard?step=0' },
            { label: 'Open Governance', href: '/wizard?step=3' },
            { label: 'Open Operations', href: '/wizard?step=7' },
          ],
        } satisfies SummaryCard]
      : []),
    {
      title: 'Security tooling',
      completionStatus: toolingStatus,
      rows: [
        { label: 'Pen Test Frequency', value: displayLabel(data.securityTooling.penetrationTestFrequency) },
        { label: 'Log Retention', value: `${data.securityTooling.logRetentionDays} days` },
      ],
      badges: [
        ...(data.securityTooling.siemTool ? [`SIEM: ${data.securityTooling.siemTool}`] : []),
        ...(data.securityTooling.hasIdsIps ? ['IDS/IPS'] : []),
        ...(data.securityTooling.hasWaf ? ['WAF'] : []),
        ...(data.securityTooling.endpointProtectionTool ? [`EPP: ${data.securityTooling.endpointProtectionTool}`] : []),
        ...(data.securityTooling.hasMdm ? [`MDM${data.securityTooling.mdmTool ? `: ${data.securityTooling.mdmTool}` : ''}`] : []),
        ...(data.securityTooling.vulnerabilityScanningTool ? [`Vuln scan: ${data.securityTooling.vulnerabilityScanningTool}`] : []),
        ...(data.securityTooling.hasDast ? ['DAST'] : []),
        ...(data.securityTooling.monitoringTool ? [`Monitoring: ${data.securityTooling.monitoringTool}`] : []),
        ...(data.securityTooling.hasAutoscaling ? ['Autoscaling'] : []),
      ],
      actions: [{ label: 'Open Security Tooling', href: '/wizard?step=6' }],
    },
    {
      title: 'Operations',
      completionStatus: operationsStatus,
      rows: [
        { label: 'Source Control Tool Name', value: data.operations.versionControlSystem },
        { label: 'Version Control System (VCS) / Branch-protection guide provider', value: data.operations.vcsProvider },
        { label: 'Ticketing', value: data.operations.ticketingSystem },
        { label: 'On-Call Tool', value: data.operations.onCallTool },
        { label: 'Human Resources Information System (HRIS) provider', value: data.operations.hrisProvider },
        { label: 'Termination Service Level Agreement (SLA)', value: `${data.operations.terminationSlaHours} hours` },
        { label: 'Onboarding Service Level Agreement (SLA)', value: `${data.operations.onboardingSlaDays} business days` },
        { label: 'Acceptable Use Scope', value: data.operations.acceptableUseScope },
        { label: 'Security Reporting', value: data.operations.securityReportChannel || data.company.primaryContactEmail },
        ...(data.operations.requiresLostDeviceReporting ? [{ label: 'Lost Device Reporting', value: `${data.operations.lostDeviceReportSlaHours} hours` }] : []),
      ],
      badges: [
        ...(data.operations.requiresMfa ? ['MFA required'] : []),
        ...(data.operations.requiresPeerReview ? ['Peer review'] : []),
        ...(data.operations.requiresCyberInsurance ? ['Cyber insurance'] : []),
        ...(data.operations.requiresApprovedSoftware ? ['Approved tools only'] : []),
        ...(data.operations.restrictsCompanyDataToApprovedSystems ? ['Approved data locations'] : []),
        ...(data.operations.monitorsCompanySystems ? ['System monitoring notice'] : []),
        ...(data.operations.permitsLimitedPersonalUse ? ['Limited personal use'] : []),
        ...(data.operations.hasRiskRegister ? ['Risk register'] : []),
        ...(data.operations.hasNdaProcess ? ['NDAs'] : []),
        ...(data.operations.dataRetentionDefined ? ['Retention schedule'] : []),
      ],
      subservices: data.subservices
        .filter((subservice) => subservice.name)
        .map((subservice) => ({
          name: subservice.name,
          detail: `${subservice.role}${subservice.hasAssuranceReport ? ` · ${subservice.assuranceReportType}` : ' · No assurance report'}`,
        })),
      actions: [{ label: 'Open Operations', href: '/wizard?step=7' }],
    },
  ];
}

export function WizardStageSummaryCards({ data, organizationName, highWaterStep = 0 }: { data: WizardData; organizationName: string; highWaterStep?: number }) {
  const cards = buildSummaryCards(data, organizationName, highWaterStep);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{card.title}</CardTitle>
                {card.completionDetail ? <p className="mt-1 text-xs text-muted-foreground">{card.completionDetail}</p> : null}
              </div>
              <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide', completionBadgeClassName(card.completionStatus))}>
                {completionLabel(card.completionStatus)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {card.badges?.length ? (
              <div>
                {card.badgeLabel ? <p className="mb-1 text-xs text-muted-foreground">{expandAcronymsInText(card.badgeLabel)}</p> : null}
                <div className="flex flex-wrap gap-1.5">
                  {card.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {expandAcronymsInText(badge)}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-1.5">
              {card.rows.map((row) => (
                <SummaryRowItem key={`${card.title}-${row.label}`} {...row} />
              ))}
            </div>

            {card.notes?.map((note) => {
              const toneClasses = note.tone === 'emerald'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-blue-200 bg-blue-50 text-blue-900';
              const bodyClasses = note.tone === 'emerald' ? 'text-emerald-800' : 'text-blue-800';

              return (
                <div key={note.title} className={cn('rounded-2xl border p-3 text-xs', toneClasses)}>
                  <p className="font-semibold">{expandAcronymsInText(note.title)}</p>
                  <p className={cn('mt-1', bodyClasses)}>{expandAcronymsInText(note.body)}</p>
                </div>
              );
            })}

            {card.subservices?.length ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-xs text-muted-foreground">Subservice organizations</p>
                {card.subservices.map((subservice) => (
                  <div key={subservice.name} className="rounded-xl bg-secondary/60 px-3 py-2">
                    <p className="text-xs font-medium text-foreground">{expandAcronymsInText(subservice.name)}</p>
                    <p className="text-[10px] text-muted-foreground">{expandAcronymsInText(subservice.detail)}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-1">
              {card.actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary/50"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}