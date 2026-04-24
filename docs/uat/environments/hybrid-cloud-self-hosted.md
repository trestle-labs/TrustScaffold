# Environment UAT — Hybrid Cloud + Self-Hosted

## Goal

Validate the hybrid branch where at least one cloud provider is selected and self-hosted hardware is also in scope.

## Exact Infrastructure Answers

Base hybrid pass:

- Cloud providers:
  - `AWS`: checked
  - `Azure`: unchecked
  - `GCP`: unchecked
- `We host our own hardware (on-premises / colocation)`: checked
- Identity provider: choose one exact option such as `Okta`

Expanded hybrid follow-up pass:

- Add `Azure` as a second checked provider to confirm hybrid and multi-cloud warnings can coexist.

## Required Hybrid Controls To Exercise

Because self-hosted hardware is checked, test these controls explicitly:

- `A controlled server room, cage, or colocation area is part of the in-scope environment.`
- `Documented physical hardware failover or spare capacity exists for critical workloads.`
- `Cloud VPN or private network access logs are required for administrative connectivity.`

## Stage-Specific Expectations

### Infrastructure

- The hybrid ownership-boundary warning must appear.
- If only one cloud provider is selected, the multi-cloud warning must not appear.
- If a second cloud provider is added, both the hybrid warning and multi-cloud warning must appear.
- Hybrid and self-hosted controls must appear when self-hosted hardware is checked.
- Physical hosting controls should appear only if the UI permits the self-hosted-only subset for the current selection state.

### Review

- Review should show the selected cloud providers.
- Review should indicate that self-hosted hardware is part of the in-scope environment.
- The decision trace should include the hybrid warning.
- If multiple cloud providers are selected on the follow-up pass, the decision trace should also include the multi-cloud warning.

### Generate

- Generated documents should include hybrid or self-hosted environment language.
- Physical and ownership-boundary implications should not disappear from the resulting document set.

## Pass Criteria

- The hybrid path clearly differs from the cloud-only paths.
- The hybrid warning appears only when self-hosted hardware and cloud providers are both present.
- Generated outputs preserve the hybrid environment story.
