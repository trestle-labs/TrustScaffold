# Level 2 UAT — Growing Organization

## Goal

Validate that the wizard recognizes partial maturity, surfaces contradictions cleanly, and helps a growing organization tighten its operating model without reverting to first-time-only guidance.

## Representative Tester

- Operations lead
- IT manager
- Security generalist

## Test Profile

- Org age: `1–3 years` or `3–10 years`
- Compliance maturity: `Some experience`
- Relationship path: run at least one pass as `The org governs another company`
- Governance posture: some formal ownership exists, but cadences and coverage are inconsistent
- Infrastructure posture: multiple vendors, customer-sensitive data, and possible scope contradictions

## Exact Answer Rules

This script intentionally exercises contradiction and advanced infrastructure branches. Use the exact labels below so the expected warnings line up with the current rule matrix.

### Must choose

- Compliance maturity: `Some experience`
- Data type: `Customer PII`
- TSC scope: `Security` only on the first pass
- Cloud providers: `AWS` and `Azure`
- `We host our own hardware (on-premises / colocation)`: checked

### Must leave unchecked on the first pass

- `Privacy`
- `GCP`

### Conditional blank fields

- If `Dedicated security officer exists` is `No`, leave `Security officer title` blank and complete the deep dive instead.
- If `Internal audit program exists` is `No`, leave `Internal audit frequency` blank and complete the deep dive instead.

## Stage-by-Stage Script

### Stage 0 — Dashboard Entry

1. Sign up or sign in as a fresh admin for this scenario.
2. Confirm dashboard-first landing.
3. Confirm the wizard is launched from the dashboard rather than forced on first load.

Expected outcome:

- The app should still orient a growing organization from the dashboard.
- The dashboard shell should feel like an admin workspace, not a single-use intake form.

### Stage 1 — Welcome & Onboarding

Enter:

- Org/company relationship: `The org governs another company`
- Governed company name: a different company name than the workspace org
- Valid website, contact name, contact email, and industry
- Org age: choose either `1–3 years old` or `3–10 years old`
- Compliance maturity: `Some experience`
- Target audit type: choose the recommended value only if it still feels plausible

Expected outcome:

- The company field should unlock correctly for the governing-company path.
- The wizard should stop using first-time tone.
- The page should feel calibrated to an organization that has some structure already.

### Stage 2 — System Scope

Enter:

- A realistic production system name and description
- Data types including `Customer PII`
- Add several sub-service organizations such as:
  - `Microsoft`
  - `Google Workspace`
  - `Datadog`
  - `GitHub`
- Use one `Other` vendor and one `Other` role path to verify manual fallback behavior

Expected outcome:

- The grouped vendor experience should still work for a more complex vendor set.
- Vendor-aware recommendations later in the flow should have enough data to trigger.
- The stage should support a real dependency map without becoming cumbersome.

### Stage 3 — Governance

Answer with partial maturity:

- Board/advisory exists: `Yes`
- Board meeting frequency: select a real cadence
- Dedicated security officer exists: `Yes` or `No`, but pick one that forces a realistic branch
- Internal audit program exists: `No`
- Org chart exists: `Yes`
- Org chart maintenance method: choose a visible option such as `Manually updated quarterly`
- Policy acknowledgement cadence: `At hire + annual renewal`
- Security awareness training cadence: `Onboarding + annual renewal`

If you choose `Dedicated security officer exists: No`:

- Leave `Security officer title` blank
- Complete the `Current security program owner` deep dive

If you choose `Dedicated security officer exists: Yes`:

- Fill `Security officer title`
- Confirm the no-officer deep dive does not appear

Expected outcome:

- Governance should behave like targeted gap analysis.
- Only the relevant follow-up fields should appear.
- The product should not regress into first-time-only coaching language.

### Stage 4 — TSC Selection

Answer:

- Select `Security`
- Leave `Privacy` unchecked even though `Customer PII` was selected earlier

Explicitly leave unchecked on this pass:

- `Privacy`
- Any additional TSCs you are not intentionally testing

Expected outcome:

- The wizard should surface a privacy contradiction warning.
- The warning should be understandable and actionable.

### Stage 5 — Infrastructure

Answer:

- Select at least two cloud providers, such as `AWS` and `Azure`
- Enable `We host our own hardware`
- Select a real IdP such as `Entra ID`

This stage should be treated as two exact checks in one pass:

1. Multi-cloud check:
  - `AWS`: checked
  - `Azure`: checked
  - `GCP`: unchecked
2. Hybrid check:
  - `We host our own hardware (on-premises / colocation)`: checked

Expected outcome:

- The wizard should show a multi-cloud warning.
- The wizard should show a hybrid ownership-boundary warning.
- These warnings should feel like operational guidance, not generic scare text.

### Stage 6 — Security Assessment

Enter a mixed state:

- Mark several controls as established
- Leave some as in progress
- Leave a few missing

Expected outcome:

- The stage should capture partial maturity well.
- Recommendations should focus on missing structure and consistency, not basic starter advice.

### Stage 7 — Security Tooling

Enter a realistic operational stack:

- Monitoring or SIEM: `Datadog` or similar
- Endpoint protection: a real endpoint or EDR tool
- Vulnerability scanning: a real scanner

Expected outcome:

- The wizard should reflect an organization that has tools but may not have all the process maturity around them.
- Recommendations should feel specific enough to improve a partially mature stack.

### Stage 8 — Operations

Answer:

- VCS provider: `GitHub` or `Azure DevOps`
- HRIS provider: a real provider such as `Rippling` or `BambooHR`
- MFA required: `No`
- Peer review required: `No`

Then complete the resulting deep dives.

Exact branching expectations:

- If VCS provider is `GitHub`, no GitHub peer-review setup guide should render because peer review is `No`.
- If VCS provider is `Azure DevOps`, no Azure DevOps peer-review guide should render because peer review is `No`.
- Because MFA is `No`, the MFA gap deep dive must appear.
- Because peer review is `No`, the change-review deep dive must appear.

Expected outcome:

- The wizard should show provider-aware helper content where relevant.
- Negative operational answers should trigger specific warnings and required follow-ups.
- The step should not let the tester continue until those follow-ups are answered.

### Stage 9 — Review

1. Review the summary for governed-company context, customer PII, multi-cloud scope, and operational choices.
2. Review the decision trace carefully.
3. Use step navigation to jump back to any flagged item if needed.

Expected outcome:

- Review should connect cross-step issues clearly.
- The decision trace should help the tester understand why the contradictions appeared.
- Step navigation should return to the relevant part of the form without leaving the tester mid-page.

### Stage 10 — Generate

1. Generate drafts after all required corrections are complete.
2. Confirm redirect to `/generated-docs`.
3. Spot-check whether the generated drafts reflect the partially mature operating model.

Expected outcome:

- Generate should be blocked while contradictions or required issues remain unresolved.
- Once resolved, the drafts should retain the organization's more complex scope and operating model.

## Optional Admin Validation

1. Go to `/settings`.
2. Save a GitHub or Azure DevOps integration target.
3. Refresh the page.
4. Confirm the saved destination remains visible to an admin.
5. Change the wizard autosave cadence and confirm the wizard reflects the new interval.

Expected outcome:

- Admin configuration data must remain visible after save and reload.
- Autosave cadence should update consistently between Settings and the wizard.

## Pass Criteria

- The tester says the wizard feels aligned to a company that is formalizing controls but is not fully mature yet.
- Warnings and contradictions are specific enough to act on.
- The decision trace improves understanding of branching behavior.
- The generated drafts preserve the more complex organization profile.