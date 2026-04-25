# UAT System Profile Library

Use this file with the organization-level UAT scripts when the tester needs a concrete system shape instead of a generic environment description.

Each profile below gives you:

- A system type to test
- A description seed to paste into `System Scope`
- Exact provider selections for Infrastructure, including cloud, identity, branch-protection guide provider, HRIS provider, and vendor assurance rows
- A vendor-assurance baseline for the sub-service rows
- Optional compliance overlays for combined audit or assessment goals

This closes the gap between maturity-only scripts and the real provider choices exposed in the wizard.

## Supported Coverage

The wizard currently exposes these provider choices that should be covered by UAT:

- Cloud providers: `AWS`, `Azure`, `GCP`
- Identity providers: `Entra ID`, `Okta`, `Google Workspace`, `JumpCloud`, `Other`
- VCS providers: `GitHub`, `Azure DevOps`, `GitLab`, `Bitbucket`, `Other`
- HRIS providers: `Rippling`, `BambooHR`, `Workday`, `Gusto`, `Other`
- Vendor assurance review cadence: `Annual review`, `Semi-annual review`, `Quarterly review`
- Vendor assurance report type: `SOC 2 Type II`, `SOC 2 Type I`, `SOC 1`, `ISO 27001`, `Penetration test letter`, `Other assurance`, `No report available`
- Vendor control treatment: `Inclusive — controls tested in your report`, `Carve-out — controls excluded, covered by vendor report`

Use one of the concrete profiles below first. If the exact provider combination you need is not pre-bundled, keep the system type and maturity pairing, then swap individual providers using the provider catalog at the end of this file.

## Compliance Overlay Matrix

The current wizard exposes one explicit audit target selector:

- `SOC 2 Type I`
- `SOC 2 Type II`
- `I\'m not sure yet`

HIPAA, PCI DSS, ISO 27001, and NIST CSF are currently product-level framework extensions rather than first-class wizard selectors. Use the overlays below when you want UAT to prove that a single TrustScaffold run can support a broader compliance motion anchored on SOC 2.

Important interpretation rule:

- `SOC 2 Type I` proves control design at a point in time.
- `SOC 2 Type II` proves control operation over a period.
- HIPAA and PCI DSS are not replaced by SOC 2. The overlay means `SOC 2 evidence should materially reduce duplicate work`, not `SOC 2 alone is the final attestation for the other framework`.

### Overlay O-1 — SOC 2 + HIPAA Readiness

Best when:

- You sell to healthcare, health-tech, or BAA-driven customers
- You need one control narrative that can satisfy SOC 2 and materially support HIPAA security-rule readiness

Choose `SOC 2 Type I` when:

- PHI-handling controls were recently implemented
- You need a first-pass design assertion before enough operating history exists

Choose `SOC 2 Type II` when:

- Access logging, training, incident handling, and vendor oversight have been operating long enough to sample
- Enterprise healthcare buyers expect stronger operating-effectiveness evidence

Use these wizard proxies:

- Data types: `Customer PII`, `Employee data`, and any other applicable categories
- `Protected health information (PHI) is in scope`: checked when regulated health information is present
- TSCs: always `Security`; usually add `Privacy`; add `Confidentiality` when contractual or regulated data-handling commitments are explicit
- Vendor list: include cloud host, IdP, ticketing/support tools, EHR or PHI-adjacent processors, and secure messaging vendors

Extra evidence expectations to test in UAT:

- Business associate agreement tracking for relevant vendors
- Workforce access restrictions and termination workflow evidence
- Security incident and breach-notification decision process
- Audit logging for PHI-adjacent administrative access
- Security awareness and phishing training records
- Review-stage HIPAA administrative safeguards preview language
- Generated privacy and system-description drafts with explicit HIPAA administrative safeguards language

Current product support:

- The wizard now includes a first-class `Protected health information (PHI) is in scope` field in `System Scope`. Infrastructure should be completed first so the provider profile is already known before testers classify data scope. Keep using `Customer PII` where applicable, but do not rely on it as the only healthcare signal.
- Review now shows a HIPAA administrative safeguards preview when PHI is in scope.
- Generate now includes framework-specific HIPAA administrative safeguards sections in the relevant drafts.

