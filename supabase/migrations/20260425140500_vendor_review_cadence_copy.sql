update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Review Cadence
Critical vendors are reviewed every {{vendor_review_frequency}}.',
    '## Review Cadence
Critical vendors are reviewed {{vendor_review_frequency}}.'
  ),
  updated_at = now()
where slug = 'vendor-management-policy'
  and markdown_template like '%Critical vendors are reviewed every {{vendor_review_frequency}}.%';