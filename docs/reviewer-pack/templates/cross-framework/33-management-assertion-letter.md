# Management Assertion Letter

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC1.1, CC1.2, CC1.3, CC1.4, CC1.5, CC2.1, CC2.2, CC2.3, CC3.1, CC3.2, CC3.3, CC3.4, CC4.1, CC4.2, COMMON -->

| Field | Value |
| --- | --- |
| Template slug | `management-assertion-letter` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC1, CC2, CC3, CC4 |
| Purpose | Draft management assertion summarizing scope, control responsibility, and current focus areas for the generated reviewer pack. |
| Output filename | `33-management-assertion-letter.md` |

---

---
title: Management Assertion Letter
slug: management-assertion-letter
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC1
  - CC2
  - CC3
  - CC4
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, CC1, CC2, CC3, CC4 -->

# Management Assertion Letter

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}
- Executive Sponsor: {{executive_sponsor_name}}

## Draft Assertion
Management of {{organization_name}} is responsible for establishing, implementing, and maintaining controls over {{primary_product_name}} and the supporting processes, infrastructure, people, and dependencies described in the TrustScaffold reviewer pack.

{{management_assertion_coverage_statement}}

Management asserts that:
- The system description, complementary control materials, and generated policy set describe the current intended operating model for {{primary_product_name}} as of {{effective_date}}.
- Control responsibilities that remain with customers, vendors, and subservice organizations are identified in the generated reviewer-pack materials where applicable.
- The attached documentation set is intended to support readiness discussions, auditor scoping, customer security reviews, and formal remediation planning.

## Scope Summary
- Selected trust service categories and related frameworks: {{selected_trust_service_categories_text}}
- Generated reviewer-pack documents: {{generated_document_count}}
- Primary system owner: {{system_owner_name}}
- Security contact: {{security_contact_email}}

## Included Generated Documents
| Document | TSC / Framework | Criteria Hint | Output |
| --- | --- | --- | --- |
{{#each generated_document_rows}}
| {{name}} | {{tsc}} | {{criteria_hint}} | {{output_filename}} |
{{/each}}

## Current Management Focus Areas
{{#if management_assertion_focus_area_count}}
{{#each management_assertion_focus_areas}}
### {{title}}
- Wizard step: {{step}}
- Current signal: {{summary}}
- Management follow-up: {{recommendation}}
{{/each}}
{{else}}
Management did not identify any active focus areas from the current wizard decision trace at the time this draft was produced.
{{/if}}

## Limitations of This Draft
- This letter is a draft management assertion generated from current wizard answers and should be reviewed against actual operating evidence before external use.
- If the operating model, control ownership, vendor profile, or scope changes materially, management should regenerate the reviewer pack and reconfirm the assertions above.
