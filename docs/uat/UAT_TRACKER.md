# UAT Tracker

This tracker is the top-level status board for the TrustScaffold UAT pack.

Use it to track which bundled scenarios have been executed, who ran them, when they were last run, and whether they passed.

## Status Legend

- `not-started` — scenario has not been run yet
- `in-progress` — scenario is currently being tested or results are incomplete
- `passed` — scenario completed and met expectations
- `partial` — scenario completed with meaningful deviations or open issues
- `failed` — scenario completed and exposed a blocking problem
- `gap` — scenario documents a known product limitation rather than a supported path

## Bundle Coverage

| Bundle | Scenario | Maturity profile | Environment profile | Status | Last run | Tester | Result template | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | First audit, simple SaaS | Level 1 — First-Time Organization | Single-Cloud SaaS | partial | 2026-04-25 | GitHub Copilot | [Bundle A result](./bundles/results/bundle-a-first-audit-simple-saas-result.md) | Generated 13 docs successfully; open UX/doc drift around same-as-company validation and vendor block placement |
| B | Growing company, privacy contradiction | Level 2 — Growing Organization | Single-Cloud SaaS | not-started | — | — | [Bundle B result](./bundles/results/bundle-b-growing-privacy-contradiction-result.md) | Exercises `Customer PII` without `Privacy` |
| C | Growing company, multi-cloud expansion | Level 2 — Growing Organization | Multi-Cloud SaaS | not-started | — | — | [Bundle C result](./bundles/results/bundle-c-growing-multi-cloud-result.md) | Cloud-only multi-provider path |
| D | Growing company, hybrid boundary risk | Level 2 — Growing Organization | Hybrid Cloud + Self-Hosted | not-started | — | — | [Bundle D result](./bundles/results/bundle-d-growing-hybrid-result.md) | Hybrid ownership-boundary path |
| E | Established program, advanced cloud scope | Level 3 — Established Program | Multi-Cloud SaaS | not-started | — | — | [Bundle E result](./bundles/results/bundle-e-established-multi-cloud-result.md) | Mature cloud-only path |
| F | Established program, mature hybrid | Level 3 — Established Program | Hybrid Cloud + Self-Hosted | not-started | — | — | [Bundle F result](./bundles/results/bundle-f-established-hybrid-result.md) | NebulaCloud in-depth scenario: website in scope + GDPR/CCPA signals + PCI/CDE readiness |
| G | Pure on-prem product gap check | Level 2 or Level 3 | Pure On-Prem / Self-Hosted Gap | gap | — | — | [Bundle G result](./bundles/results/bundle-g-on-prem-gap-result.md) | Documents current unsupported pure on-prem limitation |
| H | Growing company, Azure-first provider path | Level 2 — Growing Organization | Single-Cloud Azure-First | not-started | — | — | [Bundle H result](./bundles/results/bundle-h-growing-azure-first-result.md) | Clean provider-specific Microsoft-leaning path |
| I | Growing company, GCP-first provider path | Level 2 — Growing Organization | Single-Cloud GCP-First | not-started | — | — | [Bundle I result](./bundles/results/bundle-i-growing-gcp-first-result.md) | Clean provider-specific GCP path |
| J | SOC 2 + HIPAA readiness | Level 2 — Growing Organization | Azure-First + HIPAA overlay | not-started | — | — | [Bundle J result](./bundles/results/bundle-j-soc2-hipaa-readiness-result.md) | Exercises dedicated PHI field |
| K | SOC 2 + PCI-DSS readiness | Level 2 — Growing Organization | GCP-First + PCI overlay | not-started | — | — | [Bundle K result](./bundles/results/bundle-k-soc2-pci-dss-readiness-result.md) | Exercises dedicated CDE field |

## Provider Profile Coverage

Use this section to track whether each system-profile bundle has been exercised, even when multiple bundles share the same maturity tier.

| Profile | Cloud shape | IdP | VCS | HRIS | Overlay focus | Status | Last run | Tester | Covered by bundles | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SP-1 | AWS-only | Okta | GitHub | Rippling | Baseline first audit | partial | 2026-04-25 | GitHub Copilot | A | AWS/Okta/GitHub/Rippling generated 13 draft documents; open Level 1 wizard UX/doc drift recorded in Bundle A result |
| SP-2 | Azure-only | Entra ID | Azure DevOps | BambooHR | Growing Azure-first | not-started | — | — | H, J | Also used for HIPAA overlay coverage |
| SP-3 | GCP-only | Google Workspace | GitLab | Gusto | Growing GCP-first | not-started | — | — | I, K | Also used for PCI overlay coverage |
| SP-4 | AWS + Azure | Okta | GitHub | Workday | Established multi-cloud | not-started | — | — | E | Mature cloud-only provider path |
| SP-5 | AWS + Azure + self-hosted | Entra ID | Azure DevOps | Workday | Established hybrid | not-started | — | — | F | Mature hybrid provider path |
| SP-6 | Pure on-prem intent | Varies | Varies | Varies | Unsupported gap | gap | — | — | G | Unsupported completion path |

## Compliance Overlay Coverage

Use this section to track whether the combined-framework overlays are being exercised explicitly, not just implied through narrative text.

| Overlay | Dedicated scope field | Recommended bundle | Status | Last run | Tester | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| O-1 — SOC 2 + HIPAA Readiness | `PHI in scope` | J | not-started | — | — | Confirms regulated healthcare flow uses the dedicated PHI field |
| O-2 — SOC 2 + PCI-DSS Readiness | `CDE in scope` | K | not-started | — | — | Confirms payment-environment flow uses the dedicated CDE field |
| O-3 — SOC 2 + ISO 27001 Preparation | No dedicated extra field required | E or F | not-started | — | — | Focus on governance, risk, and internal review cadence |
| O-4 — SOC 2 + NIST CSF Alignment | No dedicated extra field required | C, E, or F | not-started | — | — | Focus on infrastructure and operational detail |

## Recommended Run Order

Run in this order if you want the fastest confidence ramp:

1. Bundle A — confirm the simplest supported path still works.
2. Bundle B — confirm privacy contradiction handling.
3. Bundle C — confirm multi-cloud behavior.
4. Bundle D — confirm hybrid behavior.
5. Bundle E — confirm mature cloud-only behavior.
6. Bundle F — confirm mature hybrid behavior.
7. Bundle G — confirm the on-prem limitation is still documented accurately.
8. Bundle H — confirm the Azure-first provider path.
9. Bundle I — confirm the GCP-first provider path.
10. Bundle J — confirm the dedicated PHI field behaves correctly.
11. Bundle K — confirm the dedicated CDE field behaves correctly.

## Execution Notes

- Update `Status`, `Last run`, `Tester`, and `Notes` after every run.
- Link or reference the completed result template in the notes if you save a filled-in copy elsewhere.
- If a scenario exposes a bug, record the issue reference in `Notes` and downgrade the status to `partial` or `failed`.
- Keep Bundle G as `gap` unless the product gains a true pure on-prem completion path.
