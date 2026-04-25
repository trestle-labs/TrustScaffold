# Change Management Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC8.1 -->

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

<!-- Mapping: CC8 -->

# Change Management Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
Changes to systems supporting {{primary_product_name}} must be documented, reviewed, approved, and validated before release unless emergency procedures apply.

## Standard Changes
- Every change includes a summary, affected services, rollback plan, and testing evidence.
- Peer review is required before deployment to production.
- High-risk changes require approval from {{approver_name}}.

## Segregation of Duties in Deployments
- Production deployments require {{approval_count}} peer approval before merge or release, recorded in {{ticketing_system}} or {{source_control_tool}}.
- Technical guardrails in {{source_control_tool}} enforce branch protection, required reviews, status checks, restricted merges, and administrative override logging for production branches.
- Self-approval is prohibited: the same individual may not author, approve, and deploy a production change without documented compensating management review.
- Emergency changes that bypass a normal guardrail must receive independent retrospective review within {{post_incident_review_window}}.

## Emergency Changes
Emergency changes may bypass normal approval only to restore availability or reduce active risk, and must be retrospectively reviewed within {{post_incident_review_window}}.

## Standard Operating Procedure: Production Change Workflow
1. The change owner opens a ticket in {{ticketing_system}} with scope, risk, affected services, validation plan, rollback plan, and requested release window.
2. The author submits the change through {{source_control_tool}} and links the pull request, merge request, or release record to the change ticket.
3. Required reviewers validate design, testing, security impact, and rollback readiness before approval.
4. Technical guardrails prevent merge or deployment until required reviews and status checks pass.
5. The control operator attaches deployment evidence, validation results, and rollback outcome to the change record after release.

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
