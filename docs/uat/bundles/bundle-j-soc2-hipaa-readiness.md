# Bundle J — SOC 2 + HIPAA Readiness

## Purpose

Validate a combined `SOC 2 + HIPAA` readiness motion using the dedicated PHI field instead of relying on proxy data-type language.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- System profile: [../system-profiles.md](../system-profiles.md) using `SP-2 — Growing Azure-First SaaS`
- Compliance overlay: [../system-profiles.md](../system-profiles.md) using `Overlay O-1 — SOC 2 + HIPAA Readiness`

## Exact Run Sheet

### Welcome

- Compliance maturity: `Some experience`
- Target audit type: `SOC 2 Type I`

Verify:

- The audit type can be set explicitly to `SOC 2 Type I`.
- The explanation still reads like a design-focused first combined audit.

### System Scope

- Use a healthcare-regulated system description that explicitly mentions regulated patient or member information
- Data types: check `Customer PII`, `Employee data`, `Support tickets`, and `Authentication secrets`
- `Protected health information (PHI) is in scope`: checked
- `Cardholder data environment (CDE) is in scope`: unchecked
- Add sub-service organizations: `Azure`, `Entra ID`, `Azure DevOps`, `BambooHR`, and one healthcare-adjacent processor if available via `Other`

Verify:

- PHI is captured as a dedicated scope field instead of only via narrative text.
- The system description and vendor map support a healthcare-regulated story.

### TSC Selection

- `Security`: checked
- `Privacy`: checked
- `Confidentiality`: checked
- `Processing Integrity`: unchecked
- `Availability`: unchecked unless the specific scenario needs it

Verify:

- No privacy contradiction warning appears.
- No PHI-related warning appears once Privacy is selected.

### Infrastructure And Operations

- Keep the Azure-first provider baseline from SP-2
- MFA required: checked
- Peer review required: checked

Verify:

- Entra MFA guidance appears.
- Azure DevOps peer-review guidance appears.

### Review And Generate

Verify:

- Review shows `PHI in scope: Yes` and `CDE in scope: No`.
- Review shows the HIPAA administrative safeguards preview callout.
- Review preserves the healthcare-regulated system description.
- Generated drafts preserve healthcare-sensitive language in the system description and do not flatten the run back into generic customer-PII language.
- Generated privacy-related drafts include an explicit `HIPAA Administrative Safeguards` section.