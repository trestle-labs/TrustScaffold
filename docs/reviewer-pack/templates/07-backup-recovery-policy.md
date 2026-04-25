# Backup and Recovery Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: A1.1, A1.2, A1.3 -->

| Field | Value |
| --- | --- |
| Template slug | `backup-recovery-policy` |
| TSC category | Availability |
| Criteria mapped | A1 |
| Purpose | Backup scheduling, protection, retention, and restoration validation. |
| Output filename | `07-backup-recovery-policy.md` |

---

---
title: Backup and Recovery Policy
slug: backup-recovery-policy
tsc_category: Availability
criteria_mapped:
  - A1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: A1 -->

# Backup and Recovery Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} performs backups for critical systems and validates that backup data can be restored within business requirements.

## Backup Scope
- Databases supporting {{primary_product_name}}
- Configuration repositories and infrastructure definitions
- Critical operational records and policy artifacts

## Requirements
- Backup frequency: {{backup_frequency}}
- Retention period: {{backup_retention_period}}
- Restore test cadence: {{restore_test_frequency}}
{{#if backup_encryption_enabled}}
- Backups are encrypted at rest and in transit.
{{/if}}

## Verification
Restore tests are documented and reviewed by {{approver_name}}.
