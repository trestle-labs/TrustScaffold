# Secure Software Development Life Cycle Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC8.1 -->

| Field | Value |
| --- | --- |
| Template slug | `secure-sdlc-policy` |
| TSC category | Security |
| Criteria mapped | CC8 |
| Purpose | Engineering controls for secure design, code review, and vulnerability response. |
| Output filename | `12-secure-sdlc-policy.md` |

---

---
title: Secure SDLC Policy
slug: secure-sdlc-policy
tsc_category: Security
criteria_mapped:
  - CC8
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: CC8 -->

# Secure Software Development Life Cycle Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Objective
{{organization_name}} integrates security controls into design, development, testing, and release workflows.

## Secure Design
{{#if has_threat_modeling}}
- Threat modeling is performed using the {{threat_modeling_approach}} approach on a {{threat_modeling_cadence}} cadence for new features, architectural changes, or other material delivery risk.
{{else}}
- Formal threat modeling is not yet consistently performed; engineering leadership uses code review, vulnerability triage, and release review to identify design and implementation risk.
{{/if}}
{{#if has_security_champion_program}}
- A designated security champion or equivalent engineering security owner supports secure design and remediation decisions.
{{/if}}

## Engineering Controls
- Code changes follow documented review expectations before production release.
- Dependencies are reviewed and patched based on severity and exploitability.
- Security issues are tracked through remediation to closure.

## Validation
{{#if has_sast}}
- Static analysis is executed using {{sast_tool}} on pull requests or pre-release builds.
{{/if}}
{{#if has_secrets_scanning}}
- Secrets scanning is executed using {{secrets_scanning_tool}} to detect committed credentials and tokens.
{{/if}}
{{#if has_dependency_scanning}}
- Dependency scanning is executed using {{dependency_scanning_tool}} to identify known vulnerabilities and supply-chain risk.
{{/if}}
{{#if has_dast}}
- Dynamic application security testing is performed against running application surfaces or pre-production environments.
{{/if}}
{{#if has_production_change_reviews}}
- Production-affecting changes require release approval and rollback planning.
{{/if}}

## Remediation Expectations
- Critical security findings are remediated within {{remediation_sla_critical_days}} days.
- High-severity security findings are remediated within {{remediation_sla_high_days}} days.
- Findings remain tracked until remediation, exception approval, or documented risk acceptance is completed.

## External Reporting
{{#if has_vulnerability_disclosure}}
- {{organization_name}} accepts externally reported vulnerabilities through {{vulnerability_disclosure_channel}} and routes validated reports into the remediation workflow.
{{else}}
- {{organization_name}} does not maintain a public vulnerability disclosure program today; security issues are primarily identified through internal review, testing, and vendor or customer escalation.
{{/if}}
