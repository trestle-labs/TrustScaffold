# Bundle K — SOC 2 + PCI-DSS Readiness

## Purpose

Validate a combined `SOC 2 + PCI-DSS` readiness motion using the dedicated cardholder data environment field instead of relying on payment-data proxy language alone.

## Source Profiles

- Organization level: [../level-2-growing-organization.md](../level-2-growing-organization.md)
- System profile: [../system-profiles.md](../system-profiles.md) using `SP-3 — Growing GCP-First SaaS`
- Compliance overlay: [../system-profiles.md](../system-profiles.md) using `Overlay O-2 — SOC 2 + PCI-DSS Readiness`

## Exact Run Sheet

### Welcome

- Compliance maturity: `Some experience`
- Target audit type: `SOC 2 Type I`

Verify:

- The audit type can be set explicitly to `SOC 2 Type I`.

### System Scope

- Use a system description that explicitly states whether raw card data is stored, tokenized, or fully outsourced
- Data types: check `Payment data`, `Customer PII`, and `Authentication secrets`
- `Protected health information (PHI) is in scope`: unchecked
- `Cardholder data environment (CDE) is in scope`: checked
- Add sub-service organizations: `GCP`, `Google Workspace`, `GitLab`, `Gusto`, and the payment processor through a known vendor or `Other`

Verify:

- CDE is captured as a dedicated scope field instead of only via `Payment data`.
- The system description clearly states the payment boundary.

### TSC Selection

- `Security`: checked
- `Confidentiality`: checked
- `Privacy`: checked if billing identities are tied to individuals
- `Processing Integrity`: unchecked unless the scenario intentionally tests transaction-integrity scope
- `Availability`: unchecked unless the scenario intentionally tests SLA-driven scope

Verify:

- No CDE contradiction warning appears once Confidentiality is selected.

### Infrastructure And Operations

- Keep the GCP-first provider baseline from SP-3
- MFA required: checked
- Peer review required: checked

Verify:

- GCP controls appear.
- No Entra, Okta, GitHub, or Azure DevOps helper panel is required for the scenario to complete.

### Review And Generate

Verify:

- Review shows `PHI in scope: No` and `CDE in scope: Yes`.
- Review shows the PCI segmentation preview callout.
- Review preserves the payment-boundary language from the system description.
- Generated drafts preserve the payment-environment story and do not flatten the run back into generic `Payment data` language only.
- Generated system-description drafts include an explicit `PCI Segmentation Responsibilities` section.