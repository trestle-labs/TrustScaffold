# Business Continuity and Disaster Recovery Plan

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `business-continuity-dr-plan` |
| TSC category | Availability |
| Criteria mapped | A1 |
| Purpose | Recovery strategy, roles, and resilience commitments for critical services. |
| Output filename | `06-business-continuity-dr-plan.md` |

---

---
title: Business Continuity and Disaster Recovery Plan
slug: business-continuity-dr-plan
tsc_category: Availability
criteria_mapped:
  - A1
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Business Continuity and Disaster Recovery Plan

## Objective
{{organization_name}} maintains continuity and recovery plans for services that support {{primary_product_name}}.

## Critical Commitments
- Recovery Time Objective: {{recovery_time_objective}}
- Recovery Point Objective: {{recovery_point_objective}}
- Critical Support Hours: {{critical_support_hours}}

## Capacity and Dependency Monitoring
- Capacity, saturation, and service-health signals are monitored through {{monitoring_tool}} or equivalent operational tooling.
- Capacity thresholds are reviewed during continuity planning and after material infrastructure changes.
- Critical dependencies, including cloud providers, identity services, payment providers, and hybrid connectivity, are mapped to recovery owners and escalation paths.

## Recovery Strategy
{{#if uses_multi_region}}
- Critical infrastructure is deployed across multiple regions or failover zones.
{{/if}}
{{#if uses_backups}}
- Backups are performed and restoration tests are completed on a scheduled basis.
{{/if}}
{{#if uses_hybrid}}
- Recovery runbooks cover both cloud zone failover and restoration of dependent on-premise systems.
{{/if}}
{{#if has_hardware_failover}}
- Physical hardware failover steps, spare capacity expectations, and replacement part ownership are documented.
{{/if}}
{{#if uses_cloud_vpn}}
- Recovery validation includes VPN or private network path checks for administrative access into the recovered environment.
{{/if}}

## Roles
- Recovery Lead: {{recovery_lead_name}}
- Communications Lead: {{communications_lead_name}}

## Testing
Continuity and recovery procedures are tested {{bcdr_test_frequency}}.
Each test records the scenario exercised, actual recovery time, data-loss result against the RPO, failed steps, remediation owner, and retest evidence.
