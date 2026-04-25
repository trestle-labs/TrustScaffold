# Processing Integrity Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `processing-integrity-policy` |
| TSC category | Processing Integrity |
| Criteria mapped | PI1 |
| Purpose | Processing completeness, accuracy, authorization, exception handling, and reconciliation expectations. |
| Output filename | `18-processing-integrity-policy.md` |

---

---
title: Processing Integrity Policy
slug: processing-integrity-policy
tsc_category: Processing Integrity
criteria_mapped:
  - PI1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Processing Integrity Policy

## Purpose
{{organization_name}} maintains processing controls so {{primary_product_name}} transactions, workflows, reports, and customer-facing outputs are complete, valid, accurate, timely, and authorized.

## Scope
This policy applies to production processing for {{primary_product_name}}, including customer data ingestion, identity and access workflows, payment metadata workflows, regulated analytics, support workflows, integrations, scheduled jobs, and administrative processing.

## Processing Objectives
- Processing requirements are defined before material workflows are released or changed.
- Inputs are validated for required fields, format, source authorization, duplicate detection, and business-rule conformance.
- Processing jobs and service workflows record success, failure, retry, and exception states in approved logs or queues.
- Outputs, reports, notifications, and exports are reviewed or tested to confirm completeness and accuracy before release or delivery.
- Processing data is retained, protected, and disposed of according to the Data Retention and Disposal Policy.

## Input and Authorization Controls
- Production processing accepts inputs only from approved users, services, integrations, or subservice organizations.
- Administrative overrides, manual corrections, and privileged processing actions require documented business justification and approval.
- Changes to validation rules, transformation logic, reconciliation jobs, and output generation follow the Change Management Policy.

## Reconciliation and Exception Handling
- High-risk workflows are reconciled against source records, downstream outputs, or control totals at a cadence appropriate to the workflow criticality.
- Processing exceptions are captured in {{ticketing_system}}, assigned an owner, prioritized by customer and compliance impact, and resolved within {{processing_exception_sla}} or documented with an approved exception.
- Failed or partially completed jobs are reviewed to determine customer impact, data correction needs, and notification obligations.

## Monitoring and Evidence
- Processing integrity monitoring is reviewed {{processing_integrity_review_frequency}} by {{processing_integrity_owner}} or a delegate.
- Evidence includes job run logs, validation test results, reconciliation records, exception tickets, correction approvals, and output-review artifacts.
- Material processing defects are evaluated through incident response, risk management, and customer communication procedures when applicable.

## PCI, PHI, and Privacy-Sensitive Processing
{{#if has_cardholder_data_environment}}
- Payment and cardholder-data workflows are designed to keep raw cardholder data within the approved CDE boundary and rely on tokenized or masked values outside that boundary.
{{/if}}
{{#if stores_phi}}
- PHI processing workflows apply minimum-necessary access, audit logging, and correction controls consistent with healthcare-regulated data obligations.
{{/if}}
{{#if scope_includes_privacy}}
- Privacy-impacting processing changes are reviewed for notice, consent, retention, data quality, and data-subject-request implications.
{{/if}}

## Review
This policy is reviewed at least annually and after material changes to processing logic, integrations, payment workflows, regulated analytics, or customer-facing reports.
