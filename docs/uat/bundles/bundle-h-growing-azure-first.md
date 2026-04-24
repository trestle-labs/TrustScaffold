# Bundle H — Growing Company, Azure-First Provider Path

## Purpose

Validate a partially mature organization on the cleanest single-cloud Azure-first path without mixing in multi-cloud or hybrid complexity.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- System profile: [../system-profiles.md](../system-profiles.md) using `SP-2 — Growing Azure-First SaaS`

## Exact Run Sheet

### Welcome

- Org/company relationship: `The org governs another company`
- Compliance maturity: `Some experience`
- Target audit type: keep the recommended value unless the UI requires a manual change

Verify:

- The growing-organization tone appears instead of first-time guidance.
- The governed-company path unlocks correctly.

### System Scope

- Use the SP-2 Azure-first description seed
- Data types: check `Customer PII`, `Authentication secrets`, and `Product telemetry`
- `Protected health information (PHI) is in scope`: unchecked
- `Cardholder data environment (CDE) is in scope`: unchecked
- Add sub-service organizations: `Azure`, `Entra ID`, `Azure DevOps`, `BambooHR`

Verify:

- Vendor role auto-fill works for the baseline providers.
- PHI and CDE fields are visible as first-class scope fields.

### Governance

- Board/advisory exists: checked
- Dedicated security officer exists: choose a realistic answer
- Internal audit program exists: unchecked
- Policy acknowledgement cadence: `At hire + annual renewal`
- Training cadence: `Onboarding + annual renewal`

Verify:

- Growing-company guidance appears.
- Only the relevant follow-up fields show.

### TSC Selection

- `Security`: checked
- `Privacy`: checked
- `Confidentiality`: unchecked
- `Processing Integrity`: unchecked
- `Availability`: unchecked

Verify:

- No privacy contradiction warning appears.

### Infrastructure

- `AWS`: unchecked
- `Azure`: checked
- `GCP`: unchecked
- `We host our own hardware`: unchecked
- Identity provider: `Entra ID`

Verify:

- No multi-cloud warning.
- No hybrid warning.
- Azure-specific controls appear.
- AWS, GCP, and physical-hosting controls stay hidden.

### Operations

- VCS provider: `Azure DevOps`
- HRIS provider: `BambooHR`
- MFA required: checked
- Peer review required: checked

Verify:

- Entra MFA guidance appears.
- Azure DevOps peer-review guidance appears.
- MFA and change-review gap deep dives stay hidden.

### Review And Generate

Verify:

- Review shows Azure-only infrastructure, Entra ID, Azure DevOps, and BambooHR.
- Review shows `PHI in scope: No` and `CDE in scope: No`.
- Generated drafts preserve a single-cloud Azure story without hybrid or payment language.