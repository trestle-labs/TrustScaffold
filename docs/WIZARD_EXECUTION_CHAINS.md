# Wizard Execution Chains

This document maps the answer-driven branches in the policy wizard so product, engineering, and QA can reason about what changes when an admin answers a specific way.

Primary implementation surface: [components/wizard/policy-wizard.tsx](components/wizard/policy-wizard.tsx)

Typed rule source of truth: [lib/wizard/rule-matrix.ts](../lib/wizard/rule-matrix.ts)

## Why This Exists

The wizard already behaves like a state machine, but most of the branching is encoded inline through `form.watch(...)`, conditional rendering, and a few cross-step auto-fill rules. That is workable while the flow is small. It gets risky once we add more answer-driven deep dives, because the user-visible behavior can drift away from docs and test coverage.

This file explains the behavior at a human level.

The machine-readable source of truth now lives in [lib/wizard/rule-matrix.ts](../lib/wizard/rule-matrix.ts), which defines active branching, recommendations, warnings, deep dives, validation follow-ups, and answer-path QA clusters.

## Core Control Points

1. Step sequencing
   - The step list is defined by `wizardStepTitles` and `stepFields`.
   - Navigation gating happens in `goToNextStep()`.

2. Reactive branching
   - Step-level warnings, recommendations, deep dives, validation follow-ups, and the key Governance visibility branches now come from the typed rule matrix.
   - A few UI-only toggles still use local conditional rendering, but the highest-risk answer paths are centralized.

3. Cross-step propagation
   - Some answers affect later steps without changing the current step directly.
   - Example: sub-service vendor selection in System Scope influences Governance training recommendations.

4. Generation gating
   - Base step validation plus active deep-dive follow-up validation is now driven from the typed rule matrix.
   - Generate still separates blocking missing-field issues from non-blocking quality warnings.

## Execution Chains By Step

## 0. Welcome & Onboarding

### Inputs
- `company.organizationRelationship`
- `company.orgAge`
- `company.complianceMaturity`
- `company.targetAuditType`

### Downstream effects
- The welcome step now asks whether the workspace organization is the in-scope company or a governing entity for another company.
- When the workspace org is the company, the company name is auto-filled from the active organization context.
- When the workspace org governs another company, generated payloads now carry both the governed company name and the governing workspace-organization name.
- Compliance maturity influences the recommended audit type when the current target is still `unsure`.
- `company.complianceMaturity === 'first-time'` triggers first-time guidance in Governance.
- `assessmentSummary.isFirstTimer` later influences advisory content in Operations and Security Assessment.

### Improvement opportunities
- Add a small rationale panel under audit type showing exactly why the recommendation changed.
- Record whether the user accepted or overrode the recommendation.

## 1. System Scope

### Inputs
- `scope.systemName`
- `scope.systemDescription`
- `scope.dataTypesHandled`
- `scope.containsPhi`
- `scope.hasCardholderDataEnvironment`
- `subservices[*]`

### Branches
- Each sub-service row can branch into:
  - known vendor selection
  - `Other` vendor path
  - known role selection
  - `Other` role path
  - assurance-report subfields when `hasAssuranceReport` is enabled

### Downstream effects
- Vendor selection can auto-fill role for known matches.
- Auto-filled role now shows a user-facing hint.
- Sub-service vendor and role text influence Governance training recommendations.
- Sub-service count is summarized again in Generate.
- Data type choices now trigger explicit Privacy contradiction warnings on TSC Selection, Review, and Generate when customer PII is in scope but Privacy TSC is not.
- The dedicated `PHI in scope` field extends those Privacy warnings and now drives HIPAA-oriented preview and generated-document language.
- The dedicated `CDE in scope` field drives confidentiality-oriented warnings and now drives PCI segmentation preview and generated-document language.

### Improvement opportunities
- Auto-suggest `dataShared` defaults by vendor role, for example IdP -> identities/MFA metadata.
- Add a small “system dependencies snapshot” card that summarizes vendors by role before the user leaves this step.

## 2. Governance, People & Training

### Inputs
- `company.complianceMaturity`
- `governance.hasBoardOrAdvisory`
- `governance.hasDedicatedSecurityOfficer`
- `governance.hasOrgChart`
- `governance.hasInternalAuditProgram`
- `training.securityAwarenessTrainingTool`
- `training.hasPhishingSimulation`

### Branches
- First-time compliance banner appears only for first-time organizations.
- Board meeting frequency appears only when the `governance-board-frequency` matrix rule is active.
- Security officer title appears only when the `governance-security-officer-title` matrix rule is active.
- Org chart maintenance appears only when the `governance-org-chart-maintenance` matrix rule is active.
- Internal audit frequency appears only when the `governance-internal-audit-frequency` matrix rule is active.
- Phishing simulation frequency appears only when phishing simulation is enabled.
- Training tool recommendations react to sub-service organizations captured earlier.
- Negative governance answers can now trigger matrix-driven warnings and deep dives for oversight, security ownership, and control monitoring.

### Downstream effects
- Governance answers shape generated governance policy language and evidence guidance.
- Training tool selection and phishing controls influence training-related documentation output.

### Improvement opportunities
- Turn first-time guidance into a structured assisted path instead of passive copy.

## 3. Compliance Scope

### Inputs
- `tscSelections.*`

