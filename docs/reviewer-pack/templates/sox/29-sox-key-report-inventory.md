# SOX Key Report Inventory

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: COMMON, SOX -->

| Field | Value |
| --- | --- |
| Template slug | `sox-key-report-inventory` |
| TSC category | SOX / ITGC |
| Criteria mapped | COMMON, SOX |
| Purpose | SOX-oriented inventory of key reports, spreadsheet dependencies, management reviews, and evidence owners. |
| Output filename | `29-sox-key-report-inventory.md` |

---

---
title: SOX Key Report Inventory
slug: sox-key-report-inventory
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, SOX -->

# SOX Key Report Inventory

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains this inventory to identify key reports, data extracts, spreadsheets, and management-review artifacts that may support financial reporting controls for {{sox_applicability_label}}.

## Key Report Register
| Report / Spreadsheet | Business Purpose | Source System | Owner | Logic Owner | Review Control | Evidence Location |
| --- | --- | --- | --- | --- | --- | --- |
| Revenue or billing exception report | Detect unusual billing events or missing approvals | {{primary_product_name}} or connected finance workflow | {{finance_system_owner}} | {{control_operator}} | Management review with sign-off | {{ticketing_system}} or finance evidence folder |
| Access review population export | Support quarterly access recertification | {{idp_provider}} and in-scope applications | {{sox_control_owner}} | {{control_operator}} | Reviewer sign-off and remediation tracking | {{ticketing_system}} |
| Change approval population | Support release and deployment review | {{source_control_tool}} and {{ticketing_system}} | {{control_operator}} | {{control_operator}} | Control-owner review | {{ticketing_system}} |

## Review Guidance
- Confirm whether the report is complete and accurate enough to support management review.
- Record where the logic lives: query, report builder, spreadsheet formula, BI layer, or manual extract.
- Capture changes to logic, source fields, or reconciliation expectations through change management.
- Revalidate the inventory {{sox_review_frequency}} and after material report changes.
