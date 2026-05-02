# Points of Focus Gap Analysis

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC1.2, CC3.2, CC4.1, CC6.1, CC7.2, CC8.1, CC9.2 -->

| Field | Value |
| --- | --- |
| Template slug | `points-of-focus-gap-analysis` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC1, CC2, CC3, CC4, CC6, CC7, CC8, CC9 |
| Purpose | Translate active wizard warnings, recommendations, and deep-dive prompts into an assessor-style readiness matrix with criterion, point-of-focus, evidence, and remediation expectations. |
| Output filename | `34-points-of-focus-gap-analysis.md` |

---

---
title: Points of Focus Gap Analysis
slug: points-of-focus-gap-analysis
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC1
  - CC2
  - CC3
  - CC4
  - CC6
  - CC7
  - CC8
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Points of Focus Gap Analysis

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}

## Purpose
{{organization_name}} uses this gap analysis to translate active wizard findings into an assessor-style readiness matrix covering criterion intent, evidence expectations, and concrete remediation before an auditor or customer relies on the generated pack.

## Analysis Basis
- Active points of focus identified: {{points_of_focus_gap_count}}
- Selected criteria in scope: {{selected_criteria_codes}}
- Generated reviewer-pack documents considered: {{generated_document_count}}

## Assessor Readiness Matrix
{{#if points_of_focus_gap_count}}
| Priority | Primary Criterion | Criterion Theme | Point of Focus | Wizard Step | Focus Area | Severity | Owner | Status | Signal Type | Assessment Basis | Expected Evidence | Target State | Related Generated Documents |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
{{#each points_of_focus_gap_rows}}
| {{priority_rank}} | {{primary_criterion}} | {{criterion_title}} | {{point_of_focus}} | {{step}} | {{focus_area}} | {{severity}} | {{owner}} | {{status}} | {{signal_type}} | {{assessment_basis}} | {{expected_evidence}} | {{target_state}} | {{related_documents}} |
{{/each}}
{{else}}
No active readiness gaps or evidence prompts were identified from the current wizard decision trace at the time this matrix was generated.
{{/if}}

## How To Use This Matrix
- Start with the lowest-numbered rows and any entries marked `High` severity, then confirm the `Expected Evidence` exists before treating the mapped criterion as audit-ready.
- Use the `Point of Focus` and `Target State` columns as the assessor-style statement of what management should be able to demonstrate for that row.
- Where multiple rows point to the same generated document, update the source policy or supporting evidence once and record how the change satisfies each mapped criterion.
- Re-run the wizard and regenerate the reviewer pack after material remediation so this matrix reflects the current operating model rather than stale decisions.
