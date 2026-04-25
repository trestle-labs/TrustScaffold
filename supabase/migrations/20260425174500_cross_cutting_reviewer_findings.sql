update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Evidence
{{organization_name}} retains approval and revocation records in its ticketing and identity systems.',
    '## Standard Operating Procedure: Access Requests and Revocation
1. The requester opens an access ticket in {{ticketing_system}} with the user, role, system, business justification, and requested access duration.
2. The approving manager or system owner validates the access need and records approval before provisioning.
3. The control operator provisions only the approved role or group and attaches provisioning evidence to the ticket.
4. Access changes, privileged grants, and emergency access are reviewed during the next access review cycle.
5. Offboarding tickets document account disablement, session/token revocation, device return, and evidence retained by the control operator.

## Evidence
{{organization_name}} retains approval and revocation records in its ticketing and identity systems.'
  ),
  default_variables = default_variables || '{"ticketing_system": "Jira"}'::jsonb,
  updated_at = now()
where slug = 'access-control-on-offboarding-policy'
  and markdown_template not like '%Standard Operating Procedure: Access Requests and Revocation%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Logging and Evidence
Security-relevant events from infrastructure, identity, and application layers are retained according to the log retention schedule.',
    '## Standard Operating Procedure: Incident Execution
1. The on-call responder opens or updates an incident ticket in {{ticketing_system}} and records detection source, affected systems, initial severity, and timeline start.
2. The Incident Commander assigns investigation, containment, communications, and evidence-preservation owners.
3. Responders preserve relevant logs, alerts, screenshots, forensic artifacts, and customer-impact analysis before destructive remediation where feasible.
4. The Communications Lead documents internal and external notification decisions, including rationale when notification is not required.
5. The post-incident review records root cause, corrective actions, owners, due dates, and evidence of completion.

## Logging and Evidence
Security-relevant events from infrastructure, identity, and application layers are retained according to the log retention schedule.'
  ),
  default_variables = default_variables || '{"ticketing_system": "Jira"}'::jsonb,
  updated_at = now()
where slug = 'incident-response-plan'
  and markdown_template not like '%Standard Operating Procedure: Incident Execution%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '## Infrastructure-Specific Requirements',
    '## Standard Operating Procedure: Production Change Workflow
1. The change owner opens a ticket in {{ticketing_system}} with scope, risk, affected services, validation plan, rollback plan, and requested release window.
2. The author submits the change through {{source_control_tool}} and links the pull request, merge request, or release record to the change ticket.
3. Required reviewers validate design, testing, security impact, and rollback readiness before approval.
4. Technical guardrails prevent merge or deployment until required reviews and status checks pass.
5. The control operator attaches deployment evidence, validation results, and rollback outcome to the change record after release.

## Infrastructure-Specific Requirements'
  ),
  updated_at = now()
where slug = 'change-management-policy'
  and markdown_template not like '%Standard Operating Procedure: Production Change Workflow%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    'This checklist is generated from the exact infrastructure and operating assumptions captured in the TrustScaffold wizard for {{organization_name}}.

## Governance & Control Environment Evidence (CC1.1–CC1.5)',
    'This checklist is generated from the exact infrastructure and operating assumptions captured in the TrustScaffold wizard for {{organization_name}}.

## Evidence Retention Expectations

| Evidence Area | Minimum Retention Period | Verification Notes |
| --- | --- | --- |
| Security logs and monitoring records | {{log_retention_days}} days | Confirm SIEM, cloud logging, and alerting retention settings match the policy. |
| Backup and restore evidence | {{backup_retention_period}} | Confirm backup retention and restore-test artifacts are retained for the stated period. |
| Access reviews and access tickets | At least annually, or longer if required by the audit period | Confirm sampled access evidence covers the audit period under review. |
| Change-management records | At least annually, or longer if required by the audit period | Confirm change tickets retain approvals, peer reviews, deployment records, and rollback evidence. |
| Vendor assurance review records | At least annually | Confirm current SOC reports, review notes, and follow-up tickets are retained. |
| Incident response records | At least annually, or longer for material incidents | Confirm incident timelines, decisions, notifications, and post-incident actions are retained. |

## Governance & Control Environment Evidence (CC1.1–CC1.5)'
  ),
  updated_at = now()
where slug = 'evidence-checklist'
  and markdown_template not like '%Evidence Retention Expectations%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    '# System Description

## I. Company Overview',
    '# System Description

> Audit readiness warning: auditors will expect current data-flow diagrams or a procedural annex showing system boundaries, data ingress, processing paths, storage locations, third-party transfers, and data egress. If these diagrams are missing or stale, the System Description may be rejected as incomplete.

## I. Company Overview'
  ),
  updated_at = now()
where slug = 'system-description'
  and markdown_template not like '%Audit readiness warning:%';

update public.templates
set
  markdown_template = regexp_replace(
    markdown_template,
    E'(^# [^\n]+\n)',
    E'\\1\n## Control Ownership\n- Policy Owner: {{policy_owner}}\n- Control Operator: {{control_operator}}\n\n',
    'm'
  ),
  default_variables = default_variables || '{"policy_owner": "Control Owner", "control_operator": "Control Operator"}'::jsonb,
  updated_at = now()
where markdown_template not like '%## Control Ownership%';

update public.templates
set
  markdown_template = replace(
    markdown_template,
    E'---\n\n#',
    E'---\n\n<!-- Mapping: ' || array_to_string(criteria_mapped, ', ') || E' -->\n\n#'
  ),
  updated_at = now()
where markdown_template not like '%<!-- Mapping:%';
