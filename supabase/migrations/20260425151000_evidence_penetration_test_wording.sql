update public.templates
set
  markdown_template = replace(
    markdown_template,
    '- [ ] Penetration test report at the {{penetration_test_frequency}} cadence and remediation evidence for findings.',
    '- [ ] Penetration test report from the {{penetration_test_frequency}} testing cycle and remediation evidence for findings.'
  ),
  updated_at = now()
where slug = 'evidence-checklist'
  and markdown_template like '%Penetration test report at the {{penetration_test_frequency}} cadence%';