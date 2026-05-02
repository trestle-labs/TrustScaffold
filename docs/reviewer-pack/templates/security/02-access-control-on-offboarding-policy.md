# Access Control and On/Offboarding Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8 -->

| Field | Value |
| --- | --- |
| Template slug | `access-control-on-offboarding-policy` |
| TSC category | Security |
| Criteria mapped | CC6 |
| Purpose | User provisioning, privilege management, and access revocation requirements. |
| Output filename | `02-access-control-on-offboarding-policy.md` |

---

---
title: Access Control and On/Offboarding Policy
slug: access-control-on-offboarding-policy
tsc_category: Security
criteria_mapped:
  - CC6
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

> This document is a starting-point compliance template and must be reviewed before use.

# Access Control and On/Offboarding Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Objective
{{organization_name}} grants access according to least privilege and removes access promptly when employment or engagement changes.

## Provisioning
- Hiring managers submit access requests with role, systems, and justification.
- Access to production systems requires approval from {{approver_name}} or a delegated admin.
- Shared accounts are prohibited unless explicitly approved and logged.

## Authentication
- MFA is required for administrative access.
- Passwords must be stored only in approved password managers.
{{#if uses_azure}}
- Workforce identities are managed through Microsoft Entra ID conditional access policies.
{{/if}}
{{#if uses_aws}}
- Console access in AWS requires federated or SSO-backed identities wherever feasible.
{{/if}}
{{#if uses_gcp}}
- Console access in GCP requires federated or SSO-backed identities, least-privilege IAM roles, and monitored privileged access.
{{/if}}

## Role Changes and Reviews
- Access is reviewed every {{access_review_frequency}}.
- Privileged roles are re-certified by the system owner.

## Offboarding
- Access revocation begins within {{offboarding_sla_hours}} hours of termination notice.
- Device return, token revocation, and credential invalidation are documented.

## Standard Operating Procedure: Access Requests and Revocation
1. The requester opens an access ticket in {{ticketing_system}} with the user, role, system, business justification, and requested access duration.
2. The approving manager or system owner validates the access need and records approval before provisioning.
3. The control operator provisions only the approved role or group and attaches provisioning evidence to the ticket.
4. Access changes, privileged grants, and emergency access are reviewed during the next access review cycle.
5. Offboarding tickets document account disablement, session/token revocation, device return, and evidence retained by the control operator.

## Evidence
{{organization_name}} retains approval and revocation records in its ticketing and identity systems.
