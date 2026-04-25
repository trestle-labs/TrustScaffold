# Change Management Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `change-management-policy` |
| TSC category | Security |
| Criteria mapped | CC8 |
| Purpose | Requirements for planning, reviewing, approving, and validating changes. |
| Output filename | `04-change-management-policy.md` |

---

---
title: Change Management Policy
slug: change-management-policy
tsc_category: Security
criteria_mapped:
  - CC8
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Change Management Policy

## Purpose
Changes to systems supporting {{primary_product_name}} must be documented, reviewed, approved, and validated before release unless emergency procedures apply.

## Standard Changes
- Every change includes a summary, affected services, rollback plan, and testing evidence.
- Peer review is required before deployment to production.
- High-risk changes require approval from {{approver_name}}.

## Emergency Changes
Emergency changes may bypass normal approval only to restore availability or reduce active risk, and must be retrospectively reviewed within {{post_incident_review_window}}.

## Infrastructure-Specific Requirements
{{#if uses_aws}}
- Infrastructure changes in AWS are performed through reviewed infrastructure-as-code repositories.
{{/if}}
{{#if uses_azure}}
- Platform and identity changes in Azure are tracked through pull requests and activity logs.
{{/if}}
{{#if uses_gcp}}
- Platform, IAM, and organization-policy changes in GCP are tracked through reviewed infrastructure-as-code or approved administrative change records.
{{/if}}
{{#if uses_hybrid}}
- Hybrid and on-premise changes include validation of cloud connectivity, segmentation, physical dependency impact, and rollback steps.
{{/if}}

## Evidence
Deployment history, code review records, and validation results are retained for audit support.
