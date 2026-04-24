# Environment UAT — Single-Cloud SaaS

## Goal

Validate the simplest supported infrastructure path: one cloud provider, no self-hosted hardware, and no hybrid warning.

## Exact Infrastructure Answers

- Cloud providers:
  - `AWS`: checked
  - `Azure`: unchecked
  - `GCP`: unchecked
- `We host our own hardware (on-premises / colocation)`: unchecked
- Identity provider: choose one exact option such as `Okta` or `Entra ID`

## Recommended Data Profile

Use a simple SaaS profile:

- `Customer PII`: checked
- `Authentication secrets`: checked
- `Support tickets`: optional
- `Employee data`, `Payment data`, and `Product telemetry`: only if you intend to test them specifically

## Stage-Specific Expectations

### System Scope

- The selected data types should be visible in Review.
- If `Customer PII` is selected and `Privacy` remains unchecked later, the privacy contradiction should appear.

### TSC Selection

- If you want the simplest path, select `Security` only.
- If `Customer PII` was selected and `Privacy` remains unchecked, verify the warning appears.

### Infrastructure

- No multi-cloud warning should appear.
- No hybrid ownership-boundary warning should appear.
- Only AWS-specific controls should render if `AWS` is the selected provider.
- Azure-specific and GCP-specific control sections must remain hidden.
- Physical hosting controls must remain hidden because self-hosted hardware is unchecked.

### Review

- Review should list only the selected cloud provider.
- Review must not imply hybrid or self-hosted infrastructure.

### Generate

- Generated documents should read like a cloud-only SaaS environment.
- Hybrid/self-hosted language must not appear.

## Pass Criteria

- The infrastructure path remains simple and cloud-only.
- No advanced environment warnings appear unless the tester intentionally introduces a contradiction elsewhere.
- Generated outputs stay consistent with a single-cloud SaaS story.
