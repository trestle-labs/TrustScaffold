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
| A | First audit, simple SaaS | Level 1 — First-Time Organization | Single-Cloud SaaS | not-started | — | — | [Bundle A result](./bundles/results/bundle-a-first-audit-simple-saas-result.md) | Lowest-friction supported path |
| B | Growing company, privacy contradiction | Level 2 — Growing Organization | Single-Cloud SaaS | not-started | — | — | [Bundle B result](./bundles/results/bundle-b-growing-privacy-contradiction-result.md) | Exercises `Customer PII` without `Privacy` |
| C | Growing company, multi-cloud expansion | Level 2 — Growing Organization | Multi-Cloud SaaS | not-started | — | — | [Bundle C result](./bundles/results/bundle-c-growing-multi-cloud-result.md) | Cloud-only multi-provider path |
| D | Growing company, hybrid boundary risk | Level 2 — Growing Organization | Hybrid Cloud + Self-Hosted | not-started | — | — | [Bundle D result](./bundles/results/bundle-d-growing-hybrid-result.md) | Hybrid ownership-boundary path |
| E | Established program, advanced cloud scope | Level 3 — Established Program | Multi-Cloud SaaS | not-started | — | — | [Bundle E result](./bundles/results/bundle-e-established-multi-cloud-result.md) | Mature cloud-only path |
| F | Established program, mature hybrid | Level 3 — Established Program | Hybrid Cloud + Self-Hosted | not-started | — | — | [Bundle F result](./bundles/results/bundle-f-established-hybrid-result.md) | Highest-complexity supported path |
| G | Pure on-prem product gap check | Level 2 or Level 3 | Pure On-Prem / Self-Hosted Gap | gap | — | — | [Bundle G result](./bundles/results/bundle-g-on-prem-gap-result.md) | Documents current unsupported pure on-prem limitation |

## Recommended Run Order

Run in this order if you want the fastest confidence ramp:

1. Bundle A — confirm the simplest supported path still works.
2. Bundle B — confirm privacy contradiction handling.
3. Bundle C — confirm multi-cloud behavior.
4. Bundle D — confirm hybrid behavior.
5. Bundle E — confirm mature cloud-only behavior.
6. Bundle F — confirm mature hybrid behavior.
7. Bundle G — confirm the on-prem limitation is still documented accurately.

## Execution Notes

- Update `Status`, `Last run`, `Tester`, and `Notes` after every run.
- Link or reference the completed result template in the notes if you save a filled-in copy elsewhere.
- If a scenario exposes a bug, record the issue reference in `Notes` and downgrade the status to `partial` or `failed`.
- Keep Bundle G as `gap` unless the product gains a true pure on-prem completion path.
