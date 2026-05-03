import 'server-only';

import { stripMappingMetadata, renderTemplate } from '@trestle-labs/core';
import type { WizardData } from '@trestle-labs/core';
import { buildTemplatePayload, type BridgeLetterPrimaryAudienceId } from '@trestle-labs/core';

import type { IntegrationProvider } from '@trestle-labs/core';

type TemplateRelationItem = {
  slug: string;
  name: string;
  output_filename_pattern?: string | null;
  markdown_template?: string | null;
  default_variables?: Record<string, unknown> | null;
};

type TemplateRelation = TemplateRelationItem | TemplateRelationItem[] | null;

export type ExportableDoc = {
  id: string;
  title: string;
  file_name: string;
  content_markdown: string;
  version: number;
  input_payload: WizardData;
  templates: TemplateRelation;
};

export type ExportFile = {
  path: string;
  content: string;
};

export function getTemplateRelation(template: TemplateRelation) {
  return Array.isArray(template) ? template[0] : template;
}

function buildExportableDoc(doc: ExportableDoc, options?: {
  workspaceOrganizationName?: string | null;
  bridgeLetterPrimaryAudienceOverride?: BridgeLetterPrimaryAudienceId | null;
}) {
  const template = getTemplateRelation(doc.templates);

  if (
    template?.slug !== 'bridge-letter-comfort-letter'
    || !options?.bridgeLetterPrimaryAudienceOverride
    || !template.markdown_template
    || !template.output_filename_pattern
  ) {
    return doc;
  }

  const payload = {
    ...buildTemplatePayload(doc.input_payload, {
      workspaceOrganizationName: options.workspaceOrganizationName,
      bridgeLetterPrimaryAudienceOverride: options.bridgeLetterPrimaryAudienceOverride,
    }),
    wizard_data: doc.input_payload,
  };
  const mergedVariables = { ...(template.default_variables ?? {}), ...payload };

  return {
    ...doc,
    file_name: renderTemplate(template.output_filename_pattern, mergedVariables, template.name),
    content_markdown: stripMappingMetadata(renderTemplate(template.markdown_template, mergedVariables, template.name)),
  };
}

function folderForDoc(slug: string) {
  if (slug === 'evidence-checklist') {
    return 'evidence-requests';
  }

  if (slug === 'vendor-management-policy') {
    return 'vendor-management';
  }

  return 'policies';
}

function buildContextSummary(data: WizardData) {
  const cloudLabel = data.infrastructure.cloudProviders?.length
    ? data.infrastructure.cloudProviders.map((p) => p.toUpperCase()).join(' + ')
    : data.infrastructure.type;
  const infraLabel = data.infrastructure.hostsOwnHardware ? `${cloudLabel} + on-premises` : cloudLabel;
  const tenancy = data.scope.isMultiTenant ? 'multi-tenant SaaS' : 'single-tenant environment';

  return `This policy set was generated for a ${infraLabel} environment utilizing ${data.infrastructure.idpProvider} and ${data.operations.vcsProvider}. The scoped system is a ${tenancy}.`;
}

function buildRootReadme(data: WizardData, docs: ExportableDoc[]) {
  const folders = new Set(docs.map((doc) => folderForDoc(getTemplateRelation(doc.templates)?.slug ?? '')));

  return [
    '# TrustScaffold Export Bundle',
    '',
    buildContextSummary(data),
    '',
    '## Included Folders',
    ...Array.from(folders).sort().map((folder) => `- ${folder}/`),
    '',
    '## Infrastructure Context',
    `- Cloud providers: ${(data.infrastructure.cloudProviders ?? [data.infrastructure.type]).join(', ')}`,
    `- Hosts own hardware: ${data.infrastructure.hostsOwnHardware ? 'Yes' : 'No'}`,
    `- Legacy type: ${data.infrastructure.type}`,
    `- Identity provider: ${data.infrastructure.idpProvider}`,
    `- Version control provider: ${data.operations.vcsProvider}`,
    `- Ticketing: ${data.operations.ticketingSystem}`,
    `- On-call: ${data.operations.onCallTool}`,
    '',
    '## Critical Sub-Organizations',
    ...(data.subservices.length
      ? data.subservices.map((subservice) => `- ${subservice.name}: ${subservice.description} (${subservice.reviewCadence ?? 'annual'} assurance review)`)
      : ['- None declared']),
  ].join('\n');
}

function buildSubOrganizationRegister(data: WizardData) {
  if (!data.subservices.length) {
    return null;
  }

  return [
    '# Sub-Organization Review Register',
    '',
    '| Organization | Role | Service Description | Data Shared | Review Cadence |',
    '| --- | --- | --- | --- | --- |',
    ...data.subservices.map((subservice) => `| ${subservice.name} | ${subservice.role || '-'} | ${subservice.description} | ${subservice.dataShared || '-'} | ${subservice.reviewCadence ?? 'annual'} |`),
  ].join('\n');
}

export function buildExportFiles(docs: ExportableDoc[], options?: {
  workspaceOrganizationName?: string | null;
  bridgeLetterPrimaryAudienceOverride?: BridgeLetterPrimaryAudienceId | null;
}) {
  if (!docs.length) {
    return [] as ExportFile[];
  }

  const exportableDocs = docs.map((doc) => buildExportableDoc(doc, options));
  const sourceData = docs[0].input_payload;
  const files: ExportFile[] = [
    {
      path: 'README.md',
      content: buildRootReadme(sourceData, exportableDocs),
    },
  ];

  const vendorRegister = buildSubOrganizationRegister(sourceData);

  if (vendorRegister) {
    files.push({
      path: 'vendor-management/sub-organizations.md',
      content: vendorRegister,
    });
  }

  for (const doc of exportableDocs) {
    const template = getTemplateRelation(doc.templates);
    const folder = folderForDoc(template?.slug ?? '');

    files.push({
      path: `${folder}/${doc.file_name}`,
      content: doc.content_markdown,
    });
  }

  return files;
}

export function buildPullRequestBody(provider: IntegrationProvider, docs: ExportableDoc[]) {
  const sourceData = docs[0]?.input_payload;

  if (!sourceData) {
    return 'TrustScaffold generated updated policy artifacts.';
  }

  return [
    `TrustScaffold generated ${docs.length} approved document${docs.length === 1 ? '' : 's'} for export via ${provider}.`,
    '',
    buildContextSummary(sourceData),
    '',
    '## Included document sets',
    '- policies/',
    '- evidence-requests/',
    ...(sourceData.subservices.length ? ['- vendor-management/'] : []),
  ].join('\n');
}

export function parseAzureDevOpsOwner(repoOwner: string) {
  const [organization, ...projectParts] = repoOwner.split('/').map((part) => part.trim()).filter(Boolean);

  if (!organization || !projectParts.length) {
    throw new Error('Azure DevOps integrations must store repo owner as "organization/project"');
  }

  return {
    organization,
    project: projectParts.join('/'),
  };
}