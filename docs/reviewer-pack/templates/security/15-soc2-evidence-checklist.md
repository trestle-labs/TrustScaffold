# SOC 2 Evidence Checklist

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC1.1, CC1.2, CC1.3, CC1.4, CC1.5, CC2.1, CC2.2, CC2.3, CC3.1, CC3.2, CC3.3, CC3.4, CC4.1, CC4.2, CC5.1, CC5.2, CC5.3, CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8, CC7.1, CC7.2, CC7.3, CC7.4, CC7.5, CC8.1, CC9.1, CC9.2 -->

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

<!-- Mapping: CC1, CC2, CC3, CC4, CC5, CC6, CC7, CC8, CC9 -->

# SOC 2 Evidence Checklist

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


This checklist is generated from the exact infrastructure and operating assumptions captured in the TrustScaffold wizard for {{organization_name}}.

## Evidence Retention Expectations

| Evidence Area | Minimum Retention Period | Verification Notes |
| --- | --- | --- |
| Security logs and monitoring records | {{log_retention_days}} days | Confirm SIEM, cloud logging, and alerting retention settings match the policy. |
| Backup and restore evidence | {{backup_retention_period}} | Confirm backup retention and restore-test artifacts are retained for the stated period. |
| Access reviews and access tickets | At least annually, or longer if required by the audit period | Confirm sampled access evidence covers the audit period under review. |
| Change-management records | At least annually, or longer if required by the audit period | Confirm change tickets retain approvals, peer reviews, deployment records, and rollback evidence. |
| Vendor assurance review records | At least annually | Confirm current SOC reports, review notes, and follow-up tickets are retained. |
| Incident response records | At least annually, or longer for material incidents | Confirm incident timelines, decisions, notifications, and post-incident actions are retained. |

## Governance & Control Environment Evidence (CC1.1–CC1.5)

