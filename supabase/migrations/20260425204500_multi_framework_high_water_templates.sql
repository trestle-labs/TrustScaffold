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
		'business-associate-agreement-template',
		'Business Associate Agreement Template',
		'HIPAA Business Associate Agreement baseline for vendors that create, receive, maintain, or transmit PHI.',
		'HIPAA',
		array['HIPAA'],
		'19-business-associate-agreement-template.md',
		$$---
title: Business Associate Agreement Template
slug: business-associate-agreement-template
tsc_category: HIPAA
criteria_mapped:
	- HIPAA
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Business Associate Agreement Template

## Purpose
This template defines minimum Business Associate Agreement (BAA) terms required before {{organization_name}} permits a vendor, subprocessor, contractor, or other business associate to create, receive, maintain, or transmit protected health information (PHI) for {{primary_product_name}}.

## Required Parties
- Covered entity or customer: to be completed during contract review.
- Business associate: vendor or service provider handling PHI.
- {{organization_name}} owner: {{policy_owner}}.
- Legal or privacy approver: {{privacy_contact_email}}.

## Required BAA Terms
1. The business associate may use or disclose PHI only as permitted by the agreement and applicable law.
2. The business associate must implement administrative, physical, and technical safeguards appropriate to the PHI handled.
3. The business associate must report security incidents, breaches, or unauthorized uses or disclosures to {{organization_name}} without unreasonable delay and no later than {{breach_notification_window}}.
4. Subcontractors that handle PHI must agree to equivalent restrictions and safeguards.
5. PHI must be returned, destroyed, or protected under continuing obligations at contract termination.
6. The business associate must make relevant records available for compliance review where required by law or contract.

## Vendor Review Procedure
{{#if has_subprocessors}}
Vendors with PHI access are reviewed through the vendor-management process:

| Vendor | Role | Data Shared | Assurance | Review Cadence |
| --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{role}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | {{review_cadence}} |
{{/each}}
{{else}}
No current PHI-handling vendors are listed. The business owner must confirm vendor scope before PHI is shared.
{{/if}}

## Evidence
- Executed BAA or contract addendum for each PHI-handling vendor.
- Vendor security review and assurance report, where available.
- Subcontractor flow-down confirmation.
- Breach notification contact and escalation path.
- Annual BAA review evidence retained {{baa_review_frequency}}.
$$,
		'{
			"organization_name": "Example Corp",
			"primary_product_name": "Example Health Cloud",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"policy_owner": "Privacy Officer",
			"privacy_contact_email": "privacy@example.com",
			"breach_notification_window": "60 calendar days",
			"baa_review_frequency": "annually",
			"has_subprocessors": false,
			"subprocessors": []
		}'::jsonb,
		true
	),
	(
		'phi-data-flow-inventory-map',
		'PHI Data Flow and Inventory Map',
		'HIPAA-focused inventory of PHI fields, systems, flows, recipients, safeguards, and retention.',
		'HIPAA',
		array['HIPAA'],
		'20-phi-data-flow-inventory-map.md',
		$$---
title: PHI Data Flow and Inventory Map
slug: phi-data-flow-inventory-map
tsc_category: HIPAA
criteria_mapped:
	- HIPAA
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# PHI Data Flow and Inventory Map

## Purpose
{{organization_name}} maintains this PHI inventory to document where protected health information enters, moves through, is stored by, is disclosed from, and is deleted from {{primary_product_name}}.

## PHI Inventory
| PHI Element / Dataset | Source | System Of Record | Purpose | Access Roles | Retention | Safeguards |
| --- | --- | --- | --- | --- | --- | --- |
| Treatment, diagnosis, claims, medical record, or healthcare-regulated fields | Customer, integration, import, or support workflow | To be completed | To be completed | Minimum necessary roles | Per retention schedule | Encryption, access logging, MFA, review |

## Data Flow Register
| Flow | Origin | Destination | Transfer Method | Vendor / Recipient | Logging | Approval Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| PHI ingestion | Customer or authorized integration | {{primary_product_name}} production environment | Encrypted transfer | Internal systems | Application and access logs | Integration/change record |
| PHI support access | Authorized support workflow | Ticketing and support tooling | Approved workflow | {{ticketing_system}} | Ticket and access logs | Support access ticket |

{{#if has_subprocessors}}
## PHI-Handling Vendors
| Vendor | PHI Shared | Assurance | BAA Required | Review Cadence |
| --- | --- | --- | --- | --- |
{{#each subprocessors}}
| {{name}} | {{data_shared}} | {{#if has_assurance_report}}{{assurance_report_type}}{{else}}None documented{{/if}} | Yes if PHI is shared | {{review_cadence}} |
{{/each}}
{{/if}}

## Review Requirements
- The PHI inventory is reviewed {{phi_inventory_review_frequency}} and after material product, vendor, integration, or data-flow changes.
- PHI access must follow minimum-necessary principles.
- Missing field-level inventory items are tracked as compliance gaps until remediated.
$$,
		'{
			"organization_name": "Example Corp",
			"primary_product_name": "Example Health Cloud",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"ticketing_system": "Jira",
			"phi_inventory_review_frequency": "quarterly",
			"has_subprocessors": false,
			"subprocessors": []
		}'::jsonb,
		true
	),
	(
		'tokenization-cardholder-data-policy',
		'Tokenization and Cardholder Data Policy',
		'PCI-DSS high-water policy for cardholder data storage, masking, tokenization, and CDE boundary controls.',
		'PCI-DSS',
		array['PCI'],
		'21-tokenization-cardholder-data-policy.md',
		$$---
title: Tokenization and Cardholder Data Policy
slug: tokenization-cardholder-data-policy
tsc_category: PCI-DSS
criteria_mapped:
	- PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Tokenization and Cardholder Data Policy

## Purpose
{{organization_name}} protects cardholder data (CHD) by minimizing storage, using tokenization where feasible, masking display values, and restricting all CHD handling to the approved cardholder data environment (CDE).

## Policy Requirements
- Raw primary account numbers (PANs) may not be stored outside the approved CDE.
- Sensitive authentication data, including full track data, CVV/CVC, and PIN data, may not be stored after authorization.
- PAN display is masked except for personnel with documented business need.
- Tokenized values are used outside the CDE whenever processing does not require raw CHD.
- CDE boundary diagrams, connected systems, administrative paths, and vendor dependencies are reviewed after material changes.
- Encryption and key management follow approved algorithms: {{approved_encryption_algorithms}}.

## Tokenization Procedure
1. Payment workflows identify whether raw CHD is received, transmitted, processed, stored, or tokenized by a payment processor.
2. Raw CHD is routed only through approved payment components and service providers.
3. Tokens are stored in application systems instead of raw PAN wherever feasible.
4. Logs, support tickets, telemetry, and exports are monitored to prevent CHD leakage.
5. Exceptions require approval from {{approver_name}} and documented compensating controls.

## Evidence
- CDE boundary diagram and system inventory.
- Tokenization or payment-processor configuration.
- Masking screenshots or configuration evidence.
- Key-management and encryption configuration evidence.
- CHD leakage monitoring or log-scrubbing evidence.
$$,
		'{
			"organization_name": "Example Corp",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"approver_name": "Head of Security",
			"approved_encryption_algorithms": "AES-256, TLS 1.2+, and provider-managed key protection"
		}'::jsonb,
		true
	),
	(
		'quarterly-vulnerability-scanning-sop',
		'Quarterly Vulnerability Scanning SOP',
		'PCI-DSS SOP for quarterly ASV scanning, internal scanning, remediation, rescans, and evidence retention.',
		'PCI-DSS',
		array['PCI'],
		'22-quarterly-vulnerability-scanning-sop.md',
		$$---
title: Quarterly Vulnerability Scanning SOP
slug: quarterly-vulnerability-scanning-sop
tsc_category: PCI-DSS
criteria_mapped:
	- PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Quarterly Vulnerability Scanning SOP

## Purpose
{{organization_name}} performs recurring vulnerability scans for systems in or connected to the CDE and retains evidence needed for PCI-DSS readiness.

## Scan Cadence
- External ASV scans are performed {{asv_scan_frequency}} and after significant CDE changes.
- Internal vulnerability scans are performed {{pci_scan_frequency}} for CDE systems and connected services.
- Failed scans are remediated and rescanned until passing results are obtained.

## Procedure
1. Confirm current CDE scope, internet-facing assets, connected systems, and payment-provider integrations.
2. Schedule ASV scans and internal authenticated scans.
3. Triage results by severity, exploitability, exposure, and CDE impact.
4. Track remediation in {{ticketing_system}} with owner, due date, evidence, and rescan result.
5. Retain scan reports, attestation status, remediation tickets, and exception approvals.

## Remediation Expectations
High-risk findings must be remediated within {{vulnerability_remediation_sla}}. Exceptions require risk acceptance by {{approver_name}}, compensating controls, and a target remediation date.
$$,
		'{
			"organization_name": "Example Corp",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"asv_scan_frequency": "every 90 days",
			"pci_scan_frequency": "quarterly",
			"ticketing_system": "Jira",
			"vulnerability_remediation_sla": "30 days for high-risk findings and before scan attestation for failing ASV findings",
			"approver_name": "Head of Security"
		}'::jsonb,
		true
	),
	(
		'iso27001-statement-of-applicability',
		'ISO 27001 Statement of Applicability',
		'ISO 27001 Annex A master index showing applicability, implementation status, rationale, owners, and linked evidence.',
		'ISO 27001',
		array['ISO27001'],
		'23-iso27001-statement-of-applicability.md',
		$$---
title: ISO 27001 Statement of Applicability
slug: iso27001-statement-of-applicability
tsc_category: ISO 27001
criteria_mapped:
	- ISO27001
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# ISO 27001 Statement of Applicability

## Purpose
The Statement of Applicability (SoA) is {{organization_name}}'s master index for ISO 27001 Annex A controls. It records whether each control is applicable, why it is included or excluded, implementation status, ownership, and linked TrustScaffold documentation.

## SoA Review Requirements
- Reviewed {{soa_review_frequency}}.
- Updated after material changes to scope, risk assessment, vendors, infrastructure, products, or legal obligations.
- Exclusions require documented rationale and approval from {{approver_name}}.

## Starter Annex A Applicability Matrix
| Annex A Domain | Applicability | Rationale | TrustScaffold Support | Owner | Status | Reviewer Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Organizational controls | Applicable | Governance, risk, policy, supplier, legal, and incident controls are required for the ISMS. | Information Security Policy; Risk Management Policy; Vendor Management Policy; Legal and Regulatory Registry | {{policy_owner}} | Draft |  |
| People controls | Applicable | Workforce screening, training, acceptable use, and disciplinary expectations apply to all personnel. | Acceptable Use and Code of Conduct Policy; Evidence Checklist | {{control_operator}} | Draft |  |
| Physical controls | Applicable | Physical controls apply through offices, remote work, inherited cloud data center controls, or self-hosted assets. | Physical Security Policy; System Description | {{control_operator}} | Draft |  |
| Technological controls | Applicable | Identity, access, cryptography, logging, vulnerability, change, backup, and secure development controls apply to the system. | Access Control; Encryption; Secure SDLC; Change Management; Asset and Cryptographic Inventory | {{control_operator}} | Draft |  |

## Exclusion Register
| Control / Domain | Excluded? | Rationale | Compensating Control | Approver | Date |
| --- | --- | --- | --- | --- | --- |
| To be completed during ISO scoping |  |  |  | {{approver_name}} | {{effective_date}} |
$$,
		'{
			"organization_name": "Example Corp",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"soa_review_frequency": "annually and after material scope changes",
			"approver_name": "Chief Executive Officer",
			"policy_owner": "Security Owner",
			"control_operator": "Control Operator"
		}'::jsonb,
		true
	),
	(
		'legal-regulatory-registry',
		'Legal and Regulatory Registry',
		'ISO 27001-oriented registry of legal, regulatory, statutory, contractual, and framework obligations.',
		'ISO 27001',
		array['ISO27001', 'GDPR', 'CCPA', 'HIPAA', 'PCI'],
		'24-legal-regulatory-registry.md',
		$$---
title: Legal and Regulatory Registry
slug: legal-regulatory-registry
tsc_category: ISO 27001
criteria_mapped:
	- ISO27001
	- GDPR
	- CCPA
	- HIPAA
	- PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Legal and Regulatory Registry

## Purpose
{{organization_name}} maintains this registry to identify laws, regulations, standards, contractual obligations, and customer commitments that affect {{primary_product_name}}.

## Registry
| Obligation | Applies? | Trigger | Owner | Required Documentation | Review Cadence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| SOC 2 Trust Services Criteria | Yes | TrustScaffold readiness package | {{policy_owner}} | Policy set, System Description, Evidence Checklist | Annually | Security is baseline. |
| ISO 27001 | Yes | Multi-framework readiness baseline | {{policy_owner}} | SoA, legal registry, risk register, asset inventory | {{legal_registry_review_frequency}} | Confirm certification scope before external audit. |
| GDPR / UK GDPR | {{#if website_targets_eu_or_uk_residents}}Yes{{else}}{{#if scope_includes_privacy}}Review needed{{else}}No EU/UK targeting indicated{{/if}}{{/if}} | EU/UK visitors, customers, monitoring, cookies, or behavioral tracking | {{privacy_contact_email}} | Privacy Notice, DPIA, DSAR log, cookie consent, vendor privacy terms | {{legal_registry_review_frequency}} | Website: {{company_website}} |
| CCPA / CPRA | {{#if website_targets_california_residents}}Yes{{else}}{{#if website_sells_or_shares_personal_information}}Yes{{else}}Review needed{{/if}}{{/if}} | California residents, sale/share, targeted advertising, or consumer privacy requests | {{privacy_contact_email}} | Privacy notice, opt-out links, DSAR log, retention schedule | {{legal_registry_review_frequency}} |  |
| HIPAA | {{#if stores_phi}}Yes{{else}}No PHI indicated{{/if}} | PHI handled by system or vendors | {{privacy_contact_email}} | BAA, PHI inventory, security incident records | {{legal_registry_review_frequency}} |  |
| PCI-DSS | {{#if has_cardholder_data_environment}}Yes{{else}}No CDE indicated{{/if}} | CDE stores, processes, transmits, or connects to CHD | {{policy_owner}} | CDE inventory, ASV scans, tokenization policy | Quarterly |  |
| Cookie / tracking consent | {{#if website_uses_cookies_analytics}}Review needed{{else}}No tracking indicated{{/if}} | Cookies, analytics, ads, pixels, session replay, or similar tracking | {{privacy_contact_email}} | Cookie banner, preference center, vendor list, consent log | {{legal_registry_review_frequency}} | Banner present: {{#if website_has_cookie_banner}}Yes{{else}}No{{/if}} |
| Children's privacy | {{#if website_allows_children_under_13}}Review needed{{else}}No child-directed use indicated{{/if}} | Site directed to children or knowingly collecting data from children under 13 | {{privacy_contact_email}} | Parental consent, age-screening, retention and deletion workflow | {{legal_registry_review_frequency}} |  |

## Maintenance Procedure
1. Review new products, data types, customers, regions, vendors, and contracts for new obligations.
2. Assign each obligation an owner and evidence location.
3. Track changes in {{ticketing_system}} or the compliance register.
4. Escalate unclear obligations to legal counsel or qualified compliance advisors.
$$,
		'{
			"organization_name": "Example Corp",
			"primary_product_name": "Example Cloud",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"policy_owner": "Security Owner",
			"privacy_contact_email": "privacy@example.com",
			"legal_registry_review_frequency": "quarterly",
			"ticketing_system": "Jira",
			"company_website": "https://example.com",
			"scope_includes_privacy": true,
			"stores_phi": false,
			"has_cardholder_data_environment": false,
			"has_customer_pii": true,
			"website_targets_eu_or_uk_residents": true,
			"website_targets_california_residents": true,
			"website_uses_cookies_analytics": true,
			"website_has_cookie_banner": true,
			"website_sells_or_shares_personal_information": false,
			"website_allows_children_under_13": false
		}'::jsonb,
		true
	),
	(
		'data-protection-impact-assessment',
		'Data Protection Impact Assessment',
		'GDPR/privacy DPIA template for high-risk personal-data processing activities.',
		'GDPR / Privacy',
		array['GDPR', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'],
		'25-data-protection-impact-assessment.md',
		$$---
title: Data Protection Impact Assessment
slug: data-protection-impact-assessment
tsc_category: GDPR / Privacy
criteria_mapped:
	- GDPR
	- P1
	- P2
	- P3
	- P4
	- P5
	- P6
	- P7
	- P8
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Data Protection Impact Assessment

## Purpose
This DPIA records privacy risks, safeguards, and approval decisions for high-risk processing activities in {{primary_product_name}}.

## Processing Description
| Area | Description |
| --- | --- |
| Processing purpose | To be completed for the workflow under review. |
| Data subjects | Customers, users, workforce members, or other individuals whose personal information is processed. |
| Personal data categories | {{#each data_classifications}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} |
| Systems and vendors | {{primary_product_name}}{{#if has_subprocessors}} and approved subprocessors{{/if}} |
| Retention | Per Data Retention and Disposal Policy. |

## Necessity and Proportionality
- Processing purpose is documented and communicated in the privacy notice.
- Data collection is limited to what is necessary for the stated purpose.
- Access is restricted to approved roles.
- Data subject request and correction workflows are tracked in {{ticketing_system}}.

## Risk Assessment
| Risk | Impact | Mitigation | Owner | Residual Risk | Notes |
| --- | --- | --- | --- | --- | --- |
| Unauthorized access to personal information | High | MFA, least privilege, logging, access reviews | {{control_operator}} | To be assessed |  |
| Excessive collection or retention | Medium | Data minimization and retention schedule | {{policy_owner}} | To be assessed |  |
| Unauthorized disclosure to vendor | High | Vendor review, privacy terms, disclosure register | {{policy_owner}} | To be assessed |  |
| Inaccurate or stale personal data | Medium | Correction workflow and downstream propagation | {{privacy_contact_email}} | To be assessed |  |

## Approval and Review
- DPIAs are reviewed {{dpia_review_frequency}}.
- High residual risk is escalated to executive leadership, legal counsel, or the appropriate supervisory authority when required.
- Material processing changes require DPIA update before release.
$$,
		'{
			"organization_name": "Example Corp",
			"primary_product_name": "Example Cloud",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"ticketing_system": "Jira",
			"policy_owner": "Privacy Officer",
			"control_operator": "Control Operator",
			"privacy_contact_email": "privacy@example.com",
			"dpia_review_frequency": "annually and before high-risk processing changes",
			"has_subprocessors": false,
			"data_classifications": [{ "name": "Customer PII", "description": "Personal information" }]
		}'::jsonb,
		true
	),
	(
		'asset-management-cryptographic-inventory',
		'Asset Management and Cryptographic Inventory',
		'Universal common-control inventory for assets, data stores, encryption mechanisms, keys, certificates, and owners.',
		'Universal',
		array['COMMON', 'CC6', 'CC7', 'C1', 'ISO27001', 'PCI'],
		'26-asset-management-cryptographic-inventory.md',
		$$---
title: Asset Management and Cryptographic Inventory
slug: asset-management-cryptographic-inventory
tsc_category: Universal
criteria_mapped:
	- COMMON
	- CC6
	- CC7
	- C1
	- ISO27001
	- PCI
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Asset Management and Cryptographic Inventory

## Purpose
{{organization_name}} maintains an asset and cryptographic inventory to support SOC 2, ISO 27001, PCI-DSS, HIPAA, and privacy control expectations.

## Asset Inventory
| Asset / System | Type | Environment | Data Classification | Owner | Criticality | Evidence Location |
| --- | --- | --- | --- | --- | --- | --- |
| {{primary_product_name}} production application | Application | Production | Confidential / regulated as applicable | {{system_owner_name}} | High | System Description |
| Identity provider: {{idp_provider}} | Identity service | Production | Workforce identity data | {{control_operator}} | High | Access-control evidence |
| Ticketing system: {{ticketing_system}} | Workflow system | Production | Operational and incident records | {{control_operator}} | Medium | Ticket exports |

## Cryptographic Inventory
| Mechanism | Purpose | Algorithm / Standard | Key Owner | Rotation Cadence | Storage / Service | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Data at rest encryption | Protect stored customer and company data | AES-256 or provider equivalent | {{control_operator}} | {{key_rotation_frequency}} | Cloud KMS or managed service | Encryption configuration |
| Data in transit encryption | Protect network transmission | TLS {{minimum_tls_version}} or stronger | {{control_operator}} | Certificate lifecycle | Load balancer / application endpoint | TLS scan or certificate record |
| Backup encryption | Protect backup copies | Provider-managed encryption | {{control_operator}} | {{key_rotation_frequency}} | Backup service | Backup configuration |

## Review Procedure
- Inventory owners review assets and cryptographic mechanisms {{cryptographic_inventory_review_frequency}}.
- New systems, data stores, keys, certificates, payment components, PHI stores, or privacy-impacting datasets must be added before production use.
- Retired assets must be removed only after data disposal, access revocation, and evidence retention are complete.
- Weak, deprecated, unknown, or undocumented algorithms are tracked as remediation items in {{ticketing_system}}.
$$,
		'{
			"organization_name": "Example Corp",
			"primary_product_name": "Example Cloud",
			"effective_date": "2026-04-18",
			"policy_version": "v0.1",
			"system_owner_name": "Head of Security",
			"control_operator": "Control Operator",
			"idp_provider": "Okta",
			"ticketing_system": "Jira",
			"minimum_tls_version": "1.2",
			"key_rotation_frequency": "annually or upon suspected compromise",
			"cryptographic_inventory_review_frequency": "quarterly"
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
