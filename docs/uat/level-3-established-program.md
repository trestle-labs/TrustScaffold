# Level 3 UAT — Established Program

## Goal

Validate that the wizard remains efficient and credible for an organization with an established compliance program, without burying advanced scope or forcing beginner-only guidance.

## Representative Tester

- Security lead
- Compliance manager
- Audit owner

## Test Profile

- Org age: `3–10 years` or `10+ years`
- Compliance maturity: `Established program`
- Governance posture: board or advisory oversight, named security ownership, and documented cadences already exist
- Infrastructure posture: formal tooling, broader scope, and possible multi-cloud complexity

## Exact Answer Rules

This script should prove that a mature program can complete the wizard without beginner-only friction while still surfacing advanced infrastructure and scope warnings when selected.

### Must choose

- Org age: `More than 10 years old`
- Compliance maturity: `Established program`
- Board/advisory exists: `Yes`
- Dedicated security officer exists: `Yes`
- Org chart exists: `Yes`
- Internal audit program exists: `Yes`

### Must fill because the mature branches should appear

- Board meeting frequency
- Security officer title
- Org chart maintenance method
- Internal audit frequency

### Advanced infrastructure coverage

Run both of these within this UAT file:

1. Multi-cloud path:
  - Check `AWS` and `Azure`
  - Leave `We host our own hardware (on-premises / colocation)` unchecked
2. Hybrid path:
  - Keep at least one cloud provider checked
  - Check `We host our own hardware (on-premises / colocation)`

Expected branch behavior:

- Multi-cloud warning must appear when more than one cloud provider is selected.
- Hybrid warning must appear only when cloud providers are selected and `We host our own hardware` is checked.

## Stage-by-Stage Script

### Stage 0 — Dashboard Entry

1. Sign in as a fresh admin or dedicated UAT admin.
2. Confirm dashboard-first landing and quick-action visibility.
3. Confirm the layout feels like a persistent admin workspace.

Expected outcome:

- Mature users should still start from the dashboard and not be forced into the wizard immediately.

### Stage 1 — Welcome & Onboarding

Enter:

- Choose the correct org/company relationship for the scenario
- Valid company metadata
- Org age: `More than 10 years old`
- Compliance maturity: `Established program`
- Select the audit type that best fits a mature program

Expected outcome:

- The wizard should avoid first-time-specific language.
- The step should feel concise and respectful of an experienced user.

### Stage 2 — System Scope

Enter:

- A fully described production system
- Multiple relevant data types
- A richer sub-service map, such as:
  - `Okta`
  - `GitHub`
  - `Datadog`
  - `Zendesk`
  - `Rippling`

Expected outcome:

- The wizard should scale to a larger dependency set without becoming confusing.
- Vendor grouping and role handling should still be efficient.

### Stage 3 — Governance

Answer:

- Board/advisory exists: `Yes`
- Board meeting frequency: a real cadence
- Dedicated security officer exists: `Yes`
- Security officer title: provide a title
- Org chart exists: `Yes`
- Org chart maintenance cadence: provide a cadence
- Internal audit program exists: `Yes`
- Internal audit frequency: provide a cadence

Expected outcome:

- Conditional governance fields should appear only when relevant.
- The stage should feel like accurate profile capture for an established program, not remedial coaching.

### Stage 4 — TSC Selection

Answer:

- Select `Security`
- Add any additional applicable categories such as `Availability`, `Confidentiality`, or `Privacy`

Recommended exact mature pass:

- `Security`: checked
- `Availability`: checked
- `Confidentiality`: checked
- `Privacy`: checked if your chosen data profile includes personal data and you want the generated privacy template path covered

Expected outcome:

- The wizard should support broader scope cleanly.
- Review later should preserve the full selected scope without flattening it.

### Stage 5 — Infrastructure

Answer:

- First pass: choose `AWS` and `Azure` with `We host our own hardware` unchecked
- Second pass or follow-up check: keep one or more cloud providers selected and check `We host our own hardware`
- Select a mature IdP such as `Okta` or `Entra ID`

Expected outcome:

- The multi-cloud warning should appear in the first pass.
- The hybrid warning should appear in the second pass.
- Neither warning should read like beginner-only education.

### Stage 6 — Security Assessment

Enter a mostly mature profile:

- Mark most controls as established
- Leave only a few in progress if you want to test targeted gap messaging

Expected outcome:

- The stage should not drown an established program in beginner tips.
- Any remaining recommendations should be targeted and credible.

### Stage 7 — Security Tooling

Enter a mature stack:

- Monitoring / SIEM: enterprise or mature team tooling
- Endpoint protection: real EDR
- Vulnerability scanning: real scanner
- Logging or monitoring coverage should look coherent with the earlier infrastructure choices

Expected outcome:

- The wizard should preserve operational detail and not collapse into generic tooling copy.

### Stage 8 — Operations

Answer:

- VCS provider: `GitHub` or `Azure DevOps`
- HRIS provider: a real HRIS
- MFA required: `Yes`
- Peer review required: `Yes`
- Onboarding and offboarding SLAs: realistic controlled values
- Policy publication method: choose a real method

Leave blank because the mature positive branches should suppress them:

- MFA gap deep dive
- Change review approach deep dive

Expected outcome:

- Provider-aware operational guidance should render where relevant.
- A mature user should not hit unnecessary blocker questions when their answers already describe a mature operating model.

### Stage 9 — Review

1. Confirm the summary retains governance, scope, tooling, and operations detail.
2. Read the decision trace.
3. Verify advanced warnings remain visible when they should.

Expected outcome:

- Review should feel like a final control-plane summary.
- The decision trace should still be useful, but not noisy.
- The summary should retain important nuance from the earlier stages.

### Stage 10 — Generate

1. Generate drafts.
2. Confirm redirect to `/generated-docs`.
3. Inspect whether the drafts feel believable for an established program.

Expected outcome:

- Generate should produce a fuller, more credible draft set for a mature environment.
- The resulting content should retain scope, governance, and operational detail from the wizard answers.

## Optional Admin Validation

1. Save both GitHub and Azure DevOps destinations if the scenario uses both providers at different times.
2. Refresh Settings and confirm the saved destinations remain visible.
3. Confirm autosave settings still behave predictably for a mature admin workflow.

Expected outcome:

- Admin-level configuration remains visible and editable after save.
- The admin workflow feels stable enough for ongoing compliance operations.

## Pass Criteria

- The tester does not feel the wizard is designed only for first-time users.
- Advanced answers remain intact through Review and Generate.
- The guidance is concise, specific, and credible for a mature compliance owner.
- The resulting drafts feel suitable for real audit-prep refinement.