# ISO 27001 Statement of Applicability

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: ISO27001 -->

| Field | Value |
| --- | --- |
| Template slug | `iso27001-statement-of-applicability` |
| TSC category | ISO 27001 |
| Criteria mapped | ISO27001 |
| Purpose | ISO 27001 Annex A master index showing applicability, implementation status, rationale, owners, and linked evidence. |
| Output filename | `23-iso27001-statement-of-applicability.md` |

---

---
title: ISO 27001 Statement of Applicability
slug: iso27001-statement-of-applicability
tsc_category: ISO 27001
criteria_mapped:
  - ISO27001
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: ISO27001 -->

# ISO 27001 Statement of Applicability

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
The Statement of Applicability (SoA) is {{organization_name}}'s master index for ISO 27001 Annex A controls. It records whether each control is applicable, why it is included or excluded, implementation status, ownership, and linked TrustScaffold documentation.

## SoA Review Requirements
- Reviewed {{soa_review_frequency}}.
- Updated after material changes to scope, risk assessment, vendors, infrastructure, products, or legal obligations.
- Exclusions require documented rationale and approval from {{approver_name}}.

## Starter Annex A Applicability Matrix
| Annex A Domain | Applicability | Rationale | TrustScaffold Support | Owner | Status | Reviewer Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Organizational controls | Applicable | Governance, risk, policy, supplier, legal, and incident controls are required for the ISMS. | Information Security Policy; Risk Management Policy; Vendor Management Policy; Legal and Regulatory Registry | {{policy_owner}} | Draft |  |
| People controls | Applicable | Workforce screening, training, acceptable use, and disciplinary expectations apply to all personnel. | Acceptable Use and Code of Conduct Policy; Evidence Checklist | {{control_operator}} | Draft |  |
| Physical controls | Applicable | Physical controls apply through offices, remote work, inherited cloud data center controls, or self-hosted assets. | Physical Security Policy; System Description | {{control_operator}} | Draft |  |
| Technological controls | Applicable | Identity, access, cryptography, logging, vulnerability, change, backup, and secure development controls apply to the system. | Access Control; Encryption; Secure SDLC; Change Management; Asset and Cryptographic Inventory | {{control_operator}} | Draft |  |

## Exclusion Register
| Control / Domain | Excluded? | Rationale | Compensating Control | Approver | Date |
| --- | --- | --- | --- | --- | --- |
| To be completed during ISO scoping |  |  |  | {{approver_name}} | {{effective_date}} |
