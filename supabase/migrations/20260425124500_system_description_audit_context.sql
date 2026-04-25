update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application. This description covers the {{organization_name}} production system and supporting infrastructure for the period under examination.

### Principal Service Commitments and System Requirements',
    '{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application. This description covers the {{organization_name}} production system and supporting infrastructure for the period under examination.

### Audit Readiness Context

{{#if is_type1}}
This package is prepared for a **SOC 2 Type I** readiness path, focusing on point-in-time control design and implementation evidence.
{{/if}}
{{#if is_type2}}
This package is prepared for a **SOC 2 Type II** readiness path, focusing on control design and operating effectiveness across the audit period.
{{/if}}
{{#if is_audit_type_unsure}}
This package is prepared for an undecided SOC 2 audit path and is written to support either Type I design readiness or Type II operating-effectiveness evidence once the audit period is confirmed.
{{/if}}

### Principal Service Commitments and System Requirements'
  ),
  updated_at = now()
where slug = 'system-description'
  and markdown_template not like '%### Audit Readiness Context%';