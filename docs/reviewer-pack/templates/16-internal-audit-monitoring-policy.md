# Internal Audit and Monitoring Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `internal-audit-monitoring-policy` |
| TSC category | Security |
| Criteria mapped | CC2, CC4 |
| Purpose | Defines the internal audit program, controls monitoring cadence, and deficiency remediation process. |
| Output filename | `16-internal-audit-monitoring-policy.md` |

---

---
title: Internal Audit and Monitoring Policy
slug: internal-audit-monitoring-policy
tsc_category: Security
criteria_mapped:
  - CC2
  - CC4
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

> This document is a starting-point compliance template and must be reviewed by {{approver_name}} before adoption.

# Internal Audit and Monitoring Policy

## 1. Purpose

This policy establishes {{organization_name}}'s internal audit program and ongoing monitoring activities to evaluate the design and operating effectiveness of internal controls, as required by AICPA Trust Services Criteria CC2.1, CC4.1, and CC4.2.

## 2. Scope

This policy applies to all controls within the SOC 2 trust services criteria boundary, including:
- Logical and physical access controls
- Change management controls
- Security operations controls
- Vendor management controls
- Availability and data protection controls

## 3. Internal Audit Program

### 3.1 Audit Cadence
{{#if has_internal_audit_program}}
{{organization_name}} conducts formal internal audit reviews on a **{{internal_audit_frequency}}** basis.
{{else}}
{{organization_name}} shall establish an internal audit review cadence of at least annually.
{{/if}}

### 3.2 Audit Activities
Internal audit reviews shall include, at minimum:
- Sampling of access reviews to verify timeliness and completeness.
- Sampling of change management records to verify peer review and approval.
- Review of incident response records for adherence to playbooks.
- Verification that vendor assurance reports are current and reviewed.
- Verification that training completion rates meet the required cadence.
- Review of risk register updates and treatment plan progress.

### 3.3 Audit Independence
Internal audit activities are conducted by personnel who are independent of the processes being reviewed, or by qualified external parties. Where separation of duties is limited by organization size, compensating controls (such as management review) are documented.

## 4. Ongoing Monitoring

### 4.1 Automated Monitoring
{{#if has_siem}}
- Security events are monitored centrally via {{siem_tool}}.
{{/if}}
{{#if has_monitoring_tool}}
- Infrastructure and capacity metrics are monitored via {{monitoring_tool}}.
{{/if}}
- Alerting thresholds are configured for anomalous access patterns, failed authentication attempts, and unauthorized configuration changes.

### 4.2 Manual Monitoring
- Access reviews are performed quarterly.
{{#if (eq acknowledgement_cadence 'not-yet')}}
- A formal policy acknowledgement cadence is being established and will be verified once adopted.
{{else}}
{{#if (eq acknowledgement_cadence 'not-yet')}}
- A formal policy acknowledgement cadence is being established and will be verified once adopted.
{{else}}
- Policy acknowledgements are verified per the established cadence ({{acknowledgement_cadence}}).
{{/if}}
{{/if}}
{{#if has_phishing_simulation}}
- Phishing simulation results are reviewed {{phishing_simulation_frequency}} to identify awareness gaps.
{{/if}}

## 5. Deficiency Remediation

### 5.1 Identification
Control deficiencies identified through internal audit, monitoring, or external feedback are logged in {{ticketing_system}} with:
- Description of the deficiency
- Affected criteria and control objective
- Severity classification (Critical, High, Medium, Low)

### 5.2 Remediation and Tracking
- Critical and High deficiencies require a remediation plan within **5 business days**.
- All deficiencies are tracked to closure with evidence of remediation.
- Unresolved deficiencies beyond 90 days are escalated to executive leadership{{#if has_board_or_advisory}} and reported to the board/advisory body{{/if}}.

### 5.3 Lessons Learned
Significant deficiencies trigger a review of the control design and, where appropriate, updates to policies, procedures, or monitoring rules.

## 6. Reporting

{{#if has_board_or_advisory}}
Internal audit results are presented to the board or advisory body on a **{{board_meeting_frequency}}** basis.
{{else}}
Internal audit results are presented to executive leadership at least annually.
{{/if}}
Reports include:
- Summary of reviews conducted
- Deficiencies identified and remediation status
- Trends in control effectiveness
- Recommendations for control improvements

## 7. Policy Review

This policy is reviewed and updated at least annually, or following significant organizational changes.
