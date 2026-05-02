insert into public.templates (
  slug,
  name,
  description,
  tsc_category,
  criteria_mapped,
  output_filename_pattern,
  markdown_template,
  default_variables,
  is_active
)
values
  (
    'sox-itgc-control-matrix',
    'SOX IT General Controls Matrix',
    'SOX-oriented IT general controls matrix for entity-level governance, access, change management, and system operations.',
    'SOX / ITGC',
    array['COMMON', 'SOX'],
    '27-sox-itgc-control-matrix.md',
    $$---
title: SOX IT General Controls Matrix
slug: sox-itgc-control-matrix
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# SOX IT General Controls Matrix

## Purpose
{{organization_name}} maintains this matrix to map IT general controls that may support Sarbanes-Oxley (SOX) internal control over financial reporting (ICFR), IPO readiness, parent-company control requests, and internal-audit evidence collection.

## Scoping Note
- This is a baseline ITGC matrix, not a legal determination that {{primary_product_name}} is in scope for SOX.
- Finance, controllership, internal audit, and system owners should confirm whether the product, connected systems, key reports, interfaces, or spreadsheets affect financial reporting.

## ITGC Matrix
| Control Domain | Control Objective | TrustScaffold Baseline | Typical Evidence | Owner | Review Frequency | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Entity-level governance | Management assigns control ownership, review cadence, and escalation for ITGC issues. | Policy governance, internal audit cadence, and management review operate through the security baseline. | Policy approvals, governance meeting minutes, deficiency log | {{sox_control_owner}} | {{sox_review_frequency}} | Draft |
| User provisioning | Access to in-scope systems is approved before access is granted. | Access requests, approvals, and onboarding flow are documented through the access-control policy and {{hris_provider}} lifecycle process. | Access tickets, approval records, onboarding evidence | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Access modification and removal | Role changes and terminations are reflected promptly in connected systems. | Joiner / mover / leaver control relies on {{hris_provider}}, {{idp_provider}}, and the offboarding SLA. | HR change record, termination ticket, deprovisioning screenshots | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Privileged access | Elevated access is limited, approved, and reviewed. | MFA, privileged-access restriction, and periodic review expectations are part of the baseline control set. | Admin roster, privileged group export, MFA policy, review sign-off | {{control_operator}} | {{sox_access_review_frequency}} | Draft |
| Access recertification | Management reviews access for key systems on a recurring basis. | Quarterly access review cadence is expected for systems with material operational or reporting impact. | Access review workbook, reviewer sign-off, remediation tickets | {{sox_control_owner}} | {{sox_access_review_frequency}} | Draft |
| Change management | Changes are authorized, tested, reviewed, and promoted through controlled workflows. | Changes to {{primary_product_name}} move through {{source_control_tool}} and {{ticketing_system}} with peer review and approval expectations. | Change ticket, pull request, test evidence, deployment log | {{control_operator}} | {{sox_change_review_frequency}} | Draft |
| Emergency changes | Emergency changes are separately identified, approved, and retrospectively reviewed. | Emergency changes follow the baseline change policy and require after-the-fact review. | Emergency ticket, incident reference, post-change approval | {{control_operator}} | {{sox_change_review_frequency}} | Draft |
| Job operations and monitoring | Scheduled jobs, incident response, and production exceptions are monitored and resolved. | Incident, monitoring, and backup controls create the baseline operating evidence set. | Monitoring alerts, incident tickets, failed-job log, backup results | {{control_operator}} | {{sox_review_frequency}} | Draft |
| Interfaces and key reports | Systems and reports used in reporting or reconciliations are inventoried and reviewed. | To be completed during finance and internal-audit scoping. | Report inventory, interface list, reconciliation evidence | {{finance_system_owner}} | {{sox_review_frequency}} | To be scoped |

## Next Steps
1. Mark systems, reports, integrations, and data extracts that affect ICFR.
2. Assign owners for each access, change, and operations control.
3. Link each control to evidence retained in {{ticketing_system}}, {{source_control_tool}}, {{idp_provider}}, and related systems.
4. Add compensating controls where segregation of duties or automation is limited.
$$,
    '{
      "organization_name": "Example Corp",
      "primary_product_name": "Example Cloud",
      "effective_date": "2026-04-26",
      "policy_version": "v0.1",
      "sox_control_owner": "Head of Internal Controls",
      "finance_system_owner": "Controller",
      "control_operator": "Security Operations Lead",
      "sox_review_frequency": "quarterly",
      "sox_access_review_frequency": "quarterly",
      "sox_change_review_frequency": "per release with quarterly control-owner review",
      "hris_provider": "Workday",
      "idp_provider": "Okta",
      "source_control_tool": "GitHub",
      "ticketing_system": "Jira"
    }'::jsonb,
    true
  ),
  (
    'sox-evidence-request-list',
    'SOX Access and Change Evidence Request List',
    'SOX-oriented evidence request list for access management, change management, privileged access, and key-report controls.',
    'SOX / ITGC',
    array['COMMON', 'SOX'],
    '28-sox-evidence-request-list.md',
    $$---
title: SOX Access and Change Evidence Request List
slug: sox-evidence-request-list
tsc_category: SOX / ITGC
criteria_mapped:
  - COMMON
  - SOX
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# SOX Access and Change Evidence Request List

## Purpose
This checklist helps {{organization_name}} collect the evidence commonly requested for SOX ITGC reviews across access provisioning, privileged access, access recertification, change management, deployments, and key-report controls.

## Access Management Evidence
- [ ] Current user listings for in-scope systems from {{idp_provider}} and connected applications.
- [ ] New-access requests with documented approval.
- [ ] Role-change requests and approvals.
- [ ] Termination / offboarding samples showing revocation within {{termination_sla_hours}} hours.
- [ ] Privileged-access roster and business justification.
- [ ] MFA policy screenshots or configuration exports.
- [ ] Quarterly access review sign-off package covering key systems.

## Change Management Evidence
- [ ] Change tickets from {{ticketing_system}} tied to releases or production changes.
- [ ] Pull requests or merge requests from {{source_control_tool}} showing reviewer approval.
- [ ] Test evidence for selected changes.
- [ ] Deployment log or release record.
- [ ] Emergency-change list with retrospective approval.
- [ ] Segregation-of-duties exceptions and compensating controls, if any.

## Operations and Monitoring Evidence
- [ ] Monitoring alerts and incident tickets for material production events.
- [ ] Backup success / restore evidence for critical environments.
- [ ] Problem-management or recurring-issue tracking for failed jobs, integrations, or reconciliations.

## Key Reports and Interfaces
- [ ] Inventory of key reports, data extracts, spreadsheets, and interfaces used in financial reporting or management review.
- [ ] Evidence showing report logic or query ownership.
- [ ] Review or reconciliation evidence for report completeness and accuracy.
- [ ] Change evidence when report logic, interface mappings, or spreadsheet formulas change.

## Review Notes
- Access evidence should be refreshed {{sox_access_review_frequency}}.
- Change-control evidence should be retained {{sox_change_review_frequency}}.
- Internal audit, finance, and system owners should confirm whether additional population exports or reconciliations are required for ICFR scoping.
$$,
    '{
      "organization_name": "Example Corp",
      "effective_date": "2026-04-26",
      "policy_version": "v0.1",
      "idp_provider": "Okta",
      "source_control_tool": "GitHub",
      "ticketing_system": "Jira",
      "termination_sla_hours": 24,
      "sox_access_review_frequency": "quarterly",
      "sox_change_review_frequency": "per release with quarterly control-owner review"
    }'::jsonb,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  tsc_category = excluded.tsc_category,
  criteria_mapped = excluded.criteria_mapped,
  output_filename_pattern = excluded.output_filename_pattern,
  markdown_template = excluded.markdown_template,
  default_variables = excluded.default_variables,
  is_active = excluded.is_active,
  updated_at = now();

