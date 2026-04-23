import type { WizardData } from './schema';

export interface TemplateManifestEntry {
  name: string;
  tsc: string;
  criteriaHint: string;
  description: string;
}

// Mirrors the active templates in the database seed.
// Security (CC1–CC9) is always included; optional TSCs add extra templates.
const SECURITY_TEMPLATES: TemplateManifestEntry[] = [
  { name: 'Information Security Policy', tsc: 'Security', criteriaHint: 'CC1–CC9', description: 'Your master security policy establishing the org\'s security objectives, roles, and overall control framework. Typically the first document an auditor requests.' },
  { name: 'Access Control & Offboarding Policy', tsc: 'Security', criteriaHint: 'CC6', description: 'Governs how access is granted to systems and revoked when employees leave. Incorporates your termination SLA and HRIS provider.' },
  { name: 'Incident Response Plan', tsc: 'Security', criteriaHint: 'CC7', description: 'Defines how your team detects, contains, and recovers from security incidents — including severity levels, escalation paths, and post-incident review.' },
  { name: 'Change Management Policy', tsc: 'Security', criteriaHint: 'CC8', description: 'Controls the process for reviewing, approving, and deploying changes to production. References your VCS provider and peer review requirements.' },
  { name: 'Risk Management Policy', tsc: 'Security', criteriaHint: 'CC3, CC9', description: 'Establishes your risk identification, assessment, and treatment process including risk register cadence and vendor risk review procedures.' },
  { name: 'Vendor Management Policy', tsc: 'Security', criteriaHint: 'CC3, CC9', description: 'Governs how third-party service providers are evaluated and monitored. Populated with your subservice organizations and their assurance report status.' },
  { name: 'Secure SDLC Policy', tsc: 'Security', criteriaHint: 'CC8', description: 'Defines security requirements throughout your software development lifecycle — from design and code review through testing and deployment.' },
  { name: 'Physical Security Policy', tsc: 'Security', criteriaHint: 'CC6', description: 'Covers physical access controls for your office and any data center environments. Tailored based on whether you host your own hardware.' },
  { name: 'Acceptable Use Policy', tsc: 'Security', criteriaHint: 'CC1, CC2', description: 'Establishes rules for how employees use company systems, devices, and data. References your MDM, endpoint protection, and data classification choices.' },
  { name: 'Internal Audit & Monitoring Policy', tsc: 'Security', criteriaHint: 'CC2, CC4', description: 'Describes how your organization monitors controls, reviews security logs, and conducts internal assessments. Maps to your SIEM and audit program settings.' },
  { name: 'Data Retention & Disposal Policy', tsc: 'Security', criteriaHint: 'CC6, CC9', description: 'Defines how long different data types are retained and how data is securely destroyed at end of life. Populated from your retention schedule settings.' },
  { name: 'SOC 2 Evidence Checklist', tsc: 'Security', criteriaHint: 'All criteria', description: 'A complete, org-specific list of every evidence artifact your auditor will request, organized by TSC criterion. Generated from your full wizard responses.' },
  { name: 'System Description (DC 200)', tsc: 'Security', criteriaHint: 'All criteria', description: 'The auditor-facing narrative describing your system boundary, infrastructure, and control environment. The most organization-specific document in the package.' },
];

const AVAILABILITY_TEMPLATES: TemplateManifestEntry[] = [
  { name: 'Business Continuity & Disaster Recovery Policy', tsc: 'Availability', criteriaHint: 'A1', description: 'Establishes your recovery time (RTO) and recovery point (RPO) objectives and the procedures for restoring operations after a disruption.' },
  { name: 'Backup & Recovery Policy', tsc: 'Availability', criteriaHint: 'A1', description: 'Defines backup frequency, retention periods, and recovery testing requirements. Tailored to your cloud provider and infrastructure configuration.' },
];

const CONFIDENTIALITY_TEMPLATES: TemplateManifestEntry[] = [
  { name: 'Data Classification & Handling Policy', tsc: 'Confidentiality', criteriaHint: 'C1', description: 'Establishes data classification tiers (public, internal, confidential, restricted) and handling requirements for each. Maps to your selected data types.' },
  { name: 'Encryption Policy', tsc: 'Confidentiality', criteriaHint: 'C1', description: 'Defines encryption requirements for data at rest and in transit, referencing your minimum TLS protocol version and key management approach.' },
];

const PRIVACY_TEMPLATES: TemplateManifestEntry[] = [
  { name: 'Privacy Notice & Consent Framework', tsc: 'Privacy', criteriaHint: 'P1–P8', description: 'A GDPR/CCPA-aligned privacy notice template and consent mechanism framework. Triggered by your Customer PII data type selection.' },
];

export function getExpectedTemplates(tscSelections: WizardData['tscSelections']): TemplateManifestEntry[] {
  return [
    ...SECURITY_TEMPLATES,
    ...(tscSelections.availability ? AVAILABILITY_TEMPLATES : []),
    ...(tscSelections.confidentiality ? CONFIDENTIALITY_TEMPLATES : []),
    ...(tscSelections.privacy ? PRIVACY_TEMPLATES : []),
  ];
}
