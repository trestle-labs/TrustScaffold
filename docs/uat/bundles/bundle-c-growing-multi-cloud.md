# Bundle C — Growing Company, Multi-Cloud Expansion

## Purpose

Validate a partially mature organization with a cloud-only multi-provider footprint.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- Environment: [../environments/multi-cloud-saas.md](../environments/multi-cloud-saas.md)

## Exact Run Sheet

### Welcome

- Compliance maturity: `Some experience`

### System Scope

- Check `Customer PII`
- Add several recognizable vendors

### TSC Selection

- `Security`: checked
- `Privacy`: unchecked on the first pass

### Infrastructure

- `AWS`: checked
- `Azure`: checked
- `GCP`: unchecked
- `We host our own hardware`: unchecked
- Identity provider: `Entra ID`

Verify:

- Multi-cloud warning appears.
- Hybrid warning does not appear.
- AWS and Azure control sections appear.
- Physical hosting controls stay hidden.

### Operations

- VCS provider: `GitHub` or `Azure DevOps`
- MFA required: unchecked
- Peer review required: unchecked

Verify:

- MFA gap deep dive appears.
- Change-review deep dive appears.

### Review And Generate

Verify:

- Review shows both cloud providers.
- Review shows the multi-cloud warning.
- Generated drafts preserve a multi-cloud story without hybrid language.
