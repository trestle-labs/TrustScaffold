update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Emergency Changes',
    '## Segregation of Duties in Deployments
- Production deployments require {{approval_count}} peer approval before merge or release, recorded in {{ticketing_system}} or {{source_control_tool}}.
- Technical guardrails in {{source_control_tool}} enforce branch protection, required reviews, status checks, restricted merges, and administrative override logging for production branches.
- Self-approval is prohibited: the same individual may not author, approve, and deploy a production change without documented compensating management review.
- Emergency changes that bypass a normal guardrail must receive independent retrospective review within {{post_incident_review_window}}.

## Emergency Changes'
  ),
  default_variables = default_variables || '{
    "approval_count": "at least one",
    "ticketing_system": "Jira",
    "source_control_tool": "GitHub"
  }'::jsonb,
  updated_at = now()
where slug = 'change-management-policy'
  and markdown_template not like '%Segregation of Duties in Deployments%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Monitoring and Evidence',
    '## Procedural Annex: Data Validation and Error Handling
- Procedures for {{primary_product_name}} data validation document the workflow owner, approved input sources, required fields, authorization checks, validation logic, and expected outputs for each material processing workflow.
- Data integrity checks include {{data_integrity_checks}}.
- Validation logic includes {{validation_logic}} and is tested before release through the Change Management Policy.
- Exception queues, failed jobs, reconciliation differences, and manual corrections are reviewed by {{processing_integrity_owner}} or a delegate and linked to tickets in {{ticketing_system}}.
- Corrections preserve the original record, correction rationale, approver, timestamp, and evidence of downstream output review when customer-facing data or reports are affected.

## Monitoring and Evidence'
  ),
  default_variables = default_variables || '{
    "data_integrity_checks": "input validation tests, control-total reconciliations, duplicate checks, failed-job review, output sampling, and correction approval records",
    "validation_logic": "required-field checks, source authorization checks, duplicate detection, format validation, reconciliation rules, and exception queue review"
  }'::jsonb,
  updated_at = now()
where slug = 'processing-integrity-policy'
  and markdown_template not like '%Procedural Annex: Data Validation and Error Handling%';

update public.templates
set
  markdown_template = replace(
    replace(
      markdown_template,
      '{{organization_name}} shall establish an internal audit review cadence of at least annually.
{{/if}}',
      '{{organization_name}} shall establish an internal audit review cadence of at least annually.
{{/if}}
The selected internal audit cadence must be documented as monthly, quarterly, or annually, and annual is the minimum acceptable cadence for SOC 2 readiness.'
    ),
    '## 4. Ongoing Monitoring',
    '## 4. Ongoing Monitoring

### 4.0 Monitoring Frequency Selection
Management reviews control-monitoring results on a **{{control_monitoring_frequency}}** basis. The selected frequency is documented in the audit plan and must be one of monthly, quarterly, or annually.

| Monitoring Area | Minimum Frequency | Evidence |
| --- | --- | --- |
| Access review completion | Quarterly | Completed access review records and remediation tickets |
| Change-management sampling | {{control_monitoring_frequency}} | Sampled change tickets, peer reviews, approvals, and deployment records |
| Incident-response records | {{control_monitoring_frequency}} | Incident tickets, severity classifications, post-incident reviews, and corrective actions |
| Vendor assurance review status | At least annually | Current assurance reports, review notes, and follow-up tickets |
| Risk register and treatment plans | {{control_monitoring_frequency}} | Updated risk register entries and treatment-plan status |'
  ),
  default_variables = default_variables || '{
    "control_monitoring_frequency": "quarterly"
  }'::jsonb,
  updated_at = now()
where slug = 'internal-audit-monitoring-policy'
  and markdown_template not like '%Monitoring Frequency Selection%';
