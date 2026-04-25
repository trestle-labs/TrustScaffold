# Legal and Regulatory Registry

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CCPA, GDPR, HIPAA, ISO27001, PCI -->

| Field | Value |
| --- | --- |
| Template slug | `legal-regulatory-registry` |
| TSC category | ISO 27001 |
| Criteria mapped | ISO27001, GDPR, CCPA, HIPAA, PCI |
| Purpose | ISO 27001-oriented registry of legal, regulatory, statutory, contractual, and framework obligations. |
| Output filename | `24-legal-regulatory-registry.md` |

---

---
title: Legal and Regulatory Registry
slug: legal-regulatory-registry
tsc_category: ISO 27001
criteria_mapped:
  - ISO27001
  - GDPR
  - CCPA
  - HIPAA
  - PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: ISO27001, GDPR, CCPA, HIPAA, PCI -->

# Legal and Regulatory Registry

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains this registry to identify laws, regulations, standards, contractual obligations, and customer commitments that affect {{primary_product_name}}.

## Registry
| Obligation | Applies? | Trigger | Owner | Required Documentation | Review Cadence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| SOC 2 Trust Services Criteria | Yes | TrustScaffold readiness package | {{policy_owner}} | Policy set, System Description, Evidence Checklist | Annually | Security is baseline. |
| ISO 27001 | Yes | Multi-framework readiness baseline | {{policy_owner}} | SoA, legal registry, risk register, asset inventory | {{legal_registry_review_frequency}} | Confirm certification scope before external audit. |
| GDPR / UK GDPR | {{#if website_targets_eu_or_uk_residents}}Yes{{else}}{{#if scope_includes_privacy}}Review needed{{else}}No EU/UK targeting indicated{{/if}}{{/if}} | EU/UK visitors, customers, monitoring, cookies, or behavioral tracking | {{privacy_contact_email}} | Privacy Notice, DPIA, DSAR log, cookie consent, vendor privacy terms | {{legal_registry_review_frequency}} | Website: {{company_website}} |
| CCPA / CPRA | {{#if website_targets_california_residents}}Yes{{else}}{{#if website_sells_or_shares_personal_information}}Yes{{else}}Review needed{{/if}}{{/if}} | California residents, sale/share, targeted advertising, or consumer privacy requests | {{privacy_contact_email}} | Privacy notice, opt-out links, DSAR log, retention schedule | {{legal_registry_review_frequency}} |  |
| HIPAA | {{#if stores_phi}}Yes{{else}}No PHI indicated{{/if}} | PHI handled by system or vendors | {{privacy_contact_email}} | BAA, PHI inventory, security incident records | {{legal_registry_review_frequency}} |  |
| PCI-DSS | {{#if has_cardholder_data_environment}}Yes{{else}}No CDE indicated{{/if}} | CDE stores, processes, transmits, or connects to CHD | {{policy_owner}} | CDE inventory, ASV scans, tokenization policy | Quarterly |  |
| Cookie / tracking consent | {{#if website_uses_cookies_analytics}}Review needed{{else}}No tracking indicated{{/if}} | Cookies, analytics, ads, pixels, session replay, or similar tracking | {{privacy_contact_email}} | Cookie banner, preference center, vendor list, consent log | {{legal_registry_review_frequency}} | Banner present: {{#if website_has_cookie_banner}}Yes{{else}}No{{/if}} |
| Children's privacy | {{#if website_allows_children_under_13}}Review needed{{else}}No child-directed use indicated{{/if}} | Site directed to children or knowingly collecting data from children under 13 | {{privacy_contact_email}} | Parental consent, age-screening, retention and deletion workflow | {{legal_registry_review_frequency}} |  |

## Maintenance Procedure
1. Review new products, data types, customers, regions, vendors, and contracts for new obligations.
2. Assign each obligation an owner and evidence location.
3. Track changes in {{ticketing_system}} or the compliance register.
4. Escalate unclear obligations to legal counsel or qualified compliance advisors.