### Overlay O-2 — SOC 2 + PCI-DSS Readiness

Best when:

- You process payments or sell into procurement flows that ask for both SOC 2 and PCI evidence
- You want to prove that cardholder-data controls map cleanly into the broader SOC 2 operating model

Choose `SOC 2 Type I` when:

- The cardholder-data environment or segmentation model was implemented recently
- You are preparing for a first assessment and need design validation before a longer operating window exists

Choose `SOC 2 Type II` when:

- Segmentation, scanning, access review, and change-management controls have been operating long enough to sample
- Customers expect evidence that payment controls worked over time, not just that they were designed

Use these wizard proxies:

- Data types: `Payment data`, plus `Customer PII` if billing identities are linked to individuals
- `Cardholder data environment (CDE) is in scope`: checked when systems that store, process, transmit, or are directly connected to cardholder data are in scope
- TSCs: always `Security`; usually add `Confidentiality`; add `Privacy` if customer identity data is also in scope
- Vendor list: include the payment processor, tokenization provider, fraud tooling, cloud host, IdP, and VCS platform

Extra evidence expectations to test in UAT:

- Clear statement that raw PAN is either not stored or is isolated to the cardholder-data environment
- Network boundary and segmentation evidence
- Vulnerability scanning and patch cadence
- MFA for administrative access into payment-supporting systems
- Change review for payment code and infrastructure
- Review-stage PCI segmentation preview language
- Generated system-description drafts with explicit PCI segmentation responsibilities language

Current product support:

- The wizard now includes a first-class `Cardholder data environment (CDE) is in scope` field in `System Scope`. Infrastructure should be completed first so the provider profile is already known before testers classify data scope. Keep using `Payment data` where applicable, but do not rely on it as the only PCI signal.
- Review now shows a PCI segmentation preview when the CDE is in scope.
- Generate now includes framework-specific PCI segmentation responsibilities in the system description.

### Overlay O-3 — SOC 2 + ISO 27001 Preparation

Best when:

- You want a management-system friendly control baseline while still satisfying SOC 2 customer asks

Choose `SOC 2 Type I` when:

- You are formalizing policies, ownership, and risk management structure for the first time

Choose `SOC 2 Type II` when:

- The control environment and internal-review cadence are already running and need operating-effectiveness proof

Use these wizard proxies:

- TSCs: `Security` first, then add `Availability`, `Confidentiality`, or `Privacy` based on the environment
- Governance: make sure board or management review cadence, risk review, and internal audit answers are fully populated

Extra evidence expectations to test in UAT:

- Formal risk register cadence
- Internal audit or control-monitoring cadence
- Policy publication and acknowledgement process
- Management review and corrective-action trail

### Overlay O-4 — SOC 2 + NIST CSF Alignment

Best when:

- You need customer-facing SOC 2 assurance plus a more operational cybersecurity vocabulary for internal or public-sector conversations

Choose `SOC 2 Type I` when:

- You are still establishing the Identify / Protect / Detect / Respond / Recover control structure

Choose `SOC 2 Type II` when:

- Those controls already operate consistently and you want effectiveness evidence

Use these wizard proxies:

- Infrastructure, security tooling, and operations stages should be completed with maximum specificity
- Favor multi-cloud or hybrid profiles where those environments actually exist so the asset, logging, monitoring, and incident controls are exercised realistically

Extra evidence expectations to test in UAT:

- Asset inventory and network diagram coverage
- Logging, alerting, and incident response evidence
- Recovery planning and backup evidence
- Role-based access and change control evidence

## Overlay-to-Profile Pairings

Use these as starting combinations when you want a concrete maturity plus system plus framework story:

