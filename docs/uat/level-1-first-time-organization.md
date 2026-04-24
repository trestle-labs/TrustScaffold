# Level 1 UAT — First-Time Organization

## Goal

Validate that the wizard supports a first-time compliance team without assuming mature governance, audit, or tooling already exists.

## Representative Tester

- Founder
- Solo admin
- First compliance owner

## Test Profile

- Org age: `< 1 year`
- Compliance maturity: `First time`
- Relationship path: run once as `The org is the company`
- Governance posture: no board, no designated security officer, no internal audit program
- Infrastructure posture: single cloud provider and a few recognizable vendors

## Default System Profile

Use [SP-1 — First Audit, AWS-Only SaaS](./system-profiles.md) as the default provider bundle for this script.

That profile gives this level an exact, low-friction path:

- Cloud provider: `AWS`
- Identity provider: `Okta`
- VCS provider: `GitHub`
- HRIS provider: `Rippling`
- Vendor assurance cadence: `Annual review` for each major vendor
- Vendor assurance report: `SOC 2 Type II`
- Vendor control treatment: `Carve-out — controls excluded, covered by vendor report`

If you need another single-cloud provider or a different IdP, VCS, or HRIS, keep the Level 1 maturity answers the same and swap only the provider rows using the catalog in [System Profile Library](./system-profiles.md).

## Exact Answer Rules

Use the wizard's exact option labels where shown below. If a field is listed under `Leave blank / unchecked`, do not fill it unless the UI makes it appear as a required follow-up.

### Must choose

- Org age: `Less than 1 year old`
- Compliance maturity: `First time`
- TSC scope: `Security` only
- Cloud provider: `AWS`
- Identity provider: `Okta`
- VCS provider: `GitHub`
- HRIS provider: `Rippling`

### Leave blank / unchecked unless the wizard explicitly requires a follow-up

- `Privacy`, `Availability`, `Confidentiality`, and `Processing Integrity`
- `We host our own hardware (on-premises / colocation)`
- Azure and GCP cloud providers
- Board meeting frequency
- Security officer title
- Org chart maintenance method
- Internal audit frequency

## Stage-by-Stage Script

### Stage 0 — Dashboard Entry

1. Sign up with a fresh email.
2. Confirm you land on `/dashboard`.
3. Confirm the dashboard shows quick actions for the wizard, team, generated docs, and settings.
4. Confirm the theme toggle is visible.

Expected outcome:

- New admins land on the dashboard first, not directly in the wizard.
- The dashboard makes it obvious how to start the wizard.

### Stage 1 — Welcome & Onboarding

Enter:

- Org/company relationship: `The org is the company`
- Company name: use the workspace org name that was created at signup
- Website: a valid company URL
- Primary contact name: a real person name
- Primary contact email: a valid email
- Industry: any valid industry value
- Org age: `Less than 1 year old`
- Compliance maturity: `First time`
- Target audit type: leave on recommended value if the wizard suggests one

Expected outcome:

- Required fields must block Next when blank.
- The org/company relationship should be explicit and understandable.
- The first-time selection should steer the tone toward "getting started" guidance.
- If audit type is initially unsure, the recommendation should feel reasonable for a first audit cycle.

### Stage 2 — System Scope

Enter:

- System name: a concrete product/system name
- Description: use the SP-1 description seed or another provider-aligned description from [System Profile Library](./system-profiles.md)
- Data types: include at least one customer-sensitive data type
- Deployment model: either single-tenant or multi-tenant, but choose one intentionally
- Add sub-service organizations:
  - `AWS`
  - `Okta`
  - `GitHub`
  - `Rippling`

For the SP-1 baseline, use these vendor details:

| Vendor | Role | Description | Data shared | Review cadence | Assurance report | Control treatment |
| --- | --- | --- | --- | --- | --- | --- |
| AWS | Cloud Hosting | Primary cloud hosting platform for production workloads, storage, backups, and infrastructure logs. | Customer application data, backups, infrastructure metadata, security logs | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Okta | Identity Provider | Workforce SSO and MFA provider for employee access to in-scope systems. | Employee identities, group memberships, authentication events | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| GitHub | Version Control / Source Code Hosting | Source control and pull-request workflow for application and infrastructure code. | Source code, pull requests, CI metadata, user identities | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |
| Rippling | HRIS | System of record for employee lifecycle events that drive onboarding and offboarding. | Employee roster data, role changes, termination events | Annual review | SOC 2 Type II | Carve-out — controls excluded, covered by vendor report |

For each vendor:

1. Pick the vendor from the grouped list.
2. Observe whether the role auto-fills.
3. Confirm the auto-fill hint appears.
4. Override one role manually and confirm the hint clears.

