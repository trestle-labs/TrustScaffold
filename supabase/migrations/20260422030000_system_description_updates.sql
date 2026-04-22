-- System Description template improvements:
-- 1. Fix {{label}} → {{name}} bug in data_classifications each loop
-- 2. Add audit type (Type I vs Type II) language to Section I
-- 3. Handle acknowledgement_cadence = 'not-yet' gracefully
-- 4. Handle training_cadence = 'not-yet' gracefully
-- 5. Add industry context to Company Overview

UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '- **{{label}}**: {{description}}',
  '- **{{name}}**: {{description}}'
)
WHERE slug = 'system-description';

-- Add audit type context after the opening paragraph in Section I
UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application. This description covers the {{organization_name}} production system and supporting infrastructure for the period under examination.',
  '{{organization_name}} provides {{system_description}} deployed as a {{deployment_model}} application.{{#if industry}} {{organization_name}} operates in the {{industry}} industry.{{/if}}

{{#if is_type2}}
This description covers the design and operating effectiveness of controls over the audit period under examination.
{{else if is_type1}}
This description covers the design and implementation of controls as of the effective date.
{{else}}
This description covers the {{organization_name}} production system and supporting infrastructure.
{{/if}}'
)
WHERE slug = 'system-description';

-- Handle acknowledgement_cadence = 'not-yet'
UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '- An employee handbook and {{#if has_code_of_conduct}}code of conduct are{{else}}policies are{{/if}} acknowledged by employees ({{acknowledgement_cadence}}).',
  '{{#if (eq acknowledgement_cadence ''not-yet'')}}
- An employee handbook{{#if has_code_of_conduct}} and code of conduct are{{else}} is{{/if}} in place; a formal acknowledgement cadence is being established.
{{else}}
- An employee handbook and {{#if has_code_of_conduct}}code of conduct are{{else}}policies are{{/if}} acknowledged by employees ({{acknowledgement_cadence}}).
{{/if}}'
)
WHERE slug = 'system-description';

-- Handle training_cadence = 'not-yet'
UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '- Security awareness training is delivered via {{security_awareness_training_tool}} ({{training_cadence}} cadence).',
  '{{#if (eq training_cadence ''not-yet'')}}
- Security awareness training via {{security_awareness_training_tool}} is being implemented; completion cadence will be defined as the program matures.
{{else}}
- Security awareness training is delivered via {{security_awareness_training_tool}} ({{training_cadence}} cadence).
{{/if}}'
)
WHERE slug = 'system-description';
