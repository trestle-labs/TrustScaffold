# Encryption Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `encryption-policy` |
| TSC category | Confidentiality |
| Criteria mapped | C1 |
| Purpose | Encryption requirements for data in transit, at rest, and key management. |
| Output filename | `09-encryption-policy.md` |

---

---
title: Encryption Policy
slug: encryption-policy
tsc_category: Confidentiality
criteria_mapped:
  - C1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Encryption Policy

## Objective
{{organization_name}} protects sensitive data through approved encryption controls and key management processes.

## Requirements
- Data in transit uses TLS {{minimum_tls_version}} or stronger.
- Data at rest uses provider-managed or customer-managed encryption for critical systems.
- Secrets are stored in approved secret-management tooling.

{{#if uses_aws}}
## AWS Controls
- KMS-managed encryption is enabled for supported storage and database services.
{{/if}}
{{#if uses_azure}}
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

## Exceptions
Exceptions require approval from {{approver_name}} and a documented compensating control.
