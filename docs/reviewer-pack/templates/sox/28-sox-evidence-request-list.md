# SOX Access and Change Evidence Request List

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: COMMON, SOX -->

| Field | Value |
| --- | --- |
| Template slug | `sox-evidence-request-list` |
| TSC category | SOX / ITGC |
| Criteria mapped | COMMON, SOX |
| Purpose | SOX-oriented evidence request list for access management, change management, privileged access, and key-report controls. |
| Output filename | `28-sox-evidence-request-list.md` |

---

---
title: SOX Access and Change Evidence Request List
slug: sox-evidence-request-list
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, SOX -->

# SOX Access and Change Evidence Request List

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
This checklist helps {{organization_name}} collect the evidence commonly requested for SOX ITGC reviews across access provisioning, privileged access, access recertification, change management, deployments, and key-report controls for the selected driver: {{sox_applicability_label}}.

## Access Management Evidence
- [ ] Current user listings for in-scope systems from {{idp_provider}} and connected applications.
- [ ] New-access requests with documented approval.
- [ ] Role-change requests and approvals.
- [ ] Termination / offboarding samples showing revocation within {{termination_sla_hours}} hours.
- [ ] Privileged-access roster and business justification.
- [ ] MFA policy screenshots or configuration exports.
- [ ] Quarterly access review sign-off package covering key systems.

## Change Management Evidence
- [ ] Change tickets from {{ticketing_system}} tied to releases or production changes.
- [ ] Pull requests or merge requests from {{source_control_tool}} showing reviewer approval.
- [ ] Test evidence for selected changes.
- [ ] Deployment log or release record.
- [ ] Emergency-change list with retrospective approval.
- [ ] Segregation-of-duties exceptions and compensating controls, if any.

## Operations and Monitoring Evidence
- [ ] Monitoring alerts and incident tickets for material production events.
- [ ] Backup success / restore evidence for critical environments.
- [ ] Problem-management or recurring-issue tracking for failed jobs, integrations, or reconciliations.

## Key Reports and Interfaces
- [ ] Inventory of key reports, data extracts, spreadsheets, and interfaces used in financial reporting or management review.
- [ ] Evidence showing report logic or query ownership.
- [ ] Review or reconciliation evidence for report completeness and accuracy.
- [ ] Change evidence when report logic, interface mappings, or spreadsheet formulas change.

## Review Notes
- Access evidence should be refreshed {{sox_access_review_frequency}}.
- Change-control evidence should be retained {{sox_change_review_frequency}}.
- Internal audit, finance, and system owners should confirm whether additional population exports or reconciliations are required for ICFR scoping.
