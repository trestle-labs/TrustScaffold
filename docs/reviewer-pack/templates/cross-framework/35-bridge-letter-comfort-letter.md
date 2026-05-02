# Bridge Letter / Comfort Letter

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC2.1, CC2.2, CC2.3, CC3.1, CC3.2, CC3.3, CC3.4, CC4.1, CC4.2, COMMON -->

| Field | Value |
| --- | --- |
| Template slug | `bridge-letter-comfort-letter` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC2, CC3, CC4 |
| Purpose | Customer-facing current-state letter summarizing available documentation, active remediation priorities, and the next planned review date. |
| Output filename | `35-bridge-letter-comfort-letter.md` |

---

---
title: Bridge Letter / Comfort Letter
slug: bridge-letter-comfort-letter
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC2
  - CC3
  - CC4
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, CC2, CC3, CC4 -->

# Bridge Letter / Comfort Letter

## Control Ownership
- Executive Sponsor: {{executive_sponsor_name}}
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}

## Current Status Summary
As of {{effective_date}}, {{organization_name}} has prepared the attached TrustScaffold reviewer-pack materials for {{primary_product_name}} to support customer diligence, readiness conversations, and current-state control communication.

{{bridge_letter_program_status}}

The current documentation set covers {{selected_trust_service_categories_text}} and includes {{generated_document_count}} generated documents describing the system boundary, policy framework, complementary controls, and current management follow-up priorities.

This customer-facing status view is scoped to {{bridge_letter_active_frameworks_text}} so privacy-oriented recipients see privacy-relevant follow-up items while HIPAA, PCI-DSS, or other framework-specific items appear only when those frameworks are relevant to the current pack.

## Customer Communication Notes
- This letter is intended to bridge the period between formal assessments, refreshed evidence requests, or customer-specific diligence reviews.
- The attached materials describe management’s current understanding of the operating model, control ownership, and prioritized remediation items.
- Customers should review the complementary user-entity and subservice-organization control materials alongside this letter when evaluating shared responsibility assumptions.

## Available Documentation Snapshot
| Document | TSC / Framework | Output |
| --- | --- | --- |
{{#each generated_document_rows}}
| {{name}} | {{tsc}} | {{output_filename}} |
{{/each}}

## Highest-Priority Active Follow-Up Items
{{#if bridge_letter_customer_priority_count}}
| Priority | Focus Area | Framework Scope | Customer View | Review Owner | Current Follow-Up |
| --- | --- | --- | --- | --- | --- |
{{#each bridge_letter_customer_priorities}}
| {{priority_rank}} | {{focus_area}} | {{framework_scope}} | {{priority_band}} | {{review_owner}} | {{customer_follow_up}} |
{{/each}}
{{else}}
No active follow-up items were identified from the current wizard decision trace at the time this letter was generated.
{{/if}}

## Primary Audience View
{{#if bridge_letter_has_primary_audience}}
### {{bridge_letter_primary_audience.label}}
- Audience scope: {{bridge_letter_primary_audience.framework_scope_text}}
- Why this view exists: {{bridge_letter_primary_audience.description}}
{{#if bridge_letter_primary_audience.priority_count}}
| Priority | Focus Area | Framework Scope | Customer View | Review Owner |
| --- | --- | --- | --- | --- |
{{#each bridge_letter_primary_audience.priorities}}
| {{priority_rank}} | {{focus_area}} | {{framework_scope}} | {{customer_view}} | {{review_owner}} |
{{/each}}
{{else}}
No customer-facing priorities currently map to the primary audience profile.
{{/if}}
{{else}}
No primary audience profile is currently derived from the active framework profile.
{{/if}}

## Additional Audience Views
{{#if bridge_letter_additional_audience_count}}
{{#each bridge_letter_additional_audiences}}
### {{label}}
- Audience scope: {{framework_scope_text}}
- Why this view exists: {{description}}
{{#if priority_count}}
| Priority | Focus Area | Framework Scope | Customer View | Review Owner |
| --- | --- | --- | --- | --- |
{{#each priorities}}
| {{priority_rank}} | {{focus_area}} | {{framework_scope}} | {{customer_view}} | {{review_owner}} |
{{/each}}
{{else}}
No customer-facing priorities currently map to this audience profile.
{{/if}}
{{/each}}
{{else}}
No additional audience-specific views are currently derived beyond the primary audience profile.
{{/if}}

## Next Review Date
Management expects to review and refresh this bridge letter, the associated prioritized gap register, and the supporting generated documentation no later than {{bridge_letter_next_review_date}}, or earlier if the system boundary, customer commitments, or control environment changes materially.
