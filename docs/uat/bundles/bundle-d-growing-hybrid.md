# Bundle D — Growing Company, Hybrid Boundary Risk

## Purpose

Validate the hybrid branch for a partially mature company.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- Environment: [../environments/hybrid-cloud-self-hosted.md](../environments/hybrid-cloud-self-hosted.md)

## Exact Run Sheet

### Infrastructure

- `AWS`: checked
- `Azure`: unchecked on the base pass
- `GCP`: unchecked
- `We host our own hardware (on-premises / colocation)`: checked

Check these hybrid controls:

- Controlled server room / cage: checked
- Physical hardware failover: checked
- Cloud VPN or private network access logs: checked

Verify:

- Hybrid warning appears.
- Multi-cloud warning does not appear on the base pass.

### Follow-Up Hybrid + Multi-Cloud Check

- Also check `Azure`

Verify:

- Hybrid warning remains.
- Multi-cloud warning now also appears.

### Review And Generate

Verify:

- Review shows cloud provider selection plus self-hosted hardware.
- Generated documents preserve hybrid language and ownership-boundary implications.