Expected outcome:

- Validation must enforce the minimum description and required data-type selection.
- Vendor grouping should help a first-time user choose recognizable vendors quickly.
- Obvious vendors should auto-fill sensible roles.
- The step should feel guided rather than technical or opaque.

### Stage 3 — Governance

Answer:

- Board/advisory exists: `No`
- Dedicated security officer exists: `No`
- Org chart exists: `No`
- Internal audit program exists: `No`
- Policy acknowledgement cadence: `At hire + annual renewal`
- Security awareness training cadence: `Onboarding + annual renewal` or `Not yet — no formal training program exists`

Then complete any follow-up deep dives that appear.

Leave blank / hidden at this stage:

- Board meeting frequency
- Security officer title
- Org chart maintenance method
- Internal audit frequency

Expected outcome:

- First-time compliance guidance should appear.
- Negative governance answers should trigger required follow-up questions.
- The wizard should explain what the questions mean instead of assuming governance literacy.
- The user should be blocked only by clearly explained required follow-ups, not hidden conditions.

### Stage 4 — TSC Selection

Answer:

- Select `Security`
- Leave optional categories unchecked unless the flow explicitly suggests otherwise

Expected outcome:

- The wizard should not pressure a first-time organization into an unrealistically broad scope.
- Any warning should explain the tradeoff in plain language.

Explicitly leave unchecked:

- `Availability`
- `Confidentiality`
- `Processing Integrity`
- `Privacy`

### Stage 5 — Infrastructure

Answer:

- Select one cloud provider, such as `AWS`, and keep it aligned to the system profile you chose
- Do not enable self-hosted hardware
- Select a valid IdP, such as `Okta`

Explicitly leave unchecked:

- `Azure`
- `GCP`
- `We host our own hardware (on-premises / colocation)`

Expected outcome:

- No multi-cloud or hybrid warning should appear for this simple deployment.
- The stage should remain straightforward and not inject advanced complexity unnecessarily.

### Stage 6 — Security Assessment

Answer a realistic first-time mix:

- Mark some controls as missing or in progress
- Do not mark everything complete

Expected outcome:

- The wizard should tolerate an immature starting point.
- Guidance should read like remediation coaching, not failure messaging.

### Stage 7 — Security Tooling

Enter a lightweight tool stack:

- SIEM / monitoring: basic or cloud-native tool
- Endpoint protection: a minimal but plausible tool
- Vulnerability scanning: a simple starter tool if available

Expected outcome:

- A first-time tester should feel the product accepts a lightweight stack.
- Recommendations should help the user strengthen the stack rather than imply the wizard is only for enterprise teams.

### Stage 8 — Operations

Answer:

- VCS provider: `GitHub`
- HRIS provider: `Rippling`
- MFA required: `Yes`
- Peer review required: `Yes`
- Onboarding SLA: a realistic value such as `2`
- Offboarding SLA: a realistic value such as `24`

If you swapped providers using [System Profile Library](./system-profiles.md), keep Operations aligned to the same provider family you used in `System Scope`.

Leave blank because the branch should not appear:

- MFA gap deep dive
- Change review approach deep dive

Expected outcome:

- Provider-specific helper content should appear when appropriate.
- The stage should feel like practical operating-detail capture, not audit theater.

### Stage 9 — Review

1. Read the summary carefully.
2. Confirm the company relationship, maturity, vendors, and selected scope are shown correctly.
3. Read the decision trace.

Expected outcome:

- Review should explain why warnings, recommendations, and deep dives appeared.
- The summary should still feel achievable for a first-time organization.
- Navigation back to prior steps should be obvious if something must be corrected.

### Stage 10 — Generate

1. Generate drafts.
2. Confirm the redirect to `/generated-docs`.
3. Spot-check at least four drafts.

Expected outcome:

- Generate must succeed once required follow-ups are complete.
- The drafts should feel like believable starter documents for a first audit cycle.
- No unresolved `{{` template tokens should remain.

## Optional Admin Validation

1. Go to `/settings`.
2. Confirm the wizard autosave setting is visible.
3. Confirm saved GitHub or Azure DevOps integration targets remain visible if configured.
4. Return to `/wizard`, make a small change, reload, and verify persistence behavior.

Expected outcome:

- A first-time admin should still be able to understand the admin settings area.
- Draft persistence should feel dependable.

## Pass Criteria

- The tester understands why the wizard asked each major follow-up question.
- The tester never feels blocked by unexplained compliance terminology.
- The flow feels supportive and actionable for a team starting from low maturity.
- The generated drafts feel like credible starting documents, not placeholders.