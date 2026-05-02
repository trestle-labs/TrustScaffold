# Wizard Template Gap Implementation Plan

## Purpose

This plan turns the current template-gap review into a concrete engineering rollout for the existing TrustScaffold wizard.

The goal is not to add new wizard steps. The goal is to enrich the existing steps so weak or placeholder-heavy documents compile into materially more defensible first drafts.

Current implementation anchors:
- Schema source of truth: [lib/wizard/schema.ts](../lib/wizard/schema.ts)
- Template payload builder: [lib/wizard/template-payload.ts](../lib/wizard/template-payload.ts)
- Conditional wizard behavior: [lib/wizard/rule-matrix.ts](../lib/wizard/rule-matrix.ts)
- Template selection rules: [lib/wizard/document-generation-rules.ts](../lib/wizard/document-generation-rules.ts)
- Generate UI: [components/wizard/policy-wizard.tsx](../components/wizard/policy-wizard.tsx)

## Design Principles

### Keep the existing step architecture

No new top-level wizard steps should be introduced for this work.

All additions should live inside current steps:
- Governance
- System Scope
- Security Tooling
- Operations

### Use nested subdomains, not flat field sprawl

Do not continue flattening all new fields directly into broad step objects.

Prefer nested structures inside current steps:
- `governance.sox`
- `governance.iso27001`
- `scope.hipaa`
- `scope.pci`
- `securityTooling.secureSdlc`
- `operations.riskProgram`
- `operations.incidentResponse`

This keeps the current step model stable while reducing long-term schema drift.

### Prefer derived defaults plus confirmation over repeated manual entry

Where existing answers already imply a reasonable starting value, the wizard should prefill and ask the user to confirm or override.

Examples:
- Incident commander defaults to the primary contact until replaced.
- Risk treatment options default to the canonical set and allow deselection.
- Some ISO 27001 Annex A applicability flags should be derived from current infrastructure and governance answers rather than asked directly.

### Separate baseline accuracy from maturity enrichment

Fields that prevent incorrect document content should land first.

Fields that improve polish, audit-readiness posture, or reviewer convenience should come later.

## Current Gaps Mapped To Existing Steps

| Gap Area | Existing Step | Recommended Subdomain | Primary Templates |
| --- | --- | --- | --- |
| Risk scoring and treatment | Operations | `operations.riskProgram` | `05-risk-management-policy` |
| Incident response ownership and SLAs | Operations | `operations.incidentResponse` | `03-incident-response-plan` |
| Secure SDLC depth | Security Tooling | `securityTooling.secureSdlc` | `12-secure-sdlc-policy` |
| PHI flow detail | System Scope | `scope.hipaa` | `19-business-associate-agreement-template`, `20-phi-data-flow-inventory-map` |
| PCI boundary detail | System Scope | `scope.pci` | `21-tokenization-cardholder-data-policy`, `22-quarterly-vulnerability-scanning-sop` |
| SOX ICFR scoping | Governance | `governance.sox` | `27-30` SOX templates |
| ISO 27001 targeting and SoA derivation | Governance | `governance.iso27001` | `23-iso27001-statement-of-applicability`, `24-legal-regulatory-registry` |

## Rollout Strategy

Implement this in three waves.

### Wave 1: Fix Incorrect Or Placeholder Content

These are the highest-value additions because current templates are either too generic or partially wrong without them.

Scope:
- Risk scoring and treatment
- Incident response ownership and SLAs
- PHI flow detail
- PCI boundary detail
- SOX scoped financial systems and access certification cadence

Why first:
- These areas currently compile into content that is too generic for reviewer scrutiny.
- They affect templates that look complete but lack the operational detail an auditor will ask for immediately.

### Wave 2: Improve Control Credibility

Scope:
- Secure SDLC depth
- Threat modeling and remediation SLAs
- PHI minimum-necessary access model
- SOX SoD matrix and change-freeze detail

Why second:
- These materially improve auditability but are less likely to make the baseline draft factually wrong on day one.

### Wave 3: Add Maturity And Reviewer Convenience Fields

Scope:
- External audit firm
- IR retainer firm
- Vulnerability disclosure program details
- ISO certification body and exclusion rationale

Why third:
- These improve realism and downstream readiness, but they are not as foundational as scope, cadence, ownership, or control boundary details.

## Wave 1 Detailed Plan

### 1. Operations Risk Program

#### Schema additions

Add `operations.riskProgram` with:
- `hasRiskRegister`: migrate from existing `operations.hasRiskRegister`
- `includesFraudRiskInAssessment`: migrate from existing `operations.includesFraudRiskInAssessment`
- `riskScoringMethod`
- `riskAppetite`
- `riskTreatmentOptions`
- `riskReviewCadence`
- `riskRegisterTool`

