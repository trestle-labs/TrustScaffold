# Bundle A — First Audit, Simple SaaS

## Purpose

Validate the lowest-friction supported path: first-time organization plus single-cloud SaaS.

## Source Profiles

- Organization level: [../level-1-first-time-organization.md](../level-1-first-time-organization.md)
- Environment: [../environments/single-cloud-saas.md](../environments/single-cloud-saas.md)

## Exact Run Sheet

### Dashboard

- Sign up with a fresh admin account.
- Confirm landing route is `/dashboard`.
- Confirm quick actions for wizard, team, generated docs, and settings are visible.

### Welcome

- Org/company relationship: `The org is the company`
- Org age: `Less than 1 year old`
- Compliance maturity: `First time`
- Target audit type: keep the recommendation unless the UI requires a manual selection

Verify:

- First-time tone is visible.
- Required fields block Next when blank.

### System Scope

- Data types: check `Customer PII` and `Authentication secrets`
- Deployment model: choose one intentionally
- Add sub-service organizations: `Okta`, `GitHub`, `Rippling`

Verify:

- Vendor role auto-fill works.
- Manual override clears the auto-fill hint.

### Governance

- Board/advisory exists: unchecked
- Dedicated security officer exists: unchecked
- Org chart exists: unchecked
- Internal audit program exists: unchecked
- Policy acknowledgement cadence: `At hire + annual renewal`

Verify:

- First-time guidance appears.
- Deep dives appear for no board, no security officer, and no internal audit.
- Board frequency, security officer title, org chart maintenance, and internal audit frequency stay hidden.

### TSC Selection

- `Security`: checked
- `Availability`: unchecked
- `Confidentiality`: unchecked
- `Processing Integrity`: unchecked
- `Privacy`: unchecked

Verify:

- Privacy contradiction warning appears because `Customer PII` is selected.

### Infrastructure

- `AWS`: checked
- `Azure`: unchecked
- `GCP`: unchecked
- `We host our own hardware (on-premises / colocation)`: unchecked
- Identity provider: `Okta`

Verify:

- No multi-cloud warning.
- No hybrid warning.
- AWS-specific controls appear.
- Azure, GCP, and physical-hosting controls stay hidden.

### Operations

- VCS provider: `GitHub`
- HRIS provider: `Rippling`
- MFA required: checked
- Peer review required: checked

Verify:

- Okta MFA guidance appears.
- GitHub peer-review guidance appears.
- MFA and change-review gap deep dives stay hidden.

### Review And Generate

Verify:

- Review shows first-time maturity, AWS-only environment, and unresolved privacy contradiction.
- Generate remains blocked until required issues are resolved.
- After resolution, generated drafts contain no unresolved `{{` tokens.
