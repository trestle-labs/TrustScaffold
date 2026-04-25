# Vendor Management Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `vendor-management-policy` |
| TSC category | Security |
| Criteria mapped | CC3, CC9 |
| Purpose | Due diligence, monitoring, and approval expectations for vendors and subprocessors. |
| Output filename | `11-vendor-management-policy.md` |

---

---
title: Vendor Management Policy
slug: vendor-management-policy
tsc_category: Security
criteria_mapped:
  - CC3
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Vendor Management Policy

## Purpose
{{organization_name}} evaluates vendors before onboarding and monitors ongoing vendor risk based on the services provided.

## Minimum Due Diligence
- Security review aligned to data sensitivity and system criticality
- Contract review for confidentiality and privacy obligations
- Documentation of service owner and business justification

{{#if has_subprocessors}}
## Approved Vendors
| Vendor | Role | Service Description | Data Shared | Assurance | Inclusion | Review Cadence |
| --- | --- | --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{role}} | {{service_description}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | {{#if has_assurance_report}}{{control_inclusion}}{{else}}N/A{{/if}} | {{review_cadence}} |
{{/each}}
{{/if}}

## Complementary Controls
{{#if has_subprocessors}}
{{#each subprocessors}}
{{#if has_assurance_report}}
{{#if (eq control_inclusion 'carve-out')}}
- {{@root.organization_name}} maintains complementary subservice organization controls for {{name}}, including access restrictions, data-transfer controls, monitoring of vendor-relevant events, and review of applicable SOC report user-control considerations.
{{else}}
- {{name}} controls are evaluated through the inclusive assurance report and mapped to {{@root.organization_name}}'s control responsibilities.
{{/if}}
{{else}}
- {{@root.organization_name}} documents compensating due-diligence procedures for {{name}} until an assurance report is available.
{{/if}}
{{/each}}
{{/if}}

## Review Cadence
Critical vendors are reviewed {{vendor_review_frequency}}.
