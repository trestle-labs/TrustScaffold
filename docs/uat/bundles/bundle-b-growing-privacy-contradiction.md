# Bundle B — Growing Company, Privacy Contradiction

## Purpose

Validate a growing organization path where the data profile implies privacy scope but `Privacy` remains unchecked.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- Environment: [../environments/single-cloud-saas.md](../environments/single-cloud-saas.md)

## Exact Run Sheet

### Welcome

- Org/company relationship: `The org governs another company`
- Org age: `1–3 years old` or `3–10 years old`
- Compliance maturity: `Some experience`

### System Scope

- Check `Customer PII`
- Check at least one additional realistic data type
- Add vendors: `Microsoft`, `Google Workspace`, `Datadog`, `GitHub`

### Governance

- Board/advisory exists: checked
- Internal audit program exists: unchecked
- Org chart exists: checked
- Acknowledgement cadence: `At hire + annual renewal`

### TSC Selection

- `Security`: checked
- `Privacy`: unchecked

Verify:

- Privacy contradiction warning appears here.

### Infrastructure

- `AWS`: checked
- `Azure`: unchecked
- `GCP`: unchecked
- `We host our own hardware`: unchecked

Verify:

- No multi-cloud warning.
- No hybrid warning.

### Review And Generate

Verify:

- Review repeats the unresolved privacy contradiction.
- Generate warns before draft generation.
- The contradiction is easy to understand and act on.
