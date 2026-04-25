# Secure Software Development Life Cycle Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

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

# Secure Software Development Life Cycle Policy

## Objective
{{organization_name}} integrates security controls into design, development, testing, and release workflows.

## Engineering Controls
- Code changes require peer review before merge.
- Dependencies are reviewed and patched based on severity.
- Security issues are tracked through remediation to closure.

## Validation
{{#if runs_sast}}
- Static analysis is executed on pull requests or pre-release builds.
{{/if}}
{{#if runs_dependency_scanning}}
- Dependency scanning is executed to identify known vulnerabilities.
{{/if}}
{{#if has_production_change_reviews}}
- Production-affecting changes require release approval and rollback planning.
{{/if}}
