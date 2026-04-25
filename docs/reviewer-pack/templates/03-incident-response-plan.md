# Incident Response Plan

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `incident-response-plan` |
| TSC category | Security |
| Criteria mapped | CC7 |
| Purpose | Preparation, detection, containment, and notification requirements for security incidents. |
| Output filename | `03-incident-response-plan.md` |

---

---
title: Incident Response Plan
slug: incident-response-plan
tsc_category: Security
criteria_mapped:
  - CC7
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Incident Response Plan

## Purpose
{{organization_name}} responds to suspected or confirmed security incidents using documented roles, escalation paths, and recovery procedures.

## Incident Team
- Incident Commander: {{incident_commander_name}}
- Communications Lead: {{communications_lead_name}}
- Executive Sponsor: {{executive_sponsor_name}}

## Severity and Escalation
- Triage begins within {{triage_sla_minutes}} minutes of detection.
- Customer-impacting incidents trigger executive escalation and communication workflows.
{{#if has_customer_notification_commitment}}
- External notifications are issued within {{customer_notification_window}} when contractual or regulatory obligations apply.
{{/if}}

## Response Lifecycle
1. Detect and validate the event.
2. Contain the threat and preserve evidence.
3. Eradicate the root cause and restore service.
4. Conduct a post-incident review and assign corrective actions.

## Logging and Evidence
Security-relevant events from infrastructure, identity, and application layers are retained according to the log retention schedule.

## Cloud Context
{{#if uses_aws}}
- AWS CloudTrail, GuardDuty, and service-native logs are reviewed during incident investigation.
{{/if}}
{{#if uses_azure}}
- Azure Activity Logs, Entra ID logs, and Defender alerts are reviewed during incident investigation.
{{/if}}
{{#if uses_gcp}}
- GCP Cloud Audit Logs, Security Command Center findings, and project-level IAM changes are reviewed during incident investigation.
{{/if}}
{{#if uses_hybrid}}
- Hybrid and on-premise investigations include VPN, bastion, physical-access, and endpoint telemetry where those systems may affect incident scope.
{{/if}}
