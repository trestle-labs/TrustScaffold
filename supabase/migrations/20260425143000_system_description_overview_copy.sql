update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application.{{#if industry}} {{organization_name}} operates in the {{industry}} industry.{{/if}}',
    '{{organization_name}} provides {{primary_product_name}}. {{system_description}}{{#if industry}} {{organization_name}} operates in the {{industry}} industry.{{/if}}'
  ),
  updated_at = now()
where slug = 'system-description'
  and markdown_template like '%{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application.%';