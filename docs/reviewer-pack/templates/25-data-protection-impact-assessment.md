# Data Protection Impact Assessment

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: GDPR, P1.1, P2.1, P3.1, P3.2, P4.1, P4.2, P4.3, P5.1, P5.2, P6.1, P6.2, P6.3, P6.4, P6.5, P6.6, P6.7, P7.1, P8.1 -->

| Field | Value |
| --- | --- |
| Template slug | `data-protection-impact-assessment` |
| TSC category | GDPR / Privacy |
| Criteria mapped | GDPR, P1, P2, P3, P4, P5, P6, P7, P8 |
| Purpose | GDPR/privacy DPIA template for high-risk personal-data processing activities. |
| Output filename | `25-data-protection-impact-assessment.md` |

---

---
title: Data Protection Impact Assessment
slug: data-protection-impact-assessment
tsc_category: GDPR / Privacy
criteria_mapped:
	- GDPR
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

<!-- Mapping: GDPR, P1, P2, P3, P4, P5, P6, P7, P8 -->

# Data Protection Impact Assessment

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
This DPIA records privacy risks, safeguards, and approval decisions for high-risk processing activities in {{primary_product_name}}.

## Processing Description
| Area | Description |
| --- | --- |
| Processing purpose | To be completed for the workflow under review. |
| Data subjects | Customers, users, workforce members, or other individuals whose personal information is processed. |
| Personal data categories | {{#each data_classifications}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} |
| Systems and vendors | {{primary_product_name}}{{#if has_subprocessors}} and approved subprocessors{{/if}} |
| Retention | Per Data Retention and Disposal Policy. |

## Necessity and Proportionality
- Processing purpose is documented and communicated in the privacy notice.
- Data collection is limited to what is necessary for the stated purpose.
- Access is restricted to approved roles.
- Data subject request and correction workflows are tracked in {{ticketing_system}}.

## Risk Assessment
| Risk | Impact | Mitigation | Owner | Residual Risk | Notes |
| --- | --- | --- | --- | --- | --- |
| Unauthorized access to personal information | High | MFA, least privilege, logging, access reviews | {{control_operator}} | To be assessed |  |
| Excessive collection or retention | Medium | Data minimization and retention schedule | {{policy_owner}} | To be assessed |  |
| Unauthorized disclosure to vendor | High | Vendor review, privacy terms, disclosure register | {{policy_owner}} | To be assessed |  |
| Inaccurate or stale personal data | Medium | Correction workflow and downstream propagation | {{privacy_contact_email}} | To be assessed |  |

## Approval and Review
- DPIAs are reviewed {{dpia_review_frequency}}.
- High residual risk is escalated to executive leadership, legal counsel, or the appropriate supervisory authority when required.
- Material processing changes require DPIA update before release.
