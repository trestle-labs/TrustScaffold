# Risk Management Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC3.1, CC3.2, CC3.3, CC3.4, CC9.1, CC9.2 -->

| Field | Value |
| --- | --- |
| Template slug | `risk-management-policy` |
| TSC category | Security |
| Criteria mapped | CC3, CC9 |
| Purpose | Risk identification, scoring, treatment, and review expectations. |
| Output filename | `05-risk-management-policy.md` |

---

---
title: Risk Management Policy
slug: risk-management-policy
tsc_category: Security
criteria_mapped:
  - CC3
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: CC3, CC9 -->

# Risk Management Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Objective
{{organization_name}} identifies, evaluates, and treats risks that could affect the confidentiality, integrity, and availability of systems and data.

## Process
1. Risks are logged in the risk register.
2. Each risk is assigned an owner, likelihood, impact, and treatment plan.
3. Open risks are reviewed every {{risk_review_frequency}}.

## Sources of Risk
- Product and engineering changes
- Vendor and subprocessor changes
- Security incidents and audit findings
- Regulatory or contractual obligations

{{#if has_subprocessors}}
## Current Critical Subprocessors
{{#each subprocessors}}
- {{name}}: {{service_description}}
{{/each}}
{{/if}}

## Approval
The risk register is reviewed by {{approver_name}} and executive leadership.
