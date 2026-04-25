update public.templates
set
  markdown_template = replace(
    markdown_template,
    '{{organization_name}} shall establish an internal audit review cadence of at least **annual** frequency.',
    '{{organization_name}} shall establish an internal audit review cadence of at least annually.'
  ),
  updated_at = now()
where slug = 'internal-audit-monitoring-policy'
  and markdown_template like '%at least **annual** frequency%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '- **{{name}}**: Data shared ({{data_shared}}) is subject to {{name}}''s retention and disposal procedures as evaluated during vendor review ({{review_cadence}} cadence).',
    '- **{{name}}**: Data shared ({{data_shared}}) is subject to {{name}}''s retention and disposal procedures as evaluated during {{review_cadence}}.'
  ),
  updated_at = now()
where slug = 'data-retention-disposal-policy'
  and markdown_template like '%vendor review ({{review_cadence}} cadence)%';