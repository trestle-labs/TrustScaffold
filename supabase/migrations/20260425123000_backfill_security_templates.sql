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
values
  (
    'internal-audit-monitoring-policy',
    'Internal Audit and Monitoring Policy',
    'Defines the internal audit program, controls monitoring cadence, and deficiency remediation process.',
    'Security',
    array['CC2', 'CC4'],
    'internal-audit-monitoring-policy.md',
    $$---
title: Internal Audit and Monitoring Policy
slug: internal-audit-monitoring-policy
tsc_category: Security
criteria_mapped:
  - CC2
  - CC4
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

> This document is a starting-point compliance template and must be reviewed by {{approver_name}} before adoption.

# Internal Audit and Monitoring Policy

## 1. Purpose

This policy establishes {{organization_name}}'s internal audit program and ongoing monitoring activities to evaluate the design and operating effectiveness of internal controls, as required by AICPA Trust Services Criteria CC2.1, CC4.1, and CC4.2.

## 2. Scope

This policy applies to all controls within the SOC 2 trust services criteria boundary, including:
- Logical and physical access controls
- Change management controls
- Security operations controls
- Vendor management controls
- Availability and data protection controls

## 3. Internal Audit Program

### 3.1 Audit Cadence
{{#if has_internal_audit_program}}
{{organization_name}} conducts formal internal audit reviews on a **{{internal_audit_frequency}}** basis.
{{else}}
{{organization_name}} shall establish an internal audit review cadence of at least **annual** frequency.
{{/if}}

### 3.2 Audit Activities
Internal audit reviews shall include, at minimum:
- Sampling of access reviews to verify timeliness and completeness.
- Sampling of change management records to verify peer review and approval.
- Review of incident response records for adherence to playbooks.
- Verification that vendor assurance reports are current and reviewed.
- Verification that training completion rates meet the required cadence.
- Review of risk register updates and treatment plan progress.

### 3.3 Audit Independence
Internal audit activities are conducted by personnel who are independent of the processes being reviewed, or by qualified external parties. Where separation of duties is limited by organization size, compensating controls (such as management review) are documented.

## 4. Ongoing Monitoring

### 4.1 Automated Monitoring
{{#if has_siem}}
- Security events are monitored centrally via {{siem_tool}}.
{{/if}}
{{#if has_monitoring_tool}}
- Infrastructure and capacity metrics are monitored via {{monitoring_tool}}.
{{/if}}
- Alerting thresholds are configured for anomalous access patterns, failed authentication attempts, and unauthorized configuration changes.

### 4.2 Manual Monitoring
- Access reviews are performed quarterly.
- Policy acknowledgements are verified per the established cadence ({{acknowledgement_cadence}}).
{{#if has_phishing_simulation}}
- Phishing simulation results are reviewed {{phishing_simulation_frequency}} to identify awareness gaps.
{{/if}}

## 5. Deficiency Remediation

### 5.1 Identification
Control deficiencies identified through internal audit, monitoring, or external feedback are logged in {{ticketing_system}} with:
- Description of the deficiency
- Affected criteria and control objective
- Severity classification (Critical, High, Medium, Low)

### 5.2 Remediation and Tracking
- Critical and High deficiencies require a remediation plan within **5 business days**.
- All deficiencies are tracked to closure with evidence of remediation.
- Unresolved deficiencies beyond 90 days are escalated to executive leadership{{#if has_board_or_advisory}} and reported to the board/advisory body{{/if}}.

### 5.3 Lessons Learned
Significant deficiencies trigger a review of the control design and, where appropriate, updates to policies, procedures, or monitoring rules.

## 6. Reporting

{{#if has_board_or_advisory}}
Internal audit results are presented to the board or advisory body on a **{{board_meeting_frequency}}** basis.
{{else}}
Internal audit results are presented to executive leadership at least annually.
{{/if}}
Reports include:
- Summary of reviews conducted
- Deficiencies identified and remediation status
- Trends in control effectiveness
- Recommendations for control improvements

## 7. Policy Review

This policy is reviewed and updated at least annually, or following significant organizational changes.
$$,
    '{
      "organization_name": "Example Corp",
      "effective_date": "2026-04-18",
      "policy_version": "v0.1",
      "approver_name": "Jane Doe",
      "has_internal_audit_program": true,
      "internal_audit_frequency": "annual",
      "has_siem": true,
      "siem_tool": "Datadog Security",
      "has_monitoring_tool": true,
      "monitoring_tool": "Datadog",
      "acknowledgement_cadence": "hire-and-annual",
      "has_phishing_simulation": true,
      "phishing_simulation_frequency": "quarterly",
      "ticketing_system": "Jira",
      "has_board_or_advisory": false,
      "board_meeting_frequency": "quarterly"
    }'::jsonb,
    true
  ),
  (
    'data-retention-disposal-policy',
    'Data Retention and Disposal Policy',
    'Defines data retention schedules, disposal procedures, and evidence requirements for secure data destruction.',
    'Confidentiality',
    array['CC6', 'CC9'],
    'data-retention-disposal-policy.md',
    $$---
title: Data Retention and Disposal Policy
slug: data-retention-disposal-policy
tsc_category: Confidentiality
criteria_mapped:
  - CC6
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

> This document is a starting-point compliance template and must be reviewed by {{approver_name}} before adoption.

# Data Retention and Disposal Policy

## 1. Purpose

This policy defines {{organization_name}}'s requirements for data retention and secure disposal, ensuring confidential information is retained only as long as necessary and destroyed securely when no longer needed, as required by AICPA Trust Services Criteria C1.2 and related controls.

## 2. Scope

This policy applies to all data collected, processed, or stored by {{organization_name}} across all environments, including production, staging, backups, and archived data.

## 3. Data Classification

{{#if data_classifications}}
{{organization_name}} classifies data into the following categories:
{{#each data_classifications}}
- **{{name}}**: {{description}}
{{/each}}
{{else}}
Data is classified according to the Data Classification and Handling Policy.
{{/if}}

## 4. Retention Schedules

{{#if data_retention_defined}}
{{organization_name}} maintains documented retention schedules for each data classification.
{{else}}
{{organization_name}} shall define retention schedules for each data classification based on business need and regulatory requirements.
{{/if}}

### 4.1 Minimum Retention Requirements
| Data Type | Minimum Retention | Maximum Retention | Basis |
|-----------|-------------------|-------------------|-------|
| Audit logs | {{log_retention_days}} days | {{log_retention_days}} days | Operational/compliance |
| Customer data | Duration of contract + 30 days | Duration of contract + 90 days | Contractual |
| Employee records | Employment + 3 years | Employment + 7 years | Legal/regulatory |
| Backup data | {{backup_retention_period}} | {{backup_retention_period}} | Operational |
| Incident records | 3 years | 7 years | Compliance |

### 4.2 Regulatory Overrides
Where regulations (e.g., GDPR, CCPA, HIPAA) impose stricter retention limits, the regulatory requirement takes precedence.

## 5. Disposal Procedures

### 5.1 Electronic Data
- Production database records are purged using secure deletion methods.
- Backup media is overwritten or cryptographically erased.
- Cloud storage objects are deleted with verification that replicas are removed.
{{#if tracks_media_destruction}}
- Physical storage media is destroyed following documented media destruction procedures, with certificates retained.
{{/if}}

### 5.2 Paper Records
- Confidential paper records are cross-cut shredded.
- Shredding is performed on-site or by a bonded destruction service.

### 5.3 Disposal Evidence
{{#if has_data_disposal_procedure}}
All disposal actions are tracked with:
- Date of disposal
- Description of data destroyed
- Method of destruction
- Personnel who performed or witnessed the destruction
- Ticket or certificate reference
{{else}}
{{organization_name}} shall implement tracked disposal procedures with verifiable evidence of secure destruction.
{{/if}}

## 6. Customer Data Deletion

### 6.1 Contract Termination
Upon contract termination or customer request:
- Customer data is deleted from production systems within **30 days**.
- Backup copies are purged within the normal backup rotation cycle (maximum {{backup_retention_period}}).
- A confirmation of deletion is provided to the customer upon request.

### 6.2 Data Subject Requests
{{#if requires_consent}}
Data subject access and deletion requests are handled in accordance with the Privacy Policy, with acknowledgement within {{dsar_acknowledgement_window}}.
{{else}}
Data deletion requests from customers are handled per the terms of the customer agreement.
{{/if}}

## 7. Subprocessor Data Handling
{{#if has_subprocessors}}
{{#each subprocessors}}
- **{{name}}**: Data shared ({{data_shared}}) is subject to {{name}}'s retention and disposal procedures as evaluated during vendor review ({{review_cadence}} cadence).
{{/each}}
{{else}}
No subprocessors with material data access are currently in scope.
{{/if}}

## 8. Confidentiality Agreements
{{#if has_nda_process}}
All employees and contractors with access to confidential data are required to sign NDAs or confidentiality agreements prior to access provisioning.
{{else}}
{{organization_name}} shall implement NDA or confidentiality agreement requirements for personnel with access to confidential information.
{{/if}}

## 9. Policy Review

This policy is reviewed and updated at least annually, or following significant changes to data handling practices, regulations, or contractual obligations.
$$,
    '{
      "organization_name": "Example Corp",
      "effective_date": "2026-04-18",
      "policy_version": "v0.1",
      "approver_name": "Jane Doe",
      "data_retention_defined": true,
      "has_data_disposal_procedure": true,
      "has_nda_process": true,
      "tracks_media_destruction": false,
      "requires_consent": false,
      "dsar_acknowledgement_window": "5 business days",
      "log_retention_days": 90,
      "backup_retention_period": "35 days",
      "has_subprocessors": true,
      "subprocessors": [
        {
          "name": "Supabase",
          "data_shared": "Application data, user credentials",
          "review_cadence": "annual"
        }
      ],
      "data_classifications": [
        { "name": "Public", "description": "Information intended for public disclosure" },
        { "name": "Confidential", "description": "Sensitive business and customer data" }
      ]
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