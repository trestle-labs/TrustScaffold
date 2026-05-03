insert into public.templates (
  slug,
  name,
  description,
  tsc_category,
  criteria_mapped,
  output_filename_pattern,
  markdown_template,
  default_variables,
  is_active
)
values (
  'processing-integrity-policy',
  'Processing Integrity Policy',
  'Processing completeness, accuracy, authorization, exception handling, and reconciliation expectations.',
  'Processing Integrity',
  array['PI1'],
  'processing-integrity-policy.md',
  $tpl$---
title: Processing Integrity Policy
slug: processing-integrity-policy
tsc_category: Processing Integrity
criteria_mapped:
  - PI1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Processing Integrity Policy

## Purpose
{{organization_name}} maintains processing controls so {{primary_product_name}} transactions, workflows, reports, and customer-facing outputs are complete, valid, accurate, timely, and authorized.

## Scope
This policy applies to production processing for {{primary_product_name}}, including customer data ingestion, identity and access workflows, payment metadata workflows, regulated analytics, support workflows, integrations, scheduled jobs, and administrative processing.

## Processing Objectives
- Processing requirements are defined before material workflows are released or changed.
- Inputs are validated for required fields, format, source authorization, duplicate detection, and business-rule conformance.
- Processing jobs and service workflows record success, failure, retry, and exception states in approved logs or queues.
- Outputs, reports, notifications, and exports are reviewed or tested to confirm completeness and accuracy before release or delivery.
- Processing data is retained, protected, and disposed of according to the Data Retention and Disposal Policy.

## Input and Authorization Controls
- Production processing accepts inputs only from approved users, services, integrations, or subservice organizations.
- Administrative overrides, manual corrections, and privileged processing actions require documented business justification and approval.
- Changes to validation rules, transformation logic, reconciliation jobs, and output generation follow the Change Management Policy.

## Reconciliation and Exception Handling
- High-risk workflows are reconciled against source records, downstream outputs, or control totals at a cadence appropriate to the workflow criticality.
- Processing exceptions are captured in {{ticketing_system}}, assigned an owner, prioritized by customer and compliance impact, and resolved within {{processing_exception_sla}} or documented with an approved exception.
- Failed or partially completed jobs are reviewed to determine customer impact, data correction needs, and notification obligations.

## Monitoring and Evidence
- Processing integrity monitoring is reviewed {{processing_integrity_review_frequency}} by {{processing_integrity_owner}} or a delegate.
- Evidence includes job run logs, validation test results, reconciliation records, exception tickets, correction approvals, and output-review artifacts.
- Material processing defects are evaluated through incident response, risk management, and customer communication procedures when applicable.

## PCI, PHI, and Privacy-Sensitive Processing
{{#if has_cardholder_data_environment}}
- Payment and cardholder-data workflows are designed to keep raw cardholder data within the approved CDE boundary and rely on tokenized or masked values outside that boundary.
{{/if}}
{{#if stores_phi}}
- PHI processing workflows apply minimum-necessary access, audit logging, and correction controls consistent with healthcare-regulated data obligations.
{{/if}}
{{#if scope_includes_privacy}}
- Privacy-impacting processing changes are reviewed for notice, consent, retention, data quality, and data-subject-request implications.
{{/if}}

## Review
This policy is reviewed at least annually and after material changes to processing logic, integrations, payment workflows, regulated analytics, or customer-facing reports.
$tpl$,
  '{
    "organization_name": "Example Corp",
    "primary_product_name": "TrustScaffold Cloud",
    "effective_date": "2026-04-18",
    "policy_version": "v0.1",
    "ticketing_system": "Jira",
    "processing_exception_sla": "2 business days",
    "processing_integrity_review_frequency": "quarterly",
    "processing_integrity_owner": "Head of Operations",
    "has_cardholder_data_environment": false,
    "stores_phi": false,
    "scope_includes_privacy": false
  }'::jsonb,
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  tsc_category = excluded.tsc_category,
  criteria_mapped = excluded.criteria_mapped,
  output_filename_pattern = excluded.output_filename_pattern,
  markdown_template = excluded.markdown_template,
  default_variables = excluded.default_variables,
  is_active = excluded.is_active,
  updated_at = now();

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{#if uses_aws}}
- Console access in AWS requires federated or SSO-backed identities wherever feasible.
{{/if}}

## Role Changes and Reviews',
    '{{#if uses_aws}}
- Console access in AWS requires federated or SSO-backed identities wherever feasible.
{{/if}}
{{#if uses_gcp}}
- Console access in GCP requires federated or SSO-backed identities, least-privilege IAM roles, and monitored privileged access.
{{/if}}

## Role Changes and Reviews'
  ),
  updated_at = now()
where slug = 'access-control-on-offboarding-policy'
  and markdown_template not like '%Console access in GCP requires%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{#if uses_azure}}
- Azure Activity Logs, Entra ID logs, and Defender alerts are reviewed during incident investigation.
{{/if}}',
    '{{#if uses_azure}}
- Azure Activity Logs, Entra ID logs, and Defender alerts are reviewed during incident investigation.
{{/if}}
{{#if uses_gcp}}
- GCP Cloud Audit Logs, Security Command Center findings, and project-level IAM changes are reviewed during incident investigation.
{{/if}}
{{#if uses_hybrid}}
- Hybrid and on-premise investigations include VPN, bastion, physical-access, and endpoint telemetry where those systems may affect incident scope.
{{/if}}'
  ),
  updated_at = now()
where slug = 'incident-response-plan'
  and markdown_template not like '%GCP Cloud Audit Logs%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{#if uses_azure}}
- Platform and identity changes in Azure are tracked through pull requests and activity logs.
{{/if}}

## Evidence',
    '{{#if uses_azure}}
- Platform and identity changes in Azure are tracked through pull requests and activity logs.
{{/if}}
{{#if uses_gcp}}
- Platform, IAM, and organization-policy changes in GCP are tracked through reviewed infrastructure-as-code or approved administrative change records.
{{/if}}
{{#if uses_hybrid}}
- Hybrid and on-premise changes include validation of cloud connectivity, segmentation, physical dependency impact, and rollback steps.
{{/if}}

## Evidence'
  ),
  updated_at = now()
where slug = 'change-management-policy'
  and markdown_template not like '%organization-policy changes in GCP%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Recovery Strategy',
    '## Capacity and Dependency Monitoring
- Capacity, saturation, and service-health signals are monitored through {{monitoring_tool}} or equivalent operational tooling.
- Capacity thresholds are reviewed during continuity planning and after material infrastructure changes.
- Critical dependencies, including cloud providers, identity services, payment providers, and hybrid connectivity, are mapped to recovery owners and escalation paths.

## Recovery Strategy'
  ),
  updated_at = now()
where slug = 'business-continuity-dr-plan'
  and markdown_template not like '%Capacity and Dependency Monitoring%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    'Continuity and recovery procedures are tested every {{bcdr_test_frequency}}.',
    'Continuity and recovery procedures are tested {{bcdr_test_frequency}}.
Each test records the scenario exercised, actual recovery time, data-loss result against the RPO, failed steps, remediation owner, and retest evidence.'
  ),
  updated_at = now()
where slug = 'business-continuity-dr-plan'
  and markdown_template like '%tested every {{bcdr_test_frequency}}%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{#if uses_azure}}
## Azure Controls
- Key Vault or equivalent managed key services are used for secrets and key material.
{{/if}}

## Exceptions',
    '{{#if uses_azure}}
## Azure Controls
- Key Vault or equivalent managed key services are used for secrets and key material.
{{/if}}
{{#if uses_gcp}}
## GCP Controls
- Cloud KMS or equivalent managed key services are used for secrets and key material in GCP workloads.
- GCP audit logs and key-access events are routed to centralized monitoring for review.
{{/if}}
{{#if uses_hybrid}}
## Hybrid and On-Premises Controls
- On-premise secrets, certificates, and encryption keys are inventoried, access-controlled, rotated, and monitored with the same risk-based expectations as cloud key material.
{{/if}}

## Exceptions'
  ),
  updated_at = now()
where slug = 'encryption-policy'
  and markdown_template not like '%GCP Controls%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Retention
Personal data is retained according to documented legal, contractual, and operational requirements.

{{#if stores_phi}}',
    '## Retention
Personal data is retained according to documented legal, contractual, and operational requirements.

## Data Quality and Correction
- Personal information used for customer-facing processing is maintained with accuracy, completeness, and timeliness controls appropriate to its purpose.
- Data subject access, correction, deletion, and restriction requests are tracked through {{ticketing_system}} or an equivalent workflow until closure.
- Corrections to personal information are reviewed for downstream system and subprocessor impact before closure.

## Complaint Handling and Enforcement
- Privacy complaints, suspected privacy policy violations, and inquiries about privacy commitments are logged, assigned an owner, investigated, and resolved with documented outcomes.
- Material privacy issues are escalated to security, legal, and executive stakeholders as appropriate.
- Repeated or significant privacy control deficiencies are tracked through the risk register or internal audit remediation process.

{{#if stores_phi}}'
  ),
  updated_at = now()
where slug = 'privacy-notice-consent-policy'
  and markdown_template not like '%Data Quality and Correction%';

update public.templates
set
  markdown_template = replace(
    replace(
      markdown_template,
      '| Vendor | Service Description | Assurance Review Cadence |
| --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{service_description}} | {{review_cadence}} |
{{/each}}',
      '| Vendor | Role | Service Description | Data Shared | Assurance | Inclusion | Review Cadence |
| --- | --- | --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{role}} | {{service_description}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | {{#if has_assurance_report}}{{control_inclusion}}{{else}}N/A{{/if}} | {{review_cadence}} |
{{/each}}'
    ),
    '{{/if}}

## Review Cadence',
    '{{/if}}

## Complementary Controls
{{#if has_subprocessors}}
{{#each subprocessors}}
{{#if has_assurance_report}}
{{#if (eq control_inclusion ''carve-out'')}}
- {{@root.organization_name}} maintains complementary subservice organization controls for {{name}}, including access restrictions, data-transfer controls, monitoring of vendor-relevant events, and review of applicable SOC report user-control considerations.
{{else}}
- {{name}} controls are evaluated through the inclusive assurance report and mapped to {{@root.organization_name}}''s control responsibilities.
{{/if}}
{{else}}
- {{@root.organization_name}} documents compensating due-diligence procedures for {{name}} until an assurance report is available.
{{/if}}
{{/each}}
{{/if}}

## Review Cadence'
  ),
  updated_at = now()
where slug = 'vendor-management-policy'
  and markdown_template not like '%Complementary Controls%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Vendor and Subprocessor Evidence (CC9.2)',
    '{{#if scope_includes_processing_integrity}}
## Processing Integrity Evidence (PI1.1-PI1.5)

- [ ] Processing objective inventory identifying critical workflows, reports, scheduled jobs, integrations, and customer-facing outputs for {{primary_product_name}}.
- [ ] Input validation evidence showing required fields, authorization checks, duplicate handling, and business-rule validation for sampled critical workflows.
- [ ] Job run logs or processing-monitoring dashboards showing successful, failed, retried, and exception states.
- [ ] Reconciliation records comparing source records, control totals, downstream outputs, or customer-facing reports.
- [ ] Exception tickets from {{ticketing_system}} showing owner assignment, root cause, correction, approval, and closure within {{processing_exception_sla}} or documented exception approval.
- [ ] Output review or report QA evidence showing completeness, accuracy, timeliness, and authorized delivery.
{{#if has_cardholder_data_environment}}
- [ ] Payment-processing evidence showing cardholder data remains tokenized, masked, or isolated inside the approved CDE boundary.
{{/if}}
{{#if stores_phi}}
- [ ] PHI processing sample showing minimum-necessary access, audit trail, and correction workflow evidence.
{{/if}}
{{/if}}

{{#if scope_includes_privacy}}
## Privacy Evidence (P1-P8)

- [ ] Current privacy notice and change history showing notice updates for material processing changes.
- [ ] Consent capture or opt-in evidence for processing activities that require explicit consent.
- [ ] Data subject request log showing acknowledgement within {{dsar_acknowledgement_window}}, identity verification, completion date, and closure evidence.
- [ ] Data quality or correction evidence showing personal information corrections are reviewed and propagated to downstream systems or subprocessors where applicable.
- [ ] Privacy complaint register showing intake channel, owner, investigation steps, outcome, and escalation decision.
- [ ] Privacy monitoring or internal audit evidence showing privacy commitments are tested and deficiencies are tracked to closure.
{{/if}}

## Vendor and Subprocessor Evidence (CC9.2)'
  ),
  updated_at = now()
where slug = 'evidence-checklist'
  and markdown_template not like '%Processing Integrity Evidence (PI1.1-PI1.5)%';