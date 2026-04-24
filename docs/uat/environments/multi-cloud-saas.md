# Environment UAT — Multi-Cloud SaaS

## Goal

Validate the multi-cloud branch where more than one cloud provider is selected but self-hosted hardware remains out of scope.

## Exact Infrastructure Answers

- Cloud providers:
  - `AWS`: checked
  - `Azure`: checked
  - `GCP`: unchecked on the base pass
- `We host our own hardware (on-premises / colocation)`: unchecked
- Identity provider: choose one exact option such as `Entra ID`

Optional follow-up pass:

- Check `GCP` as well to confirm the same multi-cloud warning still behaves correctly with three providers.

## Recommended Data Profile

Use a broader SaaS profile:

- `Customer PII`: checked
- `Authentication secrets`: checked
- `Product telemetry`: checked
- `Support tickets`: checked if you want to exercise that note path

## Stage-Specific Expectations

### System Scope

- The wider data profile should carry through to Review.
- Vendor-aware recommendations should still function independently of the environment profile.

### TSC Selection

- If `Customer PII` is selected and `Privacy` remains unchecked, verify the privacy contradiction warning.
- If `Privacy` is checked, verify the contradiction disappears and privacy coverage is reflected later.

### Infrastructure

- The multi-cloud warning must appear.
- The hybrid warning must not appear because self-hosted hardware is unchecked.
- AWS-specific controls should appear.
- Azure-specific controls should appear.
- GCP-specific controls should appear only if `GCP` is checked.
- Physical hosting controls must remain hidden.

### Review

- Review should list both selected cloud providers.
- Review must not show self-hosted hardware badges or language.
- The decision trace should include the multi-cloud warning when applicable.

### Generate

- Generated documents should preserve the multi-cloud footprint.
- Hybrid or physical-facility language must not appear unless self-hosted hardware was checked.

## Pass Criteria

- The environment is clearly represented as cloud-only but multi-provider.
- The multi-cloud coordination warning appears consistently and only for the expected condition.
- Generated outputs remain coherent with a multi-cloud SaaS architecture.