#### UI behavior

Show the expanded question chain only when `hasRiskRegister = true`.

Questions:
1. How do you score risks?
2. What is the organization's risk appetite?
3. Which treatment options are formally recognized?
4. How often is the risk register reviewed with leadership?
5. What system or tool tracks the register?

#### Template payload changes

Add:
- `risk_scoring_method`
- `risk_appetite_label`
- `risk_treatment_options_list`
- `risk_review_cadence`
- `risk_register_tool`

Replace current hardcoded `risk_review_frequency` when specific cadence data exists.

#### Rule-matrix additions

Add a generate-step warning when:
- `operations.riskProgram.hasRiskRegister = true`
- but `riskScoringMethod` is missing

Suggested warning intent:
- The generated Risk Management Policy will be incomplete without a documented scoring method.

#### Primary templates affected

- [docs/reviewer-pack/templates/security/05-risk-management-policy.md](../docs/reviewer-pack/templates/security/05-risk-management-policy.md)

### 2. Operations Incident Response

#### Schema additions

Add `operations.incidentResponse` with:
- `incidentResponseLead`
- `incidentTriageSlaMinutes`
- `incidentNotificationWindowHours`
- `postIncidentReviewWindow`
- `incidentEscalationPath`
- `incidentTypesWithPlaybooks`
- `hasIncidentRetainer`
- `irRetainerFirm`

#### UI behavior

Place this near the current `onCallTool` section.

Use current defaults as prefilled values rather than empty inputs:
- triage: `30`
- notification: `72`
- post-review: `1-week` or current nearest equivalent label
- lead: primary contact name/title until overridden

#### Template payload changes

Replace current hardcoded values:
- `triage_sla_minutes`
- `customer_notification_window`
- `post_incident_review_window`

Add:
- `incident_response_lead`
- `incident_escalation_path`
- `incident_types_with_playbooks_list`
- `has_incident_retainer`
- `ir_retainer_firm`

#### Rule-matrix additions

Add warnings when:
- `incidentResponseLead` is blank
- `incidentTypesWithPlaybooks` is empty for software-heavy orgs

#### Primary templates affected

- [docs/reviewer-pack/templates/security/03-incident-response-plan.md](../docs/reviewer-pack/templates/security/03-incident-response-plan.md)

### 3. Scope HIPAA Detail

#### Schema additions

Add `scope.hipaa` shown only when `scope.containsPhi = true`:
- `phiElements`
- `phiIngestionMethods`
- `phiStorageLocations`
- `phiThirdPartyAccess`
- `phiBaaCounterparties`
- `minimumNecessaryApproach`
- `phiRetentionYears`
- `hipaaSecurityOfficerDesignated`
- `hipaaPrivacyOfficerDesignated`
- `phiAuditLoggingEnabled`

#### UI behavior

Keep the existing PHI checkbox in System Scope, then expand a HIPAA detail group beneath it.

#### Template payload changes

Add:
- `phi_elements_list`
- `phi_ingestion_methods_list`
- `phi_storage_locations_list`
- `phi_baa_counterparties`
- `minimum_necessary_approach`
- `phi_retention_years`
- `hipaa_security_officer_designated`
- `hipaa_privacy_officer_designated`
- `phi_audit_logging_enabled`

#### Rule-matrix additions

Add warnings when PHI is in scope but:
- storage locations are missing
- minimum-necessary approach is missing
- third-party access is true and counterparties are blank

#### Primary templates affected

- [docs/reviewer-pack/templates/hipaa/19-business-associate-agreement-template.md](../docs/reviewer-pack/templates/hipaa/19-business-associate-agreement-template.md)
- [docs/reviewer-pack/templates/hipaa/20-phi-data-flow-inventory-map.md](../docs/reviewer-pack/templates/hipaa/20-phi-data-flow-inventory-map.md)

### 4. Scope PCI Detail

#### Schema additions

Add `scope.pci` shown only when `scope.hasCardholderDataEnvironment = true`:
- `storesCardholderData`
- `pciSaqLevel`
- `pciComplianceLevel`
- `paymentProcessors`
- `hasTokenizationSolution`
- `tokenizationProvider`
- `cdeNetworkSegmentation`
- `asvScanProvider`
- `cvssRemediationThreshold`
- `pciPenetrationTestCadence`

#### Template payload changes

Add:
- `stores_cardholder_data`
- `pci_saq_level`
- `pci_compliance_level`
- `payment_processors`
- `has_tokenization`
- `tokenization_provider`
- `cde_segmentation_type`
- `asv_scan_provider`
- `cvss_remediation_threshold`
- `pci_penetration_test_cadence`

