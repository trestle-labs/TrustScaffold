# Bundle F — Established Program, Mature Hybrid (NebulaCloud Trust Platform)

## Purpose

Validate the highest-complexity supported path using the NebulaCloud Trust Platform scenario:

- Established compliance program
- Hybrid infrastructure (multi-cloud + self-hosted)
- Public-facing website in scope
- Privacy obligations aligned to GDPR and CCPA signals
- Online services and payment flow assumptions aligned to PCI-DSS readiness

## Source Profiles

- Organization level: [../level-3-established-program.md](../level-3-established-program.md)
- Environment: [../environments/hybrid-cloud-self-hosted.md](../environments/hybrid-cloud-self-hosted.md)

## Exact Run Sheet

### Governance

- Use the fully mature governance path with all conditional fields filled.

### Welcome (NebulaCloud Definition)

- Company/system name context: `NebulaCloud Trust Platform`
- Business model: `Hybrid services + software`
- Delivery model: `SaaS application` (or `Managed services` if the run is service-heavy)
- `Company has a public website in scope`: checked
- Website URL: provide a real-looking production URL
- Website privacy signals:
	- `Collects personal data`: checked
	- `Uses cookies / analytics`: checked
	- `Targets EU/UK residents`: checked
	- `Targets California residents`: checked
	- `Has privacy notice`: checked when testing mature/credible posture
	- `Has cookie banner`: checked when testing mature/credible posture

Expected result:

- Welcome reflects website-enabled scope and does not suppress website/privacy prompts.
- Review should no longer show `No public website in scope` assumptions.

### TSC Selection

- `Security`: checked
- `Availability`: checked
- `Confidentiality`: checked
- `Processing Integrity`: checked
- `Privacy`: checked

Expected result:

- Criteria scope reflects a mature SaaS/services platform with uptime, confidentiality, processing, and privacy obligations.

### Infrastructure Base Pass

- `AWS`: checked
- `Azure`: checked
- `We host our own hardware`: checked

Verify:

- Multi-cloud warning appears.
- Hybrid warning appears.
- Hybrid control prompts appear.

### System Scope (PCI + Privacy Expectations)

- Ensure data profile includes payment and identity-relevant data where applicable.
- `Cardholder data environment (CDE) is in scope`: checked for the NebulaCloud payment-enabled path.
- Keep system description explicit about online services and payment-supporting boundaries.

Expected result:

- Review shows the PCI segmentation preview.
- Generated outputs preserve PCI segmentation responsibilities language.

### Security Tooling / Operations

- Use mature tooling and operational controls consistent with enterprise readiness.
- Confirm evidence-bearing controls are enabled (MFA, change review, scanning/monitoring depth).

Expected result:

- Stage checkpoint cards stay aligned with software/service delivery reality.
- Review should remain validation-clean for this mature profile.

### Review And Generate

Verify:

- Review shows both cloud providers and self-hosted hardware.
- Decision trace includes both environment warnings.
- Review captures public-website and privacy signals (EU/UK + California targeting).
- Generated documents preserve the mature hybrid story plus privacy and PCI-ready language.
