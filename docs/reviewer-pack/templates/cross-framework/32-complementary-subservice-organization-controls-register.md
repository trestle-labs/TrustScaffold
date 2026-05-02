# Complementary Subservice Organization Controls Register

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC3.1, CC3.2, CC3.3, CC3.4, CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8, CC9.1, CC9.2, COMMON, ISO27001 -->

| Field | Value |
| --- | --- |
| Template slug | `complementary-subservice-organization-controls-register` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC3, CC6, CC9, ISO27001 |
| Purpose | Register of material subservice organizations, assurance posture, and retained monitoring obligations. |
| Output filename | `32-complementary-subservice-organization-controls-register.md` |

---

---
title: Complementary Subservice Organization Controls Register
slug: complementary-subservice-organization-controls-register
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC3
  - CC6
  - CC9
  - ISO27001
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, CC3, CC6, CC9, ISO27001 -->

# Complementary Subservice Organization Controls Register

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}

## Purpose
{{organization_name}} maintains this register to document third-party services, hosting platforms, and other subservice organizations that materially support {{primary_product_name}}, along with the control model used to evaluate those dependencies.

## Dependency Summary
- Material subservice organizations listed: {{subservice_count}}
- Inclusive method dependencies: {{inclusive_subservice_count}}
- Carve-out method dependencies: {{carve_out_subservice_count}}
- Dependencies without current assurance evidence: {{subservice_without_assurance_count}}

## Register
| Subservice Organization | Service Scope | Data Shared / Dependency | Assurance Basis | Control Model | Retained {{organization_name}} Controls | Customer Monitoring Considerations | Review Cadence |
| --- | --- | --- | --- | --- | --- | --- | --- |
{{#each csoc_rows}}
| {{vendor_name}} | {{service_scope}} | {{data_shared}} | {{assurance_basis}} | {{control_model}} | {{trustscaffold_controls}} | {{customer_monitoring}} | {{review_cadence}} |
{{/each}}

## Review Guidance
- Review this register {{csoc_review_frequency}}.
- Update the register when a new material subservice organization is onboarded, when an assurance report expires or changes method, or when a bridge period introduces compensating controls.
- Where the control model is carve-out, confirm downstream user-control considerations are disclosed to affected customers and reflected in related CUEC materials.
