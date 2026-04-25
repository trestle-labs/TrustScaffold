# Business Associate Agreement Template

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: HIPAA -->

| Field | Value |
| --- | --- |
| Template slug | `business-associate-agreement-template` |
| TSC category | HIPAA |
| Criteria mapped | HIPAA |
| Purpose | HIPAA Business Associate Agreement baseline for vendors that create, receive, maintain, or transmit PHI. |
| Output filename | `19-business-associate-agreement-template.md` |

---

---
title: Business Associate Agreement Template
slug: business-associate-agreement-template
tsc_category: HIPAA
criteria_mapped:
  - HIPAA
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: HIPAA -->

# Business Associate Agreement Template

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
This template defines minimum Business Associate Agreement (BAA) terms required before {{organization_name}} permits a vendor, subprocessor, contractor, or other business associate to create, receive, maintain, or transmit protected health information (PHI) for {{primary_product_name}}.

## Required Parties
- Covered entity or customer: to be completed during contract review.
- Business associate: vendor or service provider handling PHI.
- {{organization_name}} owner: {{policy_owner}}.
- Legal or privacy approver: {{privacy_contact_email}}.

## Required BAA Terms
1. The business associate may use or disclose PHI only as permitted by the agreement and applicable law.
2. The business associate must implement administrative, physical, and technical safeguards appropriate to the PHI handled.
3. The business associate must report security incidents, breaches, or unauthorized uses or disclosures to {{organization_name}} without unreasonable delay and no later than {{breach_notification_window}}.
4. Subcontractors that handle PHI must agree to equivalent restrictions and safeguards.
5. PHI must be returned, destroyed, or protected under continuing obligations at contract termination.
6. The business associate must make relevant records available for compliance review where required by law or contract.

## Vendor Review Procedure
{{#if has_subprocessors}}
Vendors with PHI access are reviewed through the vendor-management process:

| Vendor | Role | Data Shared | Assurance | Review Cadence |
| --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{role}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | {{review_cadence}} |
{{/each}}
{{else}}
No current PHI-handling vendors are listed. The business owner must confirm vendor scope before PHI is shared.
{{/if}}

## Evidence
- Executed BAA or contract addendum for each PHI-handling vendor.
- Vendor security review and assurance report, where available.
- Subcontractor flow-down confirmation.
- Breach notification contact and escalation path.
- Annual BAA review evidence retained {{baa_review_frequency}}.
