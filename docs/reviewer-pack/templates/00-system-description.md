# System Description (DC 200)

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

| Field | Value |
| --- | --- |
| Template slug | `system-description` |
| TSC category | Security |
| Criteria mapped | CC1, CC2, CC3, CC4, CC5, CC6, CC7, CC8, CC9 |
| Purpose | AICPA DC 3 system description covering infrastructure, software, people, procedures, and data. |
| Output filename | `00-system-description.md` |

---

---
title: System Description
slug: system-description
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

# System Description

## I. Company Overview

{{organization_name}} provides {{primary_product_name}}. {{system_description}}{{#if industry}} {{organization_name}} operates in the {{industry}} industry.{{/if}}

{{#if is_type2}}
This package is prepared for a **SOC 2 Type II** audit path. This description covers the design and operating effectiveness of controls over the audit period under examination.
{{else if is_type1}}
This package is prepared for a **SOC 2 Type I** audit path. This description covers the design and implementation of controls as of the effective date.
{{else}}
This package is prepared for an undecided SOC 2 audit path and is written to support either Type I design readiness or Type II operating-effectiveness evidence once the audit period is confirmed.
{{/if}}

### Principal Service Commitments and System Requirements

{{organization_name}} has established the following commitments to its users:
- Security: The system is protected against unauthorized access, both physical and logical.
{{#if scope_includes_availability}}
- Availability: The system is available for operation and use as committed or agreed.
{{/if}}
{{#if scope_includes_confidentiality}}
- Confidentiality: Information designated as confidential is protected as committed or agreed.
{{/if}}
{{#if scope_includes_privacy}}
- Privacy: Personal information is collected, used, retained, disclosed, and disposed of in conformity with the commitments in the entity's privacy notice.
{{/if}}
{{#if scope_includes_processing_integrity}}
- Processing Integrity: System processing is complete, valid, accurate, timely, and authorized.
{{/if}}

## II. Infrastructure

### Cloud Infrastructure

{{#if uses_aws}}
#### Amazon Web Services (AWS)
{{organization_name}} uses AWS as a primary cloud provider. Compute, storage, and networking services are provisioned in production AWS accounts.
{{#if uses_availability_zones}}
- Production workloads are distributed across multiple Availability Zones for resilience.
{{/if}}
- AWS IAM is used for cloud identity and access management with least-privilege policies.
- Service Control Policies (SCPs) enforce organizational guardrails across accounts.
{{/if}}

{{#if uses_azure}}
#### Microsoft Azure
{{organization_name}} uses Azure as a cloud provider. Compute, storage, and networking services are provisioned in production Azure subscriptions.
{{#if uses_availability_zones}}
- Production workloads are distributed across multiple Availability Zones.
{{/if}}
- Azure Active Directory / Entra ID is used for cloud identity management.
- Azure Policy and Management Groups enforce organizational guardrails.
{{/if}}

{{#if uses_gcp}}
#### Google Cloud Platform (GCP)
{{organization_name}} uses GCP as a cloud provider. Compute, storage, and networking services are provisioned in production GCP projects.
{{#if uses_availability_zones}}
- Production workloads are distributed across multiple zones within regions.
{{/if}}
- GCP IAM bindings are used for cloud identity and access management.
- Organization Policies enforce guardrails across projects.
{{/if}}

{{#if is_self_hosted}}
### On-Premises Infrastructure
{{organization_name}} maintains physical infrastructure for hosting production systems.
{{#if has_physical_server_room}}
- Server rooms are access-controlled with logged entry and exit.
{{/if}}
{{#if requires_biometric_rack_access}}
- Biometric or badge-plus-PIN enforcement controls protect server racks.
{{/if}}
{{#if tracks_media_destruction}}
- Media destruction procedures are in place for retired storage devices.
{{/if}}
{{/if}}

{{#if uses_hybrid}}
### Hybrid Environment
{{organization_name}} operates a hybrid architecture spanning cloud and on-premises infrastructure. Network connectivity between environments is maintained through secure channels.
{{#if uses_cloud_vpn}}
- VPN or private connectivity links cloud and on-premises environments with encrypted transit.
{{/if}}
{{/if}}

### Network Architecture
- All external traffic is encrypted in transit using TLS 1.2 or higher.
- Internal service-to-service communication uses encrypted channels.
- Network segmentation separates production, staging, and development environments.

## III. Software

### Application Stack
- The primary application is built and deployed using modern software engineering practices.
- Version control is managed in {{vcs_provider}}.
{{#if requires_peer_review}}
- All production-affecting changes require peer review before merge.
{{else}}
- A documented exception process exists for changes merged without peer review.
{{/if}}

### Supporting Software
{{#if (eq idp_provider 'Entra ID')}}
- Identity Provider: Microsoft Entra ID (Azure AD)
{{else}}
  {{#if (eq idp_provider 'Okta')}}
- Identity Provider: Okta
  {{else}}
- Identity Provider: {{idp_provider}}
  {{/if}}
{{/if}}
- HR Information System: {{hris_provider}}
- Ticketing System: {{ticketing_system}}
- On-Call/Escalation: {{on_call_tool}}
{{#if requires_mfa}}
- Multi-Factor Authentication is enforced for all workforce access via {{idp_provider}}.
{{/if}}

## IV. People

### Organizational Structure
{{organization_name}} maintains the following functional roles relevant to the system:
- **Executive Leadership**: Responsible for setting security policy, risk appetite, and organizational commitments.
- **Engineering**: Responsible for developing, testing, and deploying the system.
- **Security/Compliance**: Responsible for security operations, incident response, and compliance monitoring.
- **Human Resources**: Responsible for onboarding, offboarding, and personnel management via {{hris_provider}}.

### Personnel Controls
- Background checks are conducted for new hires.
- Security awareness training is completed during onboarding and renewed annually.
- Access provisioning is completed within {{onboarding_sla_days}} business days of hire.
- Access revocation is completed within {{termination_sla_hours}} hours of termination.

## V. Procedures

### Change Management (CC8.1)
- Changes are tracked in {{vcs_provider}} with pull request workflows.
{{#if requires_peer_review}}
- Peer review is mandatory before production merge.
{{/if}}
- Deployments follow a defined release process with rollback capability.

### Incident Response (CC7.2–CC7.5)
- Incidents are tracked in {{ticketing_system}}.
- On-call escalation is managed via {{on_call_tool}}.
- Post-incident reviews are conducted and documented.

### Risk Management (CC3.1–CC3.4)
- {{organization_name}} maintains a risk register that is reviewed periodically.
- Risk assessments consider changes to infrastructure, personnel, and regulatory requirements.

### Monitoring Activities (CC4.1–CC4.2)
- Security monitoring covers infrastructure, application, and access events.
- Alerts are routed to the appropriate team via {{on_call_tool}}.
- Monitoring coverage is reviewed at least annually.

## VI. Data

### Data Classification
{{#if data_classifications}}
{{organization_name}} classifies data into the following categories:
{{#each data_classifications}}
- **{{name}}**: {{description}}
{{/each}}
{{else}}
{{organization_name}} classifies data into standard categories (Public, Internal, Confidential, Restricted) as defined in the Data Classification and Handling Policy.
{{/if}}

### Data Protection
- Data at rest is encrypted using AES-256 or equivalent.
- Data in transit is encrypted using TLS 1.2+.
- Backups are performed regularly and restore tests are conducted at least annually.
{{#if stores_phi}}
- Protected health information (PHI) is identified as regulated data requiring heightened access restrictions, audit logging, and workforce handling controls.
{{/if}}
{{#if has_cardholder_data_environment}}
- The cardholder data environment (CDE) is explicitly defined and protected through boundary controls, approved payment-system access, and monitored administrative activity.
{{/if}}

{{#if has_cardholder_data_environment}}
### PCI Segmentation Responsibilities
- The cardholder data environment boundary is documented and reviewed when infrastructure, payment flows, or connected services change.
- Inbound and outbound connections to the CDE are restricted to approved services, ports, and administrative paths.
- Administrative access into the CDE requires strong authentication, approved access methods, and logging.
- Changes affecting segmentation controls are reviewed through {{vcs_provider}} change-management workflows before deployment.
- Connected vendors and service providers that could affect the CDE are reviewed through the vendor-management process.
{{/if}}

### Subservice Organizations
{{#if has_subprocessors}}
The following subservice organizations are included in the system boundary:

| Vendor | Role | Data Shared |
|--------|------|-------------|
{{#each subprocessors}}
| {{name}} | {{role}} | {{data_shared}} |
{{/each}}

Complementary subservice organization controls (CSOCs) are evaluated as part of {{organization_name}}'s vendor management program.
{{else}}
No subservice organizations with material system access are currently in scope.
{{/if}}

## VII. Trust Services Criteria Mapping

This system description, together with the policy set and evidence artifacts generated by TrustScaffold, maps to the following AICPA Trust Services Criteria:

| Category | Criteria | Description |
|----------|----------|-------------|
| CC1 | Control Environment | Sections I, IV |
| CC2 | Communication and Information | Section I, policies |
| CC3 | Risk Assessment | Section V |
| CC4 | Monitoring Activities | Section V |
| CC5 | Control Activities | Sections II, III, V |
| CC6 | Logical and Physical Access | Sections II, III, IV |
| CC7 | System Operations | Section V |
| CC8 | Change Management | Section V |
| CC9 | Risk Mitigation | Sections V, VI |
{{#if scope_includes_availability}}
| A1 | Availability | Sections II, V |
{{/if}}
{{#if scope_includes_confidentiality}}
| C1 | Confidentiality | Section VI |
{{/if}}
{{#if scope_includes_privacy}}
| P1–P8 | Privacy | Section VI |
{{/if}}
{{#if scope_includes_processing_integrity}}
| PI1 | Processing Integrity | Sections III, V |
{{/if}}
