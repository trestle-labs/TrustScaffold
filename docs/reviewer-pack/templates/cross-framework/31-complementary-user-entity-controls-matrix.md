# Complementary User Entity Controls Matrix

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8, CC7.1, CC7.2, CC7.3, CC7.4, CC7.5, CC9.1, CC9.2, COMMON -->

| Field | Value |
| --- | --- |
| Template slug | `complementary-user-entity-controls-matrix` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC6, CC7, CC9 |
| Purpose | Customer-operated controls that must function alongside the TrustScaffold-generated control set. |
| Output filename | `31-complementary-user-entity-controls-matrix.md` |

---

---
title: Complementary User Entity Controls Matrix
slug: complementary-user-entity-controls-matrix
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC6
  - CC7
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, CC6, CC7, CC9 -->

# Complementary User Entity Controls Matrix

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}

## Purpose
{{organization_name}} uses this matrix to document the controls that user entities must operate in order to rely on the services, safeguards, and monitoring described throughout the TrustScaffold readiness pack for {{primary_product_name}}.

## Usage Notes
- These controls are complementary to, not replacements for, the controls operated by {{organization_name}}.
- User entities should evaluate these expectations during onboarding, annual review, and after material service changes.
- This matrix should be shared with customer success, implementation, security review, and procurement stakeholders when control responsibility questions arise.

## Matrix
| Control Area | User Entity Responsibility | Why It Matters | Related TrustScaffold Controls | Example Evidence |
| --- | --- | --- | --- | --- |
{{#each cuec_rows}}
| {{area}} | {{customer_responsibility}} | {{rationale}} | {{related_controls}} | {{evidence_examples}} |
{{/each}}

## Review Guidance
- Review this matrix {{cuec_review_frequency}}.
- Reconfirm the matrix whenever authentication, data-sharing patterns, customer-managed integrations, or major vendor dependencies materially change.
- Escalate exceptions through the documented security or support contact path before relying on alternate customer-managed procedures.
