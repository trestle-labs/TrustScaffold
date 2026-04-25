# Privacy Notice and Consent Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: P1.1, P2.1, P3.1, P3.2, P4.1, P4.2, P4.3, P5.1, P5.2, P6.1, P6.2, P6.3, P6.4, P6.5, P6.6, P6.7, P7.1, P8.1 -->

| Field | Value |
| --- | --- |
| Template slug | `privacy-notice-consent-policy` |
| TSC category | Privacy |
| Criteria mapped | P1, P2, P3, P4, P5, P6, P7, P8 |
| Purpose | Privacy posture, consent handling, and data subject request commitments. |
| Output filename | `10-privacy-notice-consent-policy.md` |

---

---
title: Privacy Notice and Consent Policy
slug: privacy-notice-consent-policy
tsc_category: Privacy
criteria_mapped:
  - P1
  - P2
  - P3
  - P4
  - P5
  - P6
  - P7
  - P8
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: P1, P2, P3, P4, P5, P6, P7, P8 -->

# Privacy Notice and Consent Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} communicates how personal information is collected, used, retained, and disclosed in connection with {{primary_product_name}}.

## Privacy Commitments
- Privacy questions are routed to {{privacy_contact_email}}.
- Data subject requests are acknowledged within {{dsar_acknowledgement_window}}.
- Privacy notices are updated when material processing changes occur.

{{#if requires_consent}}
## Consent
Explicit consent is obtained before processing categories of personal data that require opt-in consent.
{{/if}}

## Retention
Personal data is retained according to documented legal, contractual, and operational requirements.

## Data Quality and Correction
- Personal information used for customer-facing processing is maintained with accuracy, completeness, and timeliness controls appropriate to its purpose.
- Data subject access, correction, deletion, and restriction requests are tracked through {{ticketing_system}} or an equivalent workflow until closure.
- Corrections to personal information are reviewed for downstream system and subprocessor impact before closure.

## Complaint Handling and Enforcement
- Privacy complaints, suspected privacy policy violations, and inquiries about privacy commitments are logged, assigned an owner, investigated, and resolved with documented outcomes.
- Material privacy issues are escalated to security, legal, and executive stakeholders as appropriate.
- Repeated or significant privacy control deficiencies are tracked through the risk register or internal audit remediation process.

{{#if stores_phi}}
## Healthcare-Regulated Information
Where {{primary_product_name}} handles protected health information, privacy and security obligations for regulated healthcare data are incorporated into notice, access, retention, and incident-response procedures.

## HIPAA Administrative Safeguards
- Workforce members with access to PHI are granted access based on role and business need.
- Access changes and terminations are coordinated through {{hris_provider}} and identity controls administered through {{idp_provider}}.
- Security awareness training and sanctions processes apply to personnel handling regulated healthcare information.
- Security incidents involving PHI are escalated through {{ticketing_system}} and {{on_call_tool}} for investigation, containment, and documentation.
- Vendors with PHI access are reviewed through the vendor-management process and must satisfy contractual and assurance expectations before use.
{{/if}}