| Pairing | Best starting profile | Recommended audit target | What to assert in UAT |
| --- | --- | --- | --- |
| SOC 2 + HIPAA, first audit | SP-1 or SP-2 | SOC 2 Type I | The flow supports regulated healthcare language, vendor oversight, privacy selection, and training without collapsing into enterprise-only assumptions. |
| SOC 2 + HIPAA, mature program | SP-4 or SP-5 | SOC 2 Type II | The flow preserves quarterly review cadence, strong identity controls, incident readiness, and mature vendor assurance posture. |
| SOC 2 + PCI-DSS, first structured payment environment | SP-2 or SP-3 | SOC 2 Type I | The flow captures payment-data scope, segmentation intent, MFA, peer review, and payment-vendor dependency mapping. |
| SOC 2 + PCI-DSS, operating payment environment | SP-4 or SP-5 | SOC 2 Type II | The flow preserves multi-system operational evidence, vulnerability management, change review, and payment boundary language. |
| SOC 2 + ISO 27001 preparation | SP-2, SP-4, or SP-5 | Type I for early formalization, Type II for mature operation | Governance cadence, risk review, internal audit, and document control remain coherent through Review and Generate. |
| SOC 2 + NIST CSF alignment | Any profile matching the real environment | Type I or Type II based on control age | Infrastructure, tooling, and operations detail is rich enough to support Identify / Protect / Detect / Respond / Recover mapping later. |

## Profile SP-1 — First Audit, AWS-Only SaaS

Best paired with:

- [Level 1 — First-Time Organization](./level-1-first-time-organization.md)

System type:

- Single-cloud SaaS
- Workforce identity in Okta
- Source control in GitHub
- HRIS in Rippling

System description seed:

`TrustScaffold is a multi-tenant SaaS application hosted fully in AWS that stores customer account data, application logs, and employee access records for internal compliance operations.`

Use these exact provider answers:

- Cloud provider: `AWS`
- Identity provider: `Okta`
- VCS provider: `GitHub`
- HRIS provider: `Rippling`
- `We host our own hardware (on-premises / colocation)`: unchecked

Vendor assurance baseline:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| AWS | Cloud Hosting | Primary cloud hosting platform for production workloads, storage, backups, and infrastructure logs. | Customer application data, backups, infrastructure metadata, security logs | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Okta | Identity Provider | Workforce SSO and MFA provider for employee access to in-scope systems. | Employee identities, group memberships, authentication events | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| GitHub | Version Control / Source Code Hosting | Source control and pull-request workflow for application and infrastructure code. | Source code, pull requests, CI metadata, user identities | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Rippling | HRIS | System of record for employee lifecycle events that drive onboarding and offboarding. | Employee roster data, role changes, termination events | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

## Profile SP-2 — Growing Azure-First SaaS

Best paired with:

- [Level 2 — Growing Organization](./level-2-growing-organization.md)

System type:

- Single-cloud SaaS
- Azure-first hosting
- Microsoft identity stack
- Azure DevOps release workflow
- BambooHR for workforce events

System description seed:

`TrustScaffold is a customer-facing SaaS platform hosted in Azure with production application services, managed databases, and centralized logging. The team uses Microsoft identity controls and Azure DevOps for change management.`

Use these exact provider answers:

- Cloud provider: `Azure`
- Identity provider: `Entra ID`
- VCS provider: `Azure DevOps`
- HRIS provider: `BambooHR`
- `We host our own hardware (on-premises / colocation)`: unchecked on the first pass

Vendor assurance baseline:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| Azure | Cloud Hosting | Primary cloud platform for application hosting, managed services, network security, and logging. | Customer application data, network metadata, infrastructure logs | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Entra ID | Identity Provider | Authoritative workforce identity provider for SSO, MFA, and privileged access. | Employee identities, directory groups, authentication and admin events | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Azure DevOps | Version Control / Source Code Hosting | Source code, work-item, and branch-policy platform used for engineering change control. | Source code, build logs, branch policy metadata, user identities | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| BambooHR | HRIS | HRIS platform used to maintain employee records and trigger joiner/mover/leaver actions. | Employee roster data, department changes, termination dates | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

## Profile SP-3 — Growing GCP-First SaaS

Best paired with:

- [Level 2 — Growing Organization](./level-2-growing-organization.md)

System type:

- Single-cloud SaaS
- GCP-first hosting
- Google Workspace identity
- GitLab source control
- Gusto for HR operations

System description seed:

`TrustScaffold is a cloud-native SaaS platform deployed in GCP with managed compute, data storage, and centralized operational logging. The company uses Google Workspace for identity, GitLab for engineering workflows, and Gusto for HR operations.`

Use these exact provider answers:

- Cloud provider: `GCP`
- Identity provider: `Google Workspace`
- VCS provider: `GitLab`
- HRIS provider: `Gusto`
- `We host our own hardware (on-premises / colocation)`: unchecked

Vendor assurance baseline:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| GCP | Cloud Hosting | Primary cloud platform for compute, storage, IAM, and audit logging for the in-scope product. | Customer application data, infrastructure metadata, audit logs | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Google Workspace | Identity Provider | Workforce identity provider for email, SSO, account lifecycle, and authentication controls. | Employee identities, authentication events, groups, admin activity | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| GitLab | Version Control / Source Code Hosting | Source control and merge-request workflow used for software delivery and code review. | Source code, pipeline data, approvals, user identities | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Gusto | HRIS | HR platform used to maintain employee records and initiate access lifecycle actions. | Employee roster data, hire dates, termination dates | Semi-annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

## Profile SP-4 — Established Multi-Cloud SaaS

Best paired with:

- [Level 3 — Established Program](./level-3-established-program.md)

System type:

- Multi-cloud SaaS
- AWS and Azure both host production workloads
- Okta is the workforce IdP
- GitHub is the engineering control plane
- Workday is the HRIS

System description seed:

`TrustScaffold is an established multi-tenant SaaS platform with production services split across AWS and Azure for resilience, analytics, and regional service requirements. Workforce access is federated through Okta, engineering changes are controlled in GitHub, and employee lifecycle events come from Workday.`

Use these exact provider answers:

- Cloud providers: `AWS` and `Azure`
- Identity provider: `Okta`
- VCS provider: `GitHub`
- HRIS provider: `Workday`
- `We host our own hardware (on-premises / colocation)`: unchecked on the multi-cloud pass

Vendor assurance baseline:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| AWS | Cloud Hosting | Hosts application, storage, and monitoring services for part of the production environment. | Customer data, infrastructure logs, backups, deployment metadata | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Azure | Cloud Hosting | Hosts complementary application and data services for the production environment. | Customer data, network telemetry, infrastructure logs, key management metadata | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Okta | Identity Provider | Workforce SSO, MFA, and privileged access control provider across engineering and admin systems. | Employee identities, authentication logs, group memberships, admin actions | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| GitHub | Version Control / Source Code Hosting | Central code-hosting platform with branch protection and review enforcement. | Source code, review history, build metadata, user identities | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Workday | HRIS | Authoritative HR system used for employee records and workforce lifecycle events. | Employee roster data, job changes, termination events, managerial hierarchy | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

## Profile SP-5 — Established Hybrid Cloud + Self-Hosted

Best paired with:

- [Level 3 — Established Program](./level-3-established-program.md)

System type:

- Hybrid cloud plus self-hosted hardware
- AWS and Azure in use
- Self-hosted or colocated infrastructure remains in scope
- Entra ID is the workforce IdP
- Azure DevOps is the engineering control plane
- Workday is the HRIS

System description seed:

`TrustScaffold supports a hybrid production environment where customer-facing services run in AWS and Azure while a subset of processing, secure administration, or support infrastructure remains self-hosted or colocated. Identity is managed in Entra ID, engineering changes are controlled in Azure DevOps, and workforce lifecycle events come from Workday.`

Use these exact provider answers:

- Cloud providers: `AWS` and `Azure`
- Identity provider: `Entra ID`
- VCS provider: `Azure DevOps`
- HRIS provider: `Workday`
- `We host our own hardware (on-premises / colocation)`: checked

