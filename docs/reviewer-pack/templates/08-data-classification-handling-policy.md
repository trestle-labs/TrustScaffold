# Data Classification and Handling Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: C1.1, C1.2 -->

| Field | Value |
| --- | --- |
| Template slug | `data-classification-handling-policy` |
| TSC category | Confidentiality |
| Criteria mapped | C1 |
| Purpose | Classification levels and handling requirements for company and customer data. |
| Output filename | `08-data-classification-handling-policy.md` |

---

---
title: Data Classification and Handling Policy
slug: data-classification-handling-policy
tsc_category: Confidentiality
criteria_mapped:
  - C1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: C1 -->

# Data Classification and Handling Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Classification Levels
{{#each data_classifications}}
- {{name}}: {{description}}
{{/each}}

## Handling Requirements
- Data is shared only with approved personnel and vendors.
- Sensitive data is stored only in approved systems.
- Customer data exports require documented approval.

## Scope Notes
{{#if stores_customer_pii}}
{{organization_name}} stores customer personal information and applies heightened access and retention controls.
{{/if}}
{{#if stores_phi}}
{{organization_name}} handles protected health information (PHI) and applies regulated healthcare safeguards, minimum-necessary access controls, and enhanced incident-handling requirements.
{{/if}}
{{#if has_cardholder_data_environment}}
{{organization_name}} operates an in-scope cardholder data environment (CDE) and restricts cardholder-data access, transmission, and storage to approved systems within that boundary.
{{/if}}
{{#if has_subprocessors}}
Approved subprocessors handling sensitive data are listed in the vendor register.
{{/if}}
