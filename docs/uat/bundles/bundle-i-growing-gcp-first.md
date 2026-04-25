# Bundle I — Growing Company, GCP-First Provider Path

## Purpose

Validate a partially mature organization on the cleanest single-cloud GCP-first path and confirm the product behaves correctly when provider-specific helper panels do not exist for every selected tool.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- System profile: [../system-profiles.md](../system-profiles.md) using `SP-3 — Growing GCP-First SaaS`

## Exact Run Sheet

### Welcome

- Org/company relationship: `The org governs another company`
- Compliance maturity: `Some experience`
- Target audit type: keep the recommended value unless the UI requires a manual change

Verify:

- The growing-organization tone appears.
- The governed-company branch behaves correctly.

### System Scope

- Use the SP-3 GCP-first description seed
- Data types: check `Customer PII`, `Authentication secrets`, and `Support tickets`
- `Protected health information (PHI) is in scope`: unchecked
- `Cardholder data environment (CDE) is in scope`: unchecked

Verify:

- PHI and CDE fields are visible as first-class scope fields.

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
- `Azure`: unchecked
- `GCP`: checked
- `We host our own hardware`: unchecked
- Identity provider: `Google Workspace`
- VCS provider: `GitLab`
- HRIS provider: `Gusto`
- Add sub-service organizations: `GCP`, `Google Workspace`, `GitLab`, `Gusto`

Verify:

- Vendor role auto-fill works for the baseline providers.
- No multi-cloud warning.
- No hybrid warning.
- GCP-specific controls appear.
- AWS, Azure, and physical-hosting controls stay hidden.

### Operations

- MFA required: checked
- Peer review required: checked

Verify:

- No Entra or Okta MFA helper panel appears.
- No GitHub or Azure DevOps peer-review helper panel appears.
- The absence of those helper panels does not block progress.

### Review And Generate

Verify:

- Review shows GCP-only infrastructure, Google Workspace, GitLab, and Gusto.
- Review shows `PHI in scope: No` and `CDE in scope: No`.
- Generated drafts preserve a single-cloud GCP story without Azure, AWS, or payment-specific language.