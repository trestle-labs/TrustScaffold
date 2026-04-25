# Data Retention and Disposal Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `data-retention-disposal-policy` |
| TSC category | Confidentiality |
| Criteria mapped | CC6, CC9 |
| Purpose | Defines data retention schedules, disposal procedures, and evidence requirements for secure data destruction. |
| Output filename | `17-data-retention-disposal-policy.md` |

---

---
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
- **{{name}}**: Data shared ({{data_shared}}) is subject to {{name}}'s retention and disposal procedures as evaluated during {{review_cadence}}.
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
