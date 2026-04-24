# Environment UAT Profiles

This folder groups UAT by system environment instead of organization maturity.

Use these profiles alongside the organization-level UAT files in [../README.md](../README.md). The intended workflow is:

1. Pick an organization-level script such as first-time, growing, or established.
2. Pick one environment profile from this folder.
3. Run both together so the test covers maturity and infrastructure shape.

## Runnable Profiles

1. [Single-Cloud SaaS](./single-cloud-saas.md)
2. [Multi-Cloud SaaS](./multi-cloud-saas.md)
3. [Hybrid Cloud + Self-Hosted](./hybrid-cloud-self-hosted.md)

## Constraint Note

4. [Pure On-Prem / Self-Hosted Gap](./on-prem-self-hosted-gap.md)

The current wizard schema requires at least one cloud provider to be selected, so a true pure on-prem end-to-end UAT profile is not currently supported as a valid completion path. That is documented explicitly in the gap file rather than hidden in the test pack.

## Suggested Pairings

- First-time organization + Single-cloud SaaS
- Growing organization + Multi-cloud SaaS
- Growing organization + Hybrid Cloud + Self-Hosted
- Established program + Multi-cloud SaaS
- Established program + Hybrid Cloud + Self-Hosted

For complete ready-to-run scenario bundles, use the `Recommended UAT Bundles` section in [../README.md](../README.md).

## Shared Environment Assertions

For every environment profile, verify:

- Infrastructure warnings match the selected environment.
- Review reflects the chosen cloud providers and whether hardware is self-hosted.
- Generated documents preserve the environment shape in system-description and infrastructure language.
- Provider-specific control prompts only appear for the selected providers.