update public.templates
set
  criteria_mapped = array['ISO27001', 'GDPR', 'CCPA', 'HIPAA', 'PCI', 'SOX'],
  markdown_template = replace(
    replace(
      markdown_template,
      '| PCI-DSS | {{#if has_cardholder_data_environment}}Yes{{else}}No CDE indicated{{/if}} | CDE stores, processes, transmits, or connects to CHD | {{policy_owner}} | CDE inventory, ASV scans, tokenization policy | Quarterly |  |',
      '| PCI-DSS | {{#if has_cardholder_data_environment}}Yes{{else}}No CDE indicated{{/if}} | CDE stores, processes, transmits, or connects to CHD | {{policy_owner}} | CDE inventory, ASV scans, tokenization policy | Quarterly |  |\n| SOX / ICFR | Review needed | Public company obligations, IPO readiness, parent-company controls, or systems that feed financial reporting | {{finance_system_owner}} | SOX ITGC matrix, access review evidence, change tickets, key report inventory | {{sox_review_frequency}} | Confirm whether {{primary_product_name}} or connected systems are in scope for financial reporting. |'
    ),
    'array[''ISO27001'', ''GDPR'', ''CCPA'', ''HIPAA'', ''PCI'']',
    'array[''ISO27001'', ''GDPR'', ''CCPA'', ''HIPAA'', ''PCI'', ''SOX'']'
  ),
  default_variables = default_variables || '{"finance_system_owner": "Controller", "sox_review_frequency": "quarterly"}'::jsonb,
  updated_at = now()
where slug = 'legal-regulatory-registry';

update public.templates
set
  criteria_mapped = array['COMMON', 'CC6', 'CC7', 'C1', 'ISO27001', 'PCI', 'SOX'],
  markdown_template = replace(
    markdown_template,
    'maintains an asset and cryptographic inventory to support SOC 2, ISO 27001, PCI-DSS, HIPAA, and privacy control expectations.',
    'maintains an asset and cryptographic inventory to support SOC 2, ISO 27001, SOX / ITGC, PCI-DSS, HIPAA, and privacy control expectations.'
  ),
  updated_at = now()
where slug = 'asset-management-cryptographic-inventory';