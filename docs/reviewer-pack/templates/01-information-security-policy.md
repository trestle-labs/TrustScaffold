# Information Security Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC1.1, CC1.2, CC1.3, CC1.4, CC1.5, CC2.1, CC2.2, CC2.3, CC5.1, CC5.2, CC5.3, CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8, CC7.1, CC7.2, CC7.3, CC7.4, CC7.5, CC8.1, CC9.1, CC9.2 -->

| Field | Value |
| --- | --- |
| Template slug | `information-security-policy` |
| TSC category | Security |
| Criteria mapped | CC1, CC2, CC5, CC6, CC7, CC8, CC9 |
| Purpose | Core governance policy covering organization-wide security expectations. |
| Output filename | `01-information-security-policy.md` |

---

---
title: Information Security Policy
slug: information-security-policy
tsc_category: Security
criteria_mapped:
  - CC1
  - CC2
  - CC5
  - CC6
  - CC7
  - CC8
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

> This document is a starting-point compliance template and must be reviewed by {{approver_name}} before adoption.

# Information Security Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains an information security program designed to protect customer and company data used by {{primary_product_name}}.

## Scope
This policy applies to all workforce members, contractors, and systems that support {{primary_product_name}}.

## Security Objectives
- Protect the confidentiality, integrity, and availability of systems within the documented scope.
- Maintain least-privilege access to production systems and supporting tooling.
- Record and review security-relevant changes and incidents.

## Environment Summary
{{organization_name}} operates as a {{deployment_model}} service.
{{#if uses_aws}}
- AWS services are used for core infrastructure and must follow approved account and IAM baselines.
{{/if}}
{{#if uses_azure}}
- Azure services are used for identity and platform controls and must follow approved tenant and subscription baselines.
{{/if}}
{{#if uses_gcp}}
- GCP services are used for supporting workloads and must inherit approved project-level guardrails.
{{/if}}
{{#if is_multi_tenant}}
- Production workloads are multi-tenant and require tenant-aware logical access controls.
{{/if}}

## Roles and Responsibilities
- Executive Sponsor: {{executive_sponsor_name}}
- Security Owner: {{system_owner_name}}
- Primary Contact: {{security_contact_email}}

## Policy Statements
1. Access to systems and data is granted based on documented business need.
2. Security events are logged, reviewed, and escalated according to the incident response plan.
3. Changes to production systems require documented review and approval.
4. Vendors handling sensitive data are evaluated before onboarding and periodically thereafter.

## Exceptions
Exceptions require written approval from {{approver_name}} and must include an expiration date and compensating controls.