### Downstream effects
- Selected TSCs change template count and generated document set.
- Review and Generate reflect the selected scope.
- Privacy contradiction warnings now appear immediately on this step when customer PII or PHI is selected but Privacy is still out of scope.
- Confidentiality warnings now appear when a cardholder data environment is in scope but Confidentiality remains out of scope.

### Improvement opportunities
- Add an impact preview that says “you just added X templates and Y evidence domains.”

## 4. Infrastructure Profiling

### Inputs
- `infrastructure.cloudProviders`
- `infrastructure.hostsOwnHardware`
- `infrastructure.idpProvider`

### Branches
- Multi-cloud selection changes which provider-specific expectations are shown.
- On-premises hardware changes physical security relevance.
- Provider-specific controls appear later in tooling and operations.
- Multi-cloud now triggers a matrix-driven warning about cross-cloud control consistency.
- Hybrid cloud + self-hosted infrastructure now triggers a matrix-driven warning about ownership boundaries.

### Downstream effects
- Cloud provider choices drive infrastructure language and evidence expectations.
- Identity provider choice later determines which MFA guidance panel appears in Operations.

### Improvement opportunities
- Add per-provider dependency cards, for example “Azure selected, expect Entra ID / Key Vault / Purview follow-up questions.”

## 5. Security Assessment

### Inputs
- Domain readiness values
- Nested booleans like centralized logging, config scanning, FIM, encryption in transit

### Branches
- Each domain has multiple nested follow-up questions that appear only if a control exists.
- Scoring and recommendations update based on affirmative coverage.

### Downstream effects
- Review step shows score, gaps, and remediation guidance.
- First-timer messaging shifts the tone of some advice.

### Improvement opportunities
- Add domain-level “why are we asking this?” intros tied to evidence requests.
- Add a deep-dive path when readiness is `not-started`, for example “show me a minimal starter implementation.”

## 6. Security Tooling

### Inputs
- Tool names and booleans like MDM, DAST, autoscaling

### Branches
- MDM tool field appears only if MDM is enabled.
- Other toggles currently influence content more than navigation.

### Improvement opportunities
- Add “tool maturity” follow-ups when a tool is present but no review cadence or ownership is captured.

## 7. Operations

### Inputs
- `operations.requiresMfa`
- `operations.requiresPeerReview`
- `operations.vcsProvider`
- `infrastructure.idpProvider`
- `infrastructure.cloudProviders`

### Branches
- MFA + Entra ID shows Entra-specific setup guidance.
- MFA + Okta shows Okta-specific setup guidance.
- Peer review + GitHub shows GitHub branch protection guidance.
- Peer review + Azure DevOps shows Azure DevOps branch policy guidance.
- AWS presence shows SCP guidance.

### Downstream effects
- These are some of the clearest cross-step execution chains in the current wizard.
- An Infrastructure answer changes which Operations remediation guidance appears.

### Improvement opportunities
- Add missing pairings for Google Workspace, GitLab, and other supported providers.
- Show a compact explanation banner like “This recommendation is showing because you selected AWS in Infrastructure and required peer review here.”

## 8. Review

### Inputs
- Entire form state

### Downstream effects
- Review aggregates completion, scores, and summary data.
- Review now includes a matrix-driven decision trace that lists active warnings, recommendations, guidance, and deep dives.

### Improvement opportunities
- Add answer-origin tracing for non-matrix behaviors too, such as vendor-to-role auto-fill in System Scope.

## 9. Generate

### Inputs
- Entire form state, especially TSCs, scope, infrastructure, subservices

### Branches
- Current hard stop separates blocking validation issues from non-blocking quality warnings.
- Template count changes with TSC selection.

### Improvement opportunities
- Example warnings:
  - no sub-service organizations entered
  - privacy-like data selected but Privacy TSC omitted
  - MFA required but no compatible IdP guidance path selected

## Highest-Value Deeper Dives To Add

1. Negative-answer deep dives
   - When an admin says `no` to a mature control, ask the next most useful operational question instead of just hiding the branch.
   - Example: no internal audit program -> ask whether they do ad hoc control reviews, founder review, or external consultant review.

2. Cross-step consequence banners
   - Show short explanations when one answer changes a later section.
   - This makes the wizard feel intentional instead of surprising.

3. Decision-trace panel
   - Expand the current Review trace to cover more answer-to-outcome events, including vendor auto-fill and future tool-specific branches.
   - This is still one of the best product improvements if you want the wizard to stay understandable as it grows.

4. Rule registry
   - Move execution rules into a typed config layer instead of scattering them through JSX.
   - Example shape: `when`, `show`, `suggest`, `warn`, `deepDive`.

5. QA matrix by branch
   - Test by answer-path clusters, not just by step.
   - Example clusters:
     - first-time + no board + no internal audit
     - Okta + MFA + GitHub + peer review
     - AWS + Azure + on-premises hybrid
     - privacy data + no Privacy TSC
   - PHI in scope + Privacy selected + HIPAA review preview
   - CDE in scope + Confidentiality selected + PCI segmentation preview

## Recommendation

The typed rule matrix is now the source of truth.

Use this document to explain the product behavior, use [lib/wizard/rule-matrix.ts](../lib/wizard/rule-matrix.ts) to implement and test it, and only add a visual flowchart if humans need a faster overview later.

The table is the source of truth. The flowchart is the picture.