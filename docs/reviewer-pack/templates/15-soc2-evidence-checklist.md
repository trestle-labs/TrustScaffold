# SOC 2 Evidence Checklist

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `evidence-checklist` |
| TSC category | Security |
| Criteria mapped | CC1, CC2, CC3, CC4, CC5, CC6, CC7, CC8, CC9 |
| Purpose | Operational evidence inventory generated from the same wizard inputs as the policy set. |
| Output filename | `15-soc2-evidence-checklist.md` |

---

---
title: SOC 2 Evidence Checklist
slug: evidence-checklist
tsc_category: Security
criteria_mapped:
  - CC1
  - CC2
  - CC3
  - CC4
  - CC5
  - CC6
  - CC7
  - CC8
  - CC9
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# SOC 2 Evidence Checklist

This checklist is generated from the exact infrastructure and operating assumptions captured in the TrustScaffold wizard for {{organization_name}}.

## Governance and Control Environment Evidence (CC1.1-CC1.5)

{{#if has_employee_handbook}}
- [ ] Current employee handbook with revision date and owner.
{{else}}
- [ ] **GAP**: Document why an employee handbook is not yet maintained and assign an owner for completion.
{{/if}}
{{#if has_code_of_conduct}}
- [ ] Current code of conduct.
{{#if (eq acknowledgement_cadence 'not-yet')}}
- [ ] Signed acknowledgement forms once the formal acknowledgement cadence is established.
{{else}}
- [ ] Signed acknowledgement forms covering new-hire acknowledgements and {{acknowledgement_cadence}} renewals.
{{/if}}
{{else}}
- [ ] **GAP**: Document why a separate code of conduct is not yet maintained.
{{/if}}
{{#if has_board_or_advisory}}
- [ ] Board or advisory charter defining security and risk oversight responsibilities.
- [ ] Board or advisory meeting minutes showing security or risk review at the {{board_meeting_frequency}} cadence.
{{else}}
- [ ] **GAP**: Document founder or executive oversight activities for security and risk decisions.
{{/if}}
{{#if has_org_chart}}
- [ ] Current organizational chart maintained via {{org_chart_maintenance}}.
{{else}}
- [ ] **GAP**: Produce and maintain an organizational chart for security-relevant roles.
{{/if}}
{{#if has_job_descriptions}}
- [ ] Job descriptions for security-relevant roles.
{{else}}
- [ ] **GAP**: Create job descriptions for key roles such as security owner, engineering lead, and HR owner.
{{/if}}

## Training and Competence Evidence (CC1.4)

{{#if security_awareness_training_tool}}
{{#if (eq training_cadence 'not-yet')}}
- [ ] Security awareness training implementation plan for {{security_awareness_training_tool}}, including the target completion cadence.
{{else}}
- [ ] Training completion records from {{security_awareness_training_tool}} for all employees at the {{training_cadence}} cadence.
{{/if}}
- [ ] New-hire training evidence showing security awareness training was completed before system access was granted.
{{else}}
- [ ] **GAP**: Implement and track a security awareness training program.
{{/if}}
{{#if has_phishing_simulation}}
- [ ] Phishing simulation results at the {{phishing_simulation_frequency}} cadence, including remediation for repeat failures.
{{else}}
- [ ] **GAP**: Consider phishing simulation or an equivalent awareness check as the program matures.
{{/if}}

## Information and Communication Evidence (CC2.1-CC2.3)

- [ ] Policy publication evidence showing security policies are accessible through {{policy_publication_method}}.
{{#if has_customer_contracts}}
- [ ] Sample customer contract, MSA, or terms of service showing security commitments.
{{else}}
- [ ] **GAP**: Formalize customer-facing security commitments in contracts, terms of service, or a security addendum.
{{/if}}
{{#if has_customer_support_channel}}
- [ ] Customer support channel documentation showing how customers report security concerns.
{{else}}
- [ ] **GAP**: Document how customers can report security-related concerns.
{{/if}}

## Risk Assessment and Monitoring Evidence (CC3.1-CC4.2)

{{#if has_risk_register}}
- [ ] Risk register with risks, owners, likelihood, impact, treatment plans, and review dates.
{{else}}
- [ ] **GAP**: Create and maintain a formal risk register.
{{/if}}
{{#if includes_fraud_risk_in_assessment}}
- [ ] Evidence that fraud risk scenarios are considered in risk assessment activities.
{{else}}
- [ ] **GAP**: Add fraud risk consideration to the risk assessment process.
{{/if}}
{{#if has_internal_audit_program}}
- [ ] Internal audit schedule and completed internal audit reports at the {{internal_audit_frequency}} cadence.
- [ ] Remediation tracking evidence for internal audit findings.
{{else}}
- [ ] **GAP**: Establish an internal audit or controls monitoring program for CC4.1-CC4.2.
{{/if}}

## Identity and Access Evidence (CC5, CC6.1-CC6.5)

- [ ] Directory export from {{idp_provider}} showing active workforce accounts.
{{#if requires_mfa}}
- [ ] Screenshot of MFA enforcement policy in {{idp_provider}}.
{{else}}
- [ ] Documented exception showing why MFA is not enforced and what compensating controls exist.
{{/if}}
- [ ] Quarterly access review artifact.
- [ ] Offboarding evidence showing access was revoked within {{termination_sla_hours}} hours.
- [ ] Onboarding evidence showing access was provisioned within {{onboarding_sla_days}} business days.
- [ ] Sample access-request ticket from {{ticketing_system}} showing approval for a privileged role grant.
- [ ] Sample access-removal ticket showing revocation was initiated by HR or management.

## Security Tooling Evidence (CC6.6, CC6.8, CC7.1)

{{#if has_siem}}
- [ ] SIEM dashboard or log export from {{siem_tool}} showing security event correlation.
- [ ] Alert configuration evidence for suspicious authentication, privilege, and configuration-change events.
- [ ] Log retention configuration showing {{log_retention_days}}-day retention.
{{else}}
- [ ] **GAP**: Implement centralized security monitoring or document compensating detective controls.
{{/if}}
{{#if has_waf}}
- [ ] WAF configuration evidence and a sample blocked-request log.
{{/if}}
{{#if has_endpoint_protection}}
- [ ] Endpoint protection deployment evidence from {{endpoint_protection_tool}} showing workforce-device coverage.
{{else}}
- [ ] **GAP**: Deploy endpoint protection on company-managed devices.
{{/if}}
{{#if has_mdm}}
- [ ] MDM enrollment and device-compliance evidence from {{mdm_tool}}.
{{else}}
- [ ] **GAP**: Consider MDM to enforce baseline device controls.
{{/if}}
{{#if has_vulnerability_scanning}}
- [ ] Vulnerability scan report from {{vulnerability_scanning_tool}}.
- [ ] Remediation evidence for critical or high findings.
{{else}}
- [ ] **GAP**: Implement vulnerability scanning for infrastructure and application components.
{{/if}}
{{#if has_penetration_testing}}
- [ ] Penetration test report from the {{penetration_test_frequency}} testing cycle and remediation evidence for findings.
{{else}}
- [ ] **GAP**: Conduct penetration testing or document risk acceptance if deferred.
{{/if}}

## Engineering Change Management Evidence (CC8.1)

{{#if (eq vcs_provider 'GitHub')}}
- [ ] Screenshot of GitHub branch protection rules for the default branch.
- [ ] Screenshot of GitHub repository admin and write access configuration.
{{else}}
{{#if (eq vcs_provider 'Azure DevOps')}}
- [ ] Screenshot of Azure DevOps branch policies for the default branch.
- [ ] Screenshot of Azure DevOps repository permission assignments.
{{else}}
- [ ] Screenshot of branch protection or merge policy configuration in {{vcs_provider}}.
- [ ] Screenshot of repository permissions in {{vcs_provider}}.
{{/if}}
{{/if}}
{{#if requires_peer_review}}
- [ ] Pull request sample showing peer review before merge.
{{else}}
- [ ] Approved exception for production changes merged without peer review.
{{/if}}
- [ ] Change ticket linked to a production deployment.
- [ ] Emergency change record showing post-hoc review.
- [ ] Evidence that deployment rollback was tested or exercised at least once in the audit period.

## Workforce Operations Evidence (CC6.2-CC6.3)

- [ ] Current employee roster from {{hris_provider}}.
- [ ] New-hire record mapped to onboarding tasks.
- [ ] Termination record mapped to access revocation tasks.
- [ ] Sample onboarding checklist showing security-awareness training was completed before system access was granted.
- [ ] Background check completion evidence for a sampled hire, redacted as appropriate.

## Security Operations Evidence (CC7.2-CC7.5)

- [ ] Incident or security event ticket from {{ticketing_system}}.
- [ ] On-call or escalation artifact from {{on_call_tool}}.
{{#if has_monitoring_tool}}
- [ ] Infrastructure monitoring dashboard or alert configuration from {{monitoring_tool}}.
{{else}}
- [ ] **GAP**: Implement infrastructure monitoring for capacity and availability.
{{/if}}
- [ ] Post-incident review document for a resolved security event or tabletop exercise.
- [ ] Evidence that the incident playbook was followed during an event or exercise.
{{#if requires_cyber_insurance}}
- [ ] Current cyber insurance certificate.
{{else}}
- [ ] Documented rationale for operating without cyber insurance.
{{/if}}

## Infrastructure and Data Protection Evidence (CC6.6, CC7.1, A1.1)

- [ ] System inventory for the {{deployment_model}} environment.
{{#if uses_aws}}
- [ ] Screenshot of AWS IAM or federation baseline.
{{#if uses_availability_zones}}
- [ ] AWS public-exposure monitoring evidence, such as AWS Config rules for S3 public access.
- [ ] IAM MFA enforcement screenshots for privileged AWS roles.
{{/if}}
{{/if}}
{{#if uses_azure}}
- [ ] Screenshot of Azure tenant security baseline or Conditional Access configuration.
{{/if}}
{{#if uses_gcp}}
- [ ] Screenshot of GCP IAM bindings or Security Command Center overview.
{{/if}}
{{#if is_self_hosted}}
- [ ] Physical access logs for the server room, rack, or cage.
{{else}}
- [ ] Physical data center controls inherited from the cloud service provider, covered by vendor assurance reports.
{{/if}}
- [ ] Backup execution evidence and one restore test artifact.
- [ ] Encryption configuration evidence for data at rest and in transit.

## Confidentiality and Data Lifecycle Evidence (C1.1-C1.2)

{{#if has_nda_process}}
- [ ] Sample NDA or confidentiality agreement for employees or contractors.
{{else}}
- [ ] **GAP**: Implement confidentiality agreements for personnel with access to confidential data.
{{/if}}
{{#if data_retention_defined}}
- [ ] Data retention schedule mapping data types to retention periods.
{{else}}
- [ ] **GAP**: Define data retention schedules for all data classifications.
{{/if}}
{{#if has_data_disposal_procedure}}
- [ ] Data disposal procedure and a sample disposal ticket or certificate.
{{else}}
- [ ] **GAP**: Implement documented data disposal procedures with verifiable evidence.
{{/if}}

{{#if scope_includes_processing_integrity}}
## Processing Integrity Evidence (PI1.1-PI1.5)

- [ ] Processing objective inventory identifying critical workflows, reports, scheduled jobs, integrations, and customer-facing outputs for {{primary_product_name}}.
- [ ] Input validation evidence showing required fields, authorization checks, duplicate handling, and business-rule validation for sampled critical workflows.
- [ ] Job run logs or processing-monitoring dashboards showing successful, failed, retried, and exception states.
- [ ] Reconciliation records comparing source records, control totals, downstream outputs, or customer-facing reports.
- [ ] Exception tickets from {{ticketing_system}} showing owner assignment, root cause, correction, approval, and closure within {{processing_exception_sla}} or documented exception approval.
- [ ] Output review or report QA evidence showing completeness, accuracy, timeliness, and authorized delivery.
{{#if has_cardholder_data_environment}}
- [ ] Payment-processing evidence showing cardholder data remains tokenized, masked, or isolated inside the approved CDE boundary.
{{/if}}
{{#if stores_phi}}
- [ ] PHI processing sample showing minimum-necessary access, audit trail, and correction workflow evidence.
{{/if}}
{{/if}}

{{#if scope_includes_privacy}}
## Privacy Evidence (P1-P8)

- [ ] Current privacy notice and change history showing notice updates for material processing changes.
- [ ] Consent capture or opt-in evidence for processing activities that require explicit consent.
- [ ] Data subject request log showing acknowledgement within {{dsar_acknowledgement_window}}, identity verification, completion date, and closure evidence.
- [ ] Data quality or correction evidence showing personal information corrections are reviewed and propagated to downstream systems or subprocessors where applicable.
- [ ] Privacy complaint register showing intake channel, owner, investigation steps, outcome, and escalation decision.
- [ ] Privacy monitoring or internal audit evidence showing privacy commitments are tested and deficiencies are tracked to closure.
{{/if}}

## Vendor and Subprocessor Evidence (CC9.2)

{{#if has_subprocessors}}
{{#each subprocessors}}
### {{name}}
- [ ] Security review package for {{name}}: {{service_description}}
{{#if has_assurance_report}}
- [ ] {{assurance_report_type}} report from {{name}} for the current review period.
{{#if (eq control_inclusion 'carve-out')}}
- [ ] Evidence that complementary subservice organization controls required by the carve-out are implemented by {{@root.organization_name}}.
{{else}}
- [ ] Confirmation that {{name}} controls are tested inclusively within the SOC report.
{{/if}}
{{else}}
- [ ] **GAP**: Obtain an assurance report from {{name}} or document compensating due-diligence procedures.
{{/if}}
{{/each}}
{{else}}
- [ ] Confirmation that no subprocessors with material access are currently in scope.
{{/if}}