### Integrity and Ethical Values (CC1.1)
{{#if has_employee_handbook}}
- [ ] Employee handbook (current version with revision date).
{{else}}
- [ ] **GAP**: Document rationale for not maintaining an employee handbook.
{{/if}}
{{#if has_code_of_conduct}}
- [ ] Code of conduct document (current version).
{{#if (eq acknowledgement_cadence 'not-yet')}}
- [ ] Signed acknowledgement forms once the formal acknowledgement cadence is established.
{{else}}
- [ ] Signed acknowledgement forms (new-hire acknowledgements and {{acknowledgement_cadence}} renewals).
{{/if}}
{{else}}
- [ ] **GAP**: Document rationale for not maintaining a separate code of conduct.
{{/if}}
{{#if has_disciplinary_procedures}}
- [ ] Disciplinary procedures document showing consequences for policy violations.
{{/if}}
- [ ] Background check completion evidence for sampled new hires (redacted as appropriate).

### Board Independence and Oversight (CC1.2)
{{#if has_board_or_advisory}}
- [ ] Board or advisory charter defining oversight responsibilities.
- [ ] Board meeting minutes showing security/risk is a standing agenda item ({{board_meeting_frequency}} cadence).
- [ ] Evidence that risk assessment results are presented to the board.
{{else}}
- [ ] **GAP**: Document the governance oversight structure in absence of a formal board (e.g., executive committee meeting notes).
{{/if}}

### Organizational Structure (CC1.3)
{{#if has_org_chart}}
- [ ] Current organizational chart (maintained via {{org_chart_maintenance}}).
{{else}}
- [ ] **GAP**: Produce and maintain an organizational chart.
{{/if}}
{{#if has_job_descriptions}}
- [ ] Job descriptions with defined roles and responsibilities for security-relevant positions.
{{else}}
- [ ] **GAP**: Create job descriptions for key roles (at minimum: security officer, engineering lead, HR lead).
{{/if}}
{{#if has_dedicated_security_officer}}
- [ ] Evidence of designated {{security_officer_title}} role with documented responsibilities.
{{/if}}

### Training and Competence (CC1.4)
{{#if security_awareness_training_tool}}
{{#if (eq training_cadence 'not-yet')}}
- [ ] Security awareness training implementation plan for {{security_awareness_training_tool}}, including the target completion cadence.
{{else}}
- [ ] Training completion records from {{security_awareness_training_tool}} for all employees ({{training_cadence}} cadence).
{{/if}}
- [ ] New-hire training completion evidence showing training was completed before system access was granted.
{{else}}
- [ ] **GAP**: Implement and track security awareness training program.
{{/if}}
{{#if has_phishing_simulation}}
- [ ] Phishing simulation campaign results ({{phishing_simulation_frequency}} cadence) including failure rates and remediation completion.
{{else}}
- [ ] **GAP**: Consider implementing phishing simulation campaigns to demonstrate ongoing awareness.
{{/if}}
{{#if has_security_bulletin_subscription}}
- [ ] Evidence of security bulletin subscription and response process (e.g., vendor advisories, CVE notifications).
{{/if}}

### Accountability (CC1.5)
{{#if has_performance_reviews_linked_to_controls}}
- [ ] Performance review template showing internal control responsibilities are evaluated.
- [ ] Sample completed performance review (redacted) demonstrating accountability for security duties.
{{else}}
- [ ] **GAP**: Update performance review process to include accountability for internal control responsibilities.
{{/if}}

## Information and Communication Evidence (CC2.1–CC2.3)

### Internal Communication (CC2.1–CC2.2)
- [ ] Policy publication evidence showing policies are accessible to employees via {{policy_publication_method}}.
{{#if has_internal_audit_program}}
- [ ] Internal audit reports or controls monitoring results ({{internal_audit_frequency}} cadence).
- [ ] Evidence that deficiencies identified in monitoring are tracked to remediation.
{{else}}
- [ ] **GAP**: Establish an internal controls monitoring program.
{{/if}}

### External Communication (CC2.3)
{{#if has_customer_contracts}}
- [ ] Sample customer contract / MSA / ToS showing security commitments and obligations.
{{else}}
- [ ] **GAP**: Formalize customer-facing security commitments in contracts or terms of service.
{{/if}}
{{#if has_customer_support_channel}}
- [ ] Customer support channel documentation showing how customers can report security concerns.
{{else}}
- [ ] **GAP**: Document the customer support channel for security-related inquiries.
{{/if}}
{{#if has_release_note_practice}}
- [ ] Sample release notes or change notifications sent to customers.
{{/if}}

## Risk Assessment Evidence (CC3.1–CC3.4)

### Risk Register and Assessment (CC3.1–CC3.2)
{{#if has_risk_register}}
- [ ] Risk register with identified risks, owners, likelihood/impact scores, and treatment plans.
- [ ] Evidence the risk register was reviewed within the audit period.
{{else}}
- [ ] **GAP**: Create and maintain a formal risk register.
{{/if}}

### Fraud Risk (CC3.3)
{{#if includes_fraud_risk_in_assessment}}
- [ ] Evidence that fraud risk scenarios (management override, unauthorized data manipulation) are included in the risk assessment.
{{else}}
- [ ] **GAP**: Add fraud risk consideration (intentional manipulation, override of controls) to risk assessment methodology.
{{/if}}

## Monitoring Activities Evidence (CC4.1–CC4.2)
{{#if has_internal_audit_program}}
- [ ] Internal audit schedule showing planned and completed reviews ({{internal_audit_frequency}}).
- [ ] Internal audit report with findings, recommendations, and management responses.
- [ ] Remediation tracking evidence showing deficiencies were addressed.
{{else}}
- [ ] **GAP**: Implement a formal internal audit or controls monitoring program to satisfy CC4.1–CC4.2.
{{/if}}

## Identity and Access Evidence (CC5, CC6.1–CC6.5)
- [ ] Directory export from {{idp_provider}} showing active workforce accounts.
{{#if requires_mfa}}
- [ ] Screenshot of MFA enforcement policy in {{idp_provider}}.
{{else}}
- [ ] Documented exception showing why MFA is not enforced and what compensating controls exist.
{{/if}}
- [ ] Quarterly access review artifact.
- [ ] Offboarding evidence showing access revoked within {{termination_sla_hours}} hours.
- [ ] Onboarding evidence showing access provisioned within {{onboarding_sla_days}} business days.
- [ ] Sample access-request ticket (e.g., Jira, ServiceNow) showing approval chain for a privileged role grant.
- [ ] Sample access-removal ticket showing revocation was initiated by HR or the manager, not the departing user.

## Security Tooling Evidence (CC6.6, CC6.8, CC7.1)

### Threat Detection (CC6.6)
{{#if has_siem}}
- [ ] SIEM dashboard or log export from {{siem_tool}} showing security event correlation.
- [ ] Alert configuration evidence showing monitoring rules for suspicious activity.
- [ ] Log retention configuration showing {{log_retention_days}}-day retention.
{{else}}
- [ ] **GAP**: Implement centralized security monitoring (SIEM) or document compensating detective controls.
{{/if}}
{{#if has_ids_ips}}
- [ ] IDS/IPS configuration evidence showing active monitoring rules.
- [ ] Sample IDS/IPS alert or blocked-event evidence.
{{/if}}
{{#if has_waf}}
- [ ] WAF configuration evidence showing protection rules for public-facing applications.
- [ ] Sample WAF log showing blocked requests.
{{/if}}

### Malware Prevention (CC6.8)
{{#if has_endpoint_protection}}
- [ ] Endpoint protection deployment evidence from {{endpoint_protection_tool}} showing coverage across fleet.
- [ ] Endpoint protection configuration showing real-time scanning and auto-update are enabled.
{{else}}
- [ ] **GAP**: Deploy endpoint protection on company-managed devices.
{{/if}}
{{#if has_mdm}}
- [ ] MDM enrollment evidence from {{mdm_tool}} showing device compliance status.
- [ ] MDM policy configuration (disk encryption, screen lock, OS updates).
{{else}}
- [ ] **GAP**: Consider implementing MDM to enforce device security baselines on company devices.
{{/if}}

### Vulnerability Management (CC7.1)
{{#if has_vulnerability_scanning}}
- [ ] Vulnerability scan report from {{vulnerability_scanning_tool}} (most recent).
- [ ] Evidence showing critical/high vulnerabilities were remediated within SLA.
{{else}}
- [ ] **GAP**: Implement vulnerability scanning for infrastructure and application components.
{{/if}}
{{#if has_penetration_testing}}
- [ ] Penetration test report from the {{penetration_test_frequency}} testing cycle, provided by a qualified third party.
- [ ] Remediation evidence for findings identified in the pen test.
{{else}}
- [ ] **GAP**: Conduct penetration testing (recommended annually at minimum) and document risk acceptance if deferred.
{{/if}}
{{#if has_dast}}
- [ ] DAST scan report for public-facing application(s).
{{/if}}

## Engineering Change Management Evidence (CC8.1)
{{#if (eq vcs_provider 'GitHub')}}
- [ ] Screenshot of GitHub Branch Protection Rules for the default branch.
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
- [ ] Approved exception for changes merged without peer review.
{{/if}}
- [ ] Change ticket linked to a production deployment.
- [ ] Emergency change record showing post-hoc review was completed (CC8.1).
- [ ] Evidence that deployment rollback was tested or exercised at least once in the audit period.

## Workforce Operations Evidence
- [ ] Current employee roster from {{hris_provider}}.
- [ ] New-hire record mapped to onboarding tasks.
- [ ] Termination record mapped to access revocation tasks.
- [ ] Sample onboarding checklist showing security-awareness training was completed before system access was granted.
- [ ] Background check completion evidence for a sampled hire (redacted as appropriate).

## Security Operations Evidence (CC7.2–CC7.5)
- [ ] Incident or security event ticket from {{ticketing_system}}.
- [ ] On-call or escalation artifact from {{on_call_tool}}.
{{#if has_monitoring_tool}}
- [ ] Infrastructure monitoring dashboard or alert configuration from {{monitoring_tool}}.
{{#if has_autoscaling}}
- [ ] Auto-scaling configuration evidence for production workloads.
{{/if}}
{{else}}
- [ ] **GAP**: Implement infrastructure monitoring for capacity and availability (A1.1).
{{/if}}
- [ ] Post-mortem or post-incident review document for a resolved security event (demonstrates lessons-learned loop).
- [ ] Evidence that incident playbook was followed during a real or tabletop exercise (CC7.4).
{{#if requires_cyber_insurance}}
- [ ] Current cyber insurance certificate.
{{else}}
- [ ] Documented rationale for operating without cyber insurance.
{{/if}}

## Infrastructure and Data Protection Evidence
- [ ] System inventory for the {{deployment_model}} environment.
{{#if uses_aws}}
- [ ] Screenshot of AWS IAM or federation baseline.
{{#if uses_availability_zones}}
- [ ] AWS Config Rules for S3 Public Access and public exposure monitoring.
- [ ] IAM MFA enforcement screenshots for privileged roles in AWS.
{{/if}}
{{/if}}
{{#if uses_azure}}
- [ ] Screenshot of Azure tenant security baseline or Conditional Access configuration.
{{#if uses_availability_zones}}
- [ ] Azure Monitor or Defender policy evidence for cloud logging and alert coverage.
{{/if}}
{{/if}}
{{#if uses_gcp}}
- [ ] Screenshot of GCP IAM bindings or Security Command Center overview.
{{#if uses_availability_zones}}
- [ ] Cloud Logging or Security Command Center evidence for public exposure and logging coverage.
{{/if}}
{{/if}}
{{#if uses_hybrid}}
- [ ] Physical server room access log covering the on-premise portion of the hybrid environment.
{{#if uses_cloud_vpn}}
- [ ] VPN or private connectivity logs showing administrative access into the hybrid boundary.
{{/if}}
{{/if}}
{{#if is_self_hosted}}
{{#if has_physical_server_room}}
- [ ] Physical access logs for the server room, rack, or cage.
{{/if}}
{{#if requires_biometric_rack_access}}
- [ ] Evidence of biometric or badge-plus-PIN enforcement for server racks or cages.
{{/if}}
{{#if tracks_media_destruction}}
- [ ] Media destruction logs or certificates for retired storage devices.
{{/if}}
{{else}}
- [ ] Physical data center controls are inherited from the cloud service provider and are covered by vendor assurance reports.
{{/if}}
- [ ] Backup execution evidence and one restore test artifact.
- [ ] Encryption configuration evidence for data at rest and in transit.

## Confidentiality and Data Lifecycle Evidence (C1.1–C1.2)
{{#if has_nda_process}}
- [ ] Sample NDA or confidentiality agreement (employee and/or contractor).
- [ ] NDA tracking evidence showing coverage across workforce.
{{else}}
- [ ] **GAP**: Implement NDA/confidentiality agreements for employees and contractors with access to confidential data.
{{/if}}
{{#if data_retention_defined}}
- [ ] Data retention schedule mapping data types to retention periods.
{{else}}
- [ ] **GAP**: Define and document data retention schedules for all data classifications.
{{/if}}
{{#if has_data_disposal_procedure}}
- [ ] Data disposal procedure document.
- [ ] Sample disposal ticket or certificate showing secure destruction was completed.
{{else}}
- [ ] **GAP**: Implement and document data disposal procedures with verifiable evidence of secure destruction.
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
- [ ] {{assurance_report_type}} report from {{name}} (current period).
{{#if (eq control_inclusion 'carve-out')}}
- [ ] Evidence that complementary subservice organization controls (CSOCs) required by the carve-out are implemented by {{organization_name}}.
{{else}}
- [ ] Confirmation that {{name}} controls are tested inclusively within the SOC report.
{{/if}}
{{else}}
- [ ] **GAP**: Obtain assurance report (SOC 2 preferred) from {{name}} or document compensating due-diligence procedures.
{{/if}}
{{/each}}
{{else}}
- [ ] Confirmation that no subprocessors with material access are currently in scope.
{{/if}}
