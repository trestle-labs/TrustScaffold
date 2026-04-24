# Bundle G — Pure On-Prem Product Gap Check

## Purpose

Confirm the current pure on-prem limitation is documented accurately and reproducibly.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md) or [../level-3-established-program.md](../level-3-established-program.md)
- Environment: [../environments/on-prem-self-hosted-gap.md](../environments/on-prem-self-hosted-gap.md)

## Exact Run Sheet

### Infrastructure

- Leave `AWS`, `Azure`, and `GCP` unchecked
- Check `We host our own hardware (on-premises / colocation)`

Verify:

- Self-hosted control sections may render.
- The form does not validate as a full supported completion path because a cloud provider is still required.

### Outcome

- Log this as a product-gap confirmation, not a failed supported-path UAT run.
