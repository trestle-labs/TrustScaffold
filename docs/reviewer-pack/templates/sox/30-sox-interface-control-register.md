# SOX Interface Control Register

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: COMMON, SOX -->

| Field | Value |
| --- | --- |
| Template slug | `sox-interface-control-register` |
| TSC category | SOX / ITGC |
| Criteria mapped | COMMON, SOX |
| Purpose | SOX-oriented register for inbound and outbound interfaces, reconciliations, exception handling, and change ownership. |
| Output filename | `30-sox-interface-control-register.md` |

---

---
title: SOX Interface Control Register
slug: sox-interface-control-register
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, SOX -->

# SOX Interface Control Register

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains this register to document interfaces, file transfers, and system dependencies that may affect financial reporting or management-review controls for {{sox_applicability_label}}.

## Interface Register
| Interface | Direction | Data / Purpose | Source | Destination | Control Owner | Reconciliation / Monitoring | Change Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Product-to-finance export | Outbound | Usage, billing, or adjustment data | {{primary_product_name}} | Finance workflow or data mart | {{finance_system_owner}} | Scheduled reconciliation, exception review, and ticket escalation | Pull request, ticket, deployment log |
| Identity-to-access review export | Outbound | User and privileged-access population | {{idp_provider}} | Access review package | {{sox_control_owner}} | Quarterly access review and remediation log | Ticket export and reviewer sign-off |
| Change-management evidence feed | Inbound | Approved change, deployment, and emergency-change records | {{ticketing_system}} / {{source_control_tool}} | SOX evidence package | {{control_operator}} | Control-owner review and completeness check | Ticket, PR, and release evidence |

## Control Notes
- Record the population owner, completeness check, reconciliation owner, and exception path for each interface.
- Changes to interfaces, mappings, schedules, or reconciliation logic should follow formal change control.
- Failed runs, data mismatches, and manual workarounds should be tracked in {{ticketing_system}} and reviewed {{sox_review_frequency}}.