Vendor assurance baseline:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| AWS | Cloud Hosting | Public-cloud host for part of the production application and security monitoring surface. | Customer data, deployment metadata, infrastructure logs | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Azure | Cloud Hosting | Public-cloud host for part of the production application and enterprise control plane. | Customer data, network telemetry, infrastructure logs, secrets metadata | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Entra ID | Identity Provider | Central identity, MFA, and privileged administration provider for workforce accounts. | Employee identities, auth logs, role assignments, admin activity | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Azure DevOps | Version Control / Source Code Hosting | Change-management platform for code, branch policy, and controlled release workflows. | Source code, pull requests, build logs, user identities | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Workday | HRIS | System of record for employee records, manager relationships, and termination workflow triggers. | Employee roster data, reporting lines, employment status changes | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

## Profile SP-6 — Pure On-Prem Intent

Best paired with:

- [Pure On-Prem / Self-Hosted Gap](./environments/on-prem-self-hosted-gap.md)

Use this only when you need to document the unsupported product shape, not to validate a supported completion path.

## Provider Choice Catalog

Use this table when you need coverage for every supported provider option without creating a new full scenario document.

Default cadence by maturity:

- Level 1: `Annual review`
- Level 2: `Semi-annual review`
- Level 3: `Quarterly review`

If the provider is entered as `Other`, keep the role aligned to the nearest category, use `Other assurance`, and default control treatment to `Carve-out — controls excluded, covered by vendor report` unless the UAT goal is to prove that the control stays fully within the customer boundary.

| Category | Option | Default role | Description seed | Level 1 cadence | Level 2 cadence | Level 3 cadence | Default assurance report | Default control treatment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cloud Hosting | AWS | Cloud Hosting | Primary cloud platform for production workloads, storage, and audit logs. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Cloud Hosting | Azure | Cloud Hosting | Primary cloud platform for application services, identity-adjacent controls, and monitoring. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Cloud Hosting | GCP | Cloud Hosting | Primary cloud platform for compute, storage, IAM, and cloud-native logging. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Identity Provider | Entra ID | Identity Provider | Authoritative workforce directory, SSO, MFA, and privileged-access provider. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Identity Provider | Okta | Identity Provider | Workforce SSO and MFA provider for employee access to in-scope systems. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Identity Provider | Google Workspace | Identity Provider | Workforce identity and authentication platform for email, SSO, and user lifecycle management. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Identity Provider | JumpCloud | Identity Provider | Workforce identity and device-access platform for authentication, SSO, and admin access. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Identity Provider | Other | Identity Provider | Workforce identity and authentication provider used for employee access control. | Annual review | Semi-annual review | Quarterly review | Other assurance | Carve-out — controls excluded, covered by vendor report |
| Version Control / Source Code Hosting | GitHub | Version Control / Source Code Hosting | Source control, pull-request review, and branch-protection platform. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Version Control / Source Code Hosting | Azure DevOps | Version Control / Source Code Hosting | Source control, branch-policy, and release-workflow platform. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Version Control / Source Code Hosting | GitLab | Version Control / Source Code Hosting | Source control, merge-request, and CI/CD workflow platform. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Version Control / Source Code Hosting | Bitbucket | Version Control / Source Code Hosting | Source control and branch-permission platform used for engineering changes. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Version Control / Source Code Hosting | Other | Version Control / Source Code Hosting | Code-hosting and engineering workflow platform used for controlled changes. | Annual review | Semi-annual review | Quarterly review | Other assurance | Carve-out — controls excluded, covered by vendor report |
| HRIS | Rippling | HRIS | HRIS and workforce lifecycle system used for joiner/mover/leaver events. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| HRIS | BambooHR | HRIS | HR system used to maintain employee roster and status changes. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| HRIS | Workday | HRIS | Authoritative HR system for employee records, management hierarchy, and terminations. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| HRIS | Gusto | HRIS | HR and payroll platform used to maintain employee records and offboarding triggers. | Annual review | Semi-annual review | Quarterly review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| HRIS | Other | HRIS | HRIS or workforce operations platform used to trigger onboarding and offboarding controls. | Annual review | Semi-annual review | Quarterly review | Other assurance | Carve-out — controls excluded, covered by vendor report |