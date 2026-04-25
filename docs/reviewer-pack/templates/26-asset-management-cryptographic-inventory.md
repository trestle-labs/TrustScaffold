# Asset Management and Cryptographic Inventory

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: C1.1, C1.2, CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8, CC7.1, CC7.2, CC7.3, CC7.4, CC7.5, COMMON, ISO27001, PCI -->

| Field | Value |
| --- | --- |
| Template slug | `asset-management-cryptographic-inventory` |
| TSC category | Universal |
| Criteria mapped | COMMON, CC6, CC7, C1, ISO27001, PCI |
| Purpose | Universal common-control inventory for assets, data stores, encryption mechanisms, keys, certificates, and owners. |
| Output filename | `26-asset-management-cryptographic-inventory.md` |

---

---
title: Asset Management and Cryptographic Inventory
slug: asset-management-cryptographic-inventory
tsc_category: Universal
criteria_mapped:
  - COMMON
  - CC6
  - CC7
  - C1
  - ISO27001
  - PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: COMMON, CC6, CC7, C1, ISO27001, PCI -->

# Asset Management and Cryptographic Inventory

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} maintains an asset and cryptographic inventory to support SOC 2, ISO 27001, PCI-DSS, HIPAA, and privacy control expectations.

## Asset Inventory
| Asset / System | Type | Environment | Data Classification | Owner | Criticality | Evidence Location |
| --- | --- | --- | --- | --- | --- | --- |
| {{primary_product_name}} production application | Application | Production | Confidential / regulated as applicable | {{system_owner_name}} | High | System Description |
| Identity provider: {{idp_provider}} | Identity service | Production | Workforce identity data | {{control_operator}} | High | Access-control evidence |
| Ticketing system: {{ticketing_system}} | Workflow system | Production | Operational and incident records | {{control_operator}} | Medium | Ticket exports |

## Cryptographic Inventory
| Mechanism | Purpose | Algorithm / Standard | Key Owner | Rotation Cadence | Storage / Service | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Data at rest encryption | Protect stored customer and company data | AES-256 or provider equivalent | {{control_operator}} | {{key_rotation_frequency}} | Cloud KMS or managed service | Encryption configuration |
| Data in transit encryption | Protect network transmission | TLS {{minimum_tls_version}} or stronger | {{control_operator}} | Certificate lifecycle | Load balancer / application endpoint | TLS scan or certificate record |
| Backup encryption | Protect backup copies | Provider-managed encryption | {{control_operator}} | {{key_rotation_frequency}} | Backup service | Backup configuration |

## Review Procedure
- Inventory owners review assets and cryptographic mechanisms {{cryptographic_inventory_review_frequency}}.
- New systems, data stores, keys, certificates, payment components, PHI stores, or privacy-impacting datasets must be added before production use.
- Retired assets must be removed only after data disposal, access revocation, and evidence retention are complete.
- Weak, deprecated, unknown, or undocumented algorithms are tracked as remediation items in {{ticketing_system}}.
