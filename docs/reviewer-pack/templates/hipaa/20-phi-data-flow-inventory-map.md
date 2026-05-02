# PHI Data Flow and Inventory Map

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: HIPAA -->

| Field | Value |
| --- | --- |
| Template slug | `phi-data-flow-inventory-map` |
| TSC category | HIPAA |
| Criteria mapped | HIPAA |
| Purpose | HIPAA-focused inventory of PHI fields, systems, flows, recipients, safeguards, and retention. |
| Output filename | `20-phi-data-flow-inventory-map.md` |

---

---
title: PHI Data Flow and Inventory Map
slug: phi-data-flow-inventory-map
tsc_category: HIPAA
criteria_mapped:
  - HIPAA
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: HIPAA -->

# PHI Data Flow and Inventory Map

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains this PHI inventory to document where protected health information enters, moves through, is stored by, is disclosed from, and is deleted from {{primary_product_name}}.

## PHI Inventory
| PHI Element / Dataset | Source | System Of Record | Purpose | Access Roles | Retention | Safeguards |
| --- | --- | --- | --- | --- | --- | --- |
| Treatment, diagnosis, claims, medical record, or healthcare-regulated fields | Customer, integration, import, or support workflow | To be completed | To be completed | Minimum necessary roles | Per retention schedule | Encryption, access logging, MFA, review |

## Data Flow Register
| Flow | Origin | Destination | Transfer Method | Vendor / Recipient | Logging | Approval Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| PHI ingestion | Customer or authorized integration | {{primary_product_name}} production environment | Encrypted transfer | Internal systems | Application and access logs | Integration/change record |
| PHI support access | Authorized support workflow | Ticketing and support tooling | Approved workflow | {{ticketing_system}} | Ticket and access logs | Support access ticket |

{{#if has_subprocessors}}
## PHI-Handling Vendors
| Vendor | PHI Shared | Assurance | BAA Required | Review Cadence |
| --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | Yes if PHI is shared | {{review_cadence}} |
{{/each}}
{{/if}}

## Review Requirements
- The PHI inventory is reviewed {{phi_inventory_review_frequency}} and after material product, vendor, integration, or data-flow changes.
- PHI access must follow minimum-necessary principles.
- Missing field-level inventory items are tracked as compliance gaps until remediated.
