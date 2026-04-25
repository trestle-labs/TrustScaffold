update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{#if is_type2}}
This description covers the design and operating effectiveness of controls over the audit period under examination.
{{else if is_type1}}
This description covers the design and implementation of controls as of the effective date.
{{else}}
This description covers the {{organization_name}} production system and supporting infrastructure.
{{/if}}',
    '{{#if is_type2}}
This package is prepared for a **SOC 2 Type II** audit path. This description covers the design and operating effectiveness of controls over the audit period under examination.
{{else if is_type1}}
This package is prepared for a **SOC 2 Type I** audit path. This description covers the design and implementation of controls as of the effective date.
{{else}}
This package is prepared for an undecided SOC 2 audit path and is written to support either Type I design readiness or Type II operating-effectiveness evidence once the audit period is confirmed.
{{/if}}'
  ),
  updated_at = now()
where slug = 'system-description'
  and markdown_template not like '%This package is prepared for a **SOC 2 Type I** audit path%';