Replace current generic PCI remediation text when specific values exist.

#### Rule-matrix additions

Add warnings when CDE is in scope but:
- SAQ level is unset
- segmentation is `none`
- ASV provider is blank

#### Primary templates affected

- [docs/reviewer-pack/templates/pci-dss/21-tokenization-cardholder-data-policy.md](../docs/reviewer-pack/templates/pci-dss/21-tokenization-cardholder-data-policy.md)
- [docs/reviewer-pack/templates/pci-dss/22-quarterly-vulnerability-scanning-sop.md](../docs/reviewer-pack/templates/pci-dss/22-quarterly-vulnerability-scanning-sop.md)

### 5. Governance SOX Scope

#### Schema additions

Add `governance.sox` shown only when `company.soxApplicability !== 'none'`:
- `externalAuditFirm`
- `financialSystemsInScope`
- `itgcFinancialSystems`
- `hasSegregationOfDutiesMatrix`
- `accessCertificationCadence`
- `hasJournalEntryControls`
- `changeFreezePeriod`
- `itgcRatingApproach`

#### UI behavior

Keep the existing SOX applicability control where it is, but expand a governance-owned SOX scoping section once enabled.

The repeating `itgcFinancialSystems` rows should capture:
- `name`
- `owner`
- `process`

#### Template payload changes

Add:
- `external_audit_firm`
- `financial_systems_in_scope_list`
- `itgc_system_rows`
- `has_sod_matrix`
- `access_certification_cadence`
- `has_journal_entry_controls`
- `change_freeze_period`
- `itgc_rating_approach`

#### Rule-matrix additions

Add warnings when SOX is enabled but:
- no financial systems are defined
- access certification cadence is missing
- no control owner/system owner detail is available

#### Primary templates affected

- [docs/reviewer-pack/templates/sox/27-sox-itgc-control-matrix.md](../docs/reviewer-pack/templates/sox/27-sox-itgc-control-matrix.md)
- [docs/reviewer-pack/templates/sox/28-sox-evidence-request-list.md](../docs/reviewer-pack/templates/sox/28-sox-evidence-request-list.md)
- [docs/reviewer-pack/templates/sox/29-sox-key-report-inventory.md](../docs/reviewer-pack/templates/sox/29-sox-key-report-inventory.md)
- [docs/reviewer-pack/templates/sox/30-sox-interface-control-register.md](../docs/reviewer-pack/templates/sox/30-sox-interface-control-register.md)

## Wave 2 Detailed Plan

### 6. Security Tooling Secure SDLC

#### Schema additions

Add `securityTooling.secureSdlc` with:
- `hasSastTool`
- `sastTool`
- `hasSecretsScanningTool`
- `secretsScanningTool`
- `hasDependencyScanning`
- `dependencyScanningTool`
- `hasThreatModeling`
- `threatModelingApproach`
- `threatModelingCadence`
- `remediationSlaCriticalDays`
- `remediationSlaHighDays`
- `hasSecurityChampionProgram`
- `hasVulnerabilityDisclosureProgram`
- `vulnerabilityDisclosureEmail`

#### Initial trimmed implementation

For the first SDLC pass, land only:
- `hasSastTool`
- `sastTool`
- `hasSecretsScanningTool`
- `secretsScanningTool`
- `hasDependencyScanning`
- `dependencyScanningTool`
- `hasThreatModeling`
- `threatModelingApproach`
- `remediationSlaCriticalDays`
- `remediationSlaHighDays`

This is enough to materially improve the template without overloading the step.

#### Rule-matrix additions

Add a recommendation or warning when:
- `company.businessModel = software`
- or delivery model implies product/software delivery
- and `hasThreatModeling = false`

#### Primary templates affected

- [docs/reviewer-pack/templates/security/12-secure-sdlc-policy.md](../docs/reviewer-pack/templates/security/12-secure-sdlc-policy.md)

### 7. Governance ISO 27001 Targeting

#### Schema additions

Add `governance.iso27001` with:
- `iso27001Targeted`
- `iso27001ScopeStatement`
- `iso27001CertificationBody`
- `iso27001ExclusionRationale`

#### Template payload strategy

Do not ask users to manually classify Annex A domains one by one.

Instead:
- derive baseline applicability flags from current infrastructure, governance, confidentiality, and operations answers
- then allow the targeted ISO inputs above to refine scope and exclusions

Examples of derivation candidates:
- physical controls from `infrastructure.hasPhysicalServerRoom`
- media handling from `infrastructure.tracksMediaDestruction`
- cryptographic emphasis from confidentiality and encryption-related answers
- people controls from handbook/code-of-conduct/training answers

#### Primary templates affected

