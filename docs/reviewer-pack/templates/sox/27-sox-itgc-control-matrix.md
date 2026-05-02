# SOX IT General Controls Matrix

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: COMMON, SOX -->

| Field | Value |
| --- | --- |
| Template slug | `sox-itgc-control-matrix` |
| TSC category | SOX / ITGC |
| Criteria mapped | COMMON, SOX |
| Purpose | SOX-oriented IT general controls matrix for entity-level governance, access, change management, and system operations. |
| Output filename | `27-sox-itgc-control-matrix.md` |

---

---
title: SOX IT General Controls Matrix
slug: sox-itgc-control-matrix
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, SOX -->

# SOX IT General Controls Matrix

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains this matrix to map IT general controls that may support Sarbanes-Oxley (SOX) internal control over financial reporting (ICFR), IPO readiness, parent-company control requests, and internal-audit evidence collection.

## Scoping Note
- This is a baseline ITGC matrix, not a legal determination that {{primary_product_name}} is in scope for SOX.
- Selected SOX / ITGC driver: {{sox_applicability_label}}.
- Finance, controllership, internal audit, and system owners should confirm whether the product, connected systems, key reports, interfaces, or spreadsheets affect financial reporting.

## ITGC Matrix
| Control Domain | Control Objective | TrustScaffold Baseline | Typical Evidence | Owner | Review Frequency | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Entity-level governance | Management assigns control ownership, review cadence, and escalation for ITGC issues. | Policy governance, internal audit cadence, and management review operate through the security baseline. | Policy approvals, governance meeting minutes, deficiency log | {{sox_control_owner}} | {{sox_review_frequency}} | Draft |
| User provisioning | Access to in-scope systems is approved before access is granted. | Access requests, approvals, and onboarding flow are documented through the access-control policy and {{hris_provider}} lifecycle process. | Access tickets, approval records, onboarding evidence | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Access modification and removal | Role changes and terminations are reflected promptly in connected systems. | Joiner / mover / leaver control relies on {{hris_provider}}, {{idp_provider}}, and the offboarding SLA. | HR change record, termination ticket, deprovisioning screenshots | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Privileged access | Elevated access is limited, approved, and reviewed. | MFA, privileged-access restriction, and periodic review expectations are part of the baseline control set. | Admin roster, privileged group export, MFA policy, review sign-off | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Access recertification | Management reviews access for key systems on a recurring basis. | Quarterly access review cadence is expected for systems with material operational or reporting impact. | Access review workbook, reviewer sign-off, remediation tickets | {{sox_control_owner}} | {{sox_access_review_frequency}} | Draft |
| Change management | Changes are authorized, tested, reviewed, and promoted through controlled workflows. | Changes to {{primary_product_name}} move through {{source_control_tool}} and {{ticketing_system}} with peer review and approval expectations. | Change ticket, pull request, test evidence, deployment log | {{control_operator}} | {{sox_change_review_frequency}} | Draft |
| Emergency changes | Emergency changes are separately identified, approved, and retrospectively reviewed. | Emergency changes follow the baseline change policy and require after-the-fact review. | Emergency ticket, incident reference, post-change approval | {{control_operator}} | {{sox_change_review_frequency}} | Draft |
| Job operations and monitoring | Scheduled jobs, incident response, and production exceptions are monitored and resolved. | Incident, monitoring, and backup controls create the baseline operating evidence set. | Monitoring alerts, incident tickets, failed-job log, backup results | {{control_operator}} | {{sox_review_frequency}} | Draft |
| Interfaces and key reports | Systems and reports used in reporting or reconciliations are inventoried and reviewed. | To be completed during finance and internal-audit scoping. | Report inventory, interface list, reconciliation evidence | {{finance_system_owner}} | {{sox_review_frequency}} | To be scoped |

## Next Steps
1. Mark systems, reports, integrations, and data extracts that affect ICFR.
2. Assign owners for each access, change, and operations control.
3. Link each control to evidence retained in {{ticketing_system}}, {{source_control_tool}}, {{idp_provider}}, and related systems.
4. Add compensating controls where segregation of duties or automation is limited.
