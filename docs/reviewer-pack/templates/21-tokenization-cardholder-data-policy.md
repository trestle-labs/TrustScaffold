# Tokenization and Cardholder Data Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: PCI -->

| Field | Value |
| --- | --- |
| Template slug | `tokenization-cardholder-data-policy` |
| TSC category | PCI-DSS |
| Criteria mapped | PCI |
| Purpose | PCI-DSS high-water policy for cardholder data storage, masking, tokenization, and CDE boundary controls. |
| Output filename | `21-tokenization-cardholder-data-policy.md` |

---

---
title: Tokenization and Cardholder Data Policy
slug: tokenization-cardholder-data-policy
tsc_category: PCI-DSS
criteria_mapped:
  - PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: PCI -->

# Tokenization and Cardholder Data Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} protects cardholder data (CHD) by minimizing storage, using tokenization where feasible, masking display values, and restricting all CHD handling to the approved cardholder data environment (CDE).

## Policy Requirements
- Raw primary account numbers (PANs) may not be stored outside the approved CDE.
- Sensitive authentication data, including full track data, CVV/CVC, and PIN data, may not be stored after authorization.
- PAN display is masked except for personnel with documented business need.
- Tokenized values are used outside the CDE whenever processing does not require raw CHD.
- CDE boundary diagrams, connected systems, administrative paths, and vendor dependencies are reviewed after material changes.
- Encryption and key management follow approved algorithms: {{approved_encryption_algorithms}}.

## Tokenization Procedure
1. Payment workflows identify whether raw CHD is received, transmitted, processed, stored, or tokenized by a payment processor.
2. Raw CHD is routed only through approved payment components and service providers.
3. Tokens are stored in application systems instead of raw PAN wherever feasible.
4. Logs, support tickets, telemetry, and exports are monitored to prevent CHD leakage.
5. Exceptions require approval from {{approver_name}} and documented compensating controls.

## Evidence
- CDE boundary diagram and system inventory.
- Tokenization or payment-processor configuration.
- Masking screenshots or configuration evidence.
- Key-management and encryption configuration evidence.
- CHD leakage monitoring or log-scrubbing evidence.