- [docs/reviewer-pack/templates/iso27001/23-iso27001-statement-of-applicability.md](../docs/reviewer-pack/templates/iso27001/23-iso27001-statement-of-applicability.md)
- [docs/reviewer-pack/templates/iso27001/24-legal-regulatory-registry.md](../docs/reviewer-pack/templates/iso27001/24-legal-regulatory-registry.md)

## Wave 3 Detailed Plan

These fields should land only after the baseline content issues are fixed.

Examples:
- `externalAuditFirm`
- `irRetainerFirm`
- `hasVulnerabilityDisclosureProgram`
- `vulnerabilityDisclosureEmail`
- `iso27001CertificationBody`
- `iso27001ExclusionRationale`

## File-Level Execution Plan

### 1. Schema and defaults

Update:
- [lib/wizard/schema.ts](../lib/wizard/schema.ts)

Tasks:
- Add nested domain objects under existing steps.
- Preserve current persisted shape through a controlled migration layer if needed.
- Extend default values so older drafts still load safely.

### 2. Template payload builder

Update:
- [lib/wizard/template-payload.ts](../lib/wizard/template-payload.ts)

Tasks:
- Replace hardcoded placeholders with real wizard-driven values.
- Add formatter helpers for new list-based values.
- Prefer derived defaults when possible.

### 3. Rule matrix and generate-step warnings

Update:
- [lib/wizard/rule-matrix.ts](../lib/wizard/rule-matrix.ts)

Tasks:
- Add warnings for incomplete but in-scope programs.
- Add software-company SDLC warning logic.
- Add HIPAA, PCI, SOX, and risk-program completeness prompts.

### 4. Wizard UI

Update:
- [components/wizard/policy-wizard.tsx](../components/wizard/policy-wizard.tsx)

Tasks:
- Add conditional UI expansions inside existing steps.
- Keep the primary step flow unchanged.
- Group new question clusters visually so they read as one logical subdomain.

### 5. Template refinements

Update the affected reviewer-pack templates so they consume the new payload variables cleanly.

Priority templates:
- `03-incident-response-plan`
- `05-risk-management-policy`
- `12-secure-sdlc-policy`
- `20-phi-data-flow-inventory-map`
- `21-tokenization-cardholder-data-policy`
- `22-quarterly-vulnerability-scanning-sop`
- `27-30` SOX pack

### 6. Documentation

Update:
- [docs/DOCUMENT_GENERATION_REQUIREMENTS.md](./DOCUMENT_GENERATION_REQUIREMENTS.md)
- [docs/WIZARD_EXECUTION_CHAINS.md](./WIZARD_EXECUTION_CHAINS.md)
- relevant reviewer-pack docs if template behavior changes materially

## Suggested Delivery Order

### Milestone 1

Land operations risk program and incident response.

Reason:
- smallest scope for the highest template-fidelity gain
- directly removes currently hardcoded operational placeholders

### Milestone 2

Land HIPAA and PCI scope expansions.

Reason:
- these are already conditional branches in System Scope
- they currently create the sharpest regulated-data fidelity gap

### Milestone 3

Land SOX governance scoping.

Reason:
- current SOX triggers create four documents but do not adequately scope the systems those documents govern

### Milestone 4

Land trimmed Secure SDLC depth.

Reason:
- highest leverage improvement for software companies
- can be phased without making Security Tooling overwhelming on day one

### Milestone 5

Land ISO 27001 targeting and SoA derivation.

Reason:
- this is more design-sensitive because derivation logic matters more than raw input volume

## Validation Requirements For Each Milestone

At minimum:
1. Update schema defaults and validate draft hydration.
2. Run `npm run typecheck`.
3. Run `npx tsx scripts/test-templates.ts`.
4. Export the reviewer pack again when template output changes.
5. Verify the generate-step count and warning surfaces still behave correctly.

## Implementation Risks

### Persisted draft compatibility

Current wizard drafts are already stored and reloaded. Nested-domain additions must not break hydration of older saved drafts.

### Step bloat

Security Tooling and Operations are already dense. New fields should be grouped, progressively disclosed, and introduced only when in scope.

### Template overfitting

Do not let templates become dependent on too many organization-specific details to render coherently. Every new field should have a safe default or fallback phrasing path.

### Rule explosion

Rule-matrix additions should stay focused on missing critical completeness fields, not every optional maturity signal.

## Approval Recommendation

Approve Wave 1 immediately.

Wave 1 is the best return on effort because it fixes the places where generated documents are most likely to be challenged for being generic, incomplete, or operationally inaccurate.

Wave 2 and Wave 3 should proceed after Wave 1 is stable and template output has been reviewed against real UAT bundles.
