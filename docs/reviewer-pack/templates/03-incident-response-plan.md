# Incident Response Plan

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC7.1, CC7.2, CC7.3, CC7.4, CC7.5 -->

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

<!-- Mapping: CC7 -->

# Incident Response Plan

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


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

## Standard Operating Procedure: Incident Execution
1. The on-call responder opens or updates an incident ticket in {{ticketing_system}} and records detection source, affected systems, initial severity, and timeline start.
2. The Incident Commander assigns investigation, containment, communications, and evidence-preservation owners.
3. Responders preserve relevant logs, alerts, screenshots, forensic artifacts, and customer-impact analysis before destructive remediation where feasible.
4. The Communications Lead documents internal and external notification decisions, including rationale when notification is not required.
5. The post-incident review records root cause, corrective actions, owners, due dates, and evidence of completion.

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
