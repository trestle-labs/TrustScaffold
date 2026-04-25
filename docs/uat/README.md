# Wizard UAT Pack

This folder contains complete user acceptance test scripts for the three organization levels currently modeled by the wizard.

These scripts are derived from the organization-level UAT model in [../MASTER_TEST_PLAN.md](../MASTER_TEST_PLAN.md) and are meant to be run by a human tester from the live UI.

## UAT Levels

1. [Level 1 — First-Time Organization](./level-1-first-time-organization.md)
2. [Level 2 — Growing Organization](./level-2-growing-organization.md)
3. [Level 3 — Established Program](./level-3-established-program.md)

## Tracker

1. [UAT Tracker](./UAT_TRACKER.md)

## Environment Profiles

1. [Environment UAT Index](./environments/README.md)
2. [System Profile Library](./system-profiles.md)
3. [Single-Cloud SaaS](./environments/single-cloud-saas.md)
4. [Multi-Cloud SaaS](./environments/multi-cloud-saas.md)
5. [Hybrid Cloud + Self-Hosted](./environments/hybrid-cloud-self-hosted.md)
6. [Pure On-Prem / Self-Hosted Gap](./environments/on-prem-self-hosted-gap.md)

## Provider Coverage

Use [System Profile Library](./system-profiles.md) when you need an exact provider bundle or when you need to swap in a supported provider that is not already called out in a bundle.

That file gives you:

- Ready-to-run provider packs such as `AWS + Okta + GitHub + Rippling`
- Description seeds for the `System Scope` step
- Provider-profile selections and vendor assurance defaults for the `Infrastructure` step, including review cadence, report type, and control treatment
- A coverage catalog for every supported IdP, VCS, and HRIS option currently exposed in the wizard
- Compliance overlays for combined motions such as `SOC 2 + HIPAA` and `SOC 2 + PCI-DSS`

## Recommended UAT Bundles

Use these bundles when you want a ready-to-run scenario instead of choosing the maturity and environment documents separately.

Compact one-page run sheets now live in [./bundles/README.md](./bundles/README.md).

1. **Bundle A — First audit, simple SaaS**
	- Organization level: [Level 1 — First-Time Organization](./level-1-first-time-organization.md)
	- Environment: [Single-Cloud SaaS](./environments/single-cloud-saas.md)
	- Best for: validating the lowest-friction path for a new admin with a straightforward AWS-style SaaS deployment.

2. **Bundle B — Growing company, privacy contradiction**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- Environment: [Single-Cloud SaaS](./environments/single-cloud-saas.md)
	- Best for: validating `Customer PII` with `Privacy` intentionally left unchecked so Review and Generate catch the contradiction.

3. **Bundle C — Growing company, multi-cloud expansion**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- Environment: [Multi-Cloud SaaS](./environments/multi-cloud-saas.md)
	- Best for: validating that a partially mature organization gets the right multi-cloud warnings and review trace without hybrid language.

4. **Bundle D — Growing company, hybrid boundary risk**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- Environment: [Hybrid Cloud + Self-Hosted](./environments/hybrid-cloud-self-hosted.md)
	- Best for: validating ownership-boundary warnings, self-hosted control prompts, and hybrid document language.

5. **Bundle E — Established program, advanced cloud scope**
	- Organization level: [Level 3 — Established Program](./level-3-established-program.md)
	- Environment: [Multi-Cloud SaaS](./environments/multi-cloud-saas.md)
	- Best for: validating that an advanced team can complete the wizard efficiently while preserving broader scope and multi-cloud detail.

6. **Bundle F — Established program, mature hybrid**
	- Organization level: [Level 3 — Established Program](./level-3-established-program.md)
	- Environment: [Hybrid Cloud + Self-Hosted](./environments/hybrid-cloud-self-hosted.md)
	- Best for: validating the highest-complexity supported path with mature governance plus hybrid infrastructure.

7. **Bundle G — Product gap check, pure on-prem intent**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md) or [Level 3 — Established Program](./level-3-established-program.md)
	- Environment: [Pure On-Prem / Self-Hosted Gap](./environments/on-prem-self-hosted-gap.md)
	- Best for: confirming the current product limitation is documented accurately if pure on-prem support is a roadmap requirement.

8. **Bundle H — Growing company, Azure-first provider path**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- System profile: [System Profile Library](./system-profiles.md) using `SP-2 — Growing Azure-First SaaS`
	- Best for: validating a clean single-cloud Microsoft-leaning provider path without multi-cloud or hybrid noise.

9. **Bundle I — Growing company, GCP-first provider path**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- System profile: [System Profile Library](./system-profiles.md) using `SP-3 — Growing GCP-First SaaS`
	- Best for: validating a clean single-cloud GCP path and confirming the wizard behaves correctly when provider-specific helper panels are intentionally absent.

10. **Bundle J — SOC 2 + HIPAA readiness**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- System profile: [System Profile Library](./system-profiles.md) using `SP-2 — Growing Azure-First SaaS`
	- Compliance overlay: [System Profile Library](./system-profiles.md) using `Overlay O-1 — SOC 2 + HIPAA Readiness`
	- Best for: validating the dedicated PHI field and a healthcare-regulated combined-audit path.

11. **Bundle K — SOC 2 + PCI-DSS readiness**
	- Organization level: [Level 2 — Growing Organization](./level-2-growing-organization.md)
	- System profile: [System Profile Library](./system-profiles.md) using `SP-3 — Growing GCP-First SaaS`
	- Compliance overlay: [System Profile Library](./system-profiles.md) using `Overlay O-2 — SOC 2 + PCI-DSS Readiness`
	- Best for: validating the dedicated CDE field and a payment-environment combined-audit path.

One-page run sheets:

1. [Bundle A run sheet](./bundles/bundle-a-first-audit-simple-saas.md)
2. [Bundle B run sheet](./bundles/bundle-b-growing-privacy-contradiction.md)
3. [Bundle C run sheet](./bundles/bundle-c-growing-multi-cloud.md)
4. [Bundle D run sheet](./bundles/bundle-d-growing-hybrid.md)
5. [Bundle E run sheet](./bundles/bundle-e-established-multi-cloud.md)
6. [Bundle F run sheet](./bundles/bundle-f-established-hybrid.md)
7. [Bundle G run sheet](./bundles/bundle-g-on-prem-gap.md)
8. [Bundle H run sheet](./bundles/bundle-h-growing-azure-first.md)
9. [Bundle I run sheet](./bundles/bundle-i-growing-gcp-first.md)
10. [Bundle J run sheet](./bundles/bundle-j-soc2-hipaa-readiness.md)
11. [Bundle K run sheet](./bundles/bundle-k-soc2-pci-dss-readiness.md)

## How To Use This Pack

1. Pick the UAT file that matches the organization maturity you want to validate.
2. Pick an environment profile that matches the system shape you want to validate.
3. If you need exact provider choices, pair the run with [System Profile Library](./system-profiles.md).
4. Follow the steps exactly as written, including the sample answers where provided.
5. Record any deviation between the expected result and the actual UI behavior.
6. If the wizard behaves differently from the expected maturity tier or environment profile, log that as a product issue.

If you want the fastest route, start with one of the recommended bundles above and run it end-to-end.

Track bundle coverage and execution status in [./UAT_TRACKER.md](./UAT_TRACKER.md).

These scripts are intended to be close to 1:1 with the current wizard implementation:

- They use the wizard's exact step order.
- They use current option labels where those labels are important to branching.
- They call out fields that must stay blank, unchecked, or hidden for each path.
- They explicitly cover both multi-cloud and hybrid infrastructure branches where relevant.
- They now pair with [System Profile Library](./system-profiles.md) when exact provider combinations, vendor descriptions, or assurance-review defaults matter.

Current wizard order:

1. Welcome
2. Infrastructure
3. System Scope
4. Governance
5. TSC Selection
6. Security Assessment
7. Security Tooling
8. Operations
9. Review
10. Generate

Infrastructure now captures the provider profile before the rest of the questionnaire: cloud providers, identity provider, branch-protection guide provider, HRIS provider, and provider-specific infrastructure controls. System Scope is reserved for the in-scope system name, data classification including PHI/CDE flags, deployment model, and final system-description prose. Operations captures the operational tools and process SLAs that support the selected providers.

They are still manual UAT scripts, not generated snapshots of the form schema, so they should be reviewed whenever new wizard fields, option labels, or branching rules are added.

## Common Preflight

Run this before any UAT session:

```bash
bash scripts/setup.sh --yes
PORT=$(grep '^PORT=' .env.local 2>/dev/null | cut -d= -f2); PORT=${PORT:-3000}
npm run dev
```

Then:

1. Open `http://localhost:${PORT}/signup`.
2. Create a fresh admin account for the scenario.
3. Confirm you land on `/dashboard`.
4. Launch the wizard from the dashboard quick action.

## Common Evidence To Capture

For every UAT run, capture:

- The route where the tester started and ended.
- The step titles shown in the wizard.
- Any warnings, deep dives, recommendations, or decision-trace entries.
- Whether the wizard tone felt appropriate for the organization level.
- Whether Review accurately summarized the organization profile.
- Whether Generate produced a believable draft set.

## Required UAT Report Template

```md
## UAT Result

- UAT level:
- Tester name / role:
- Date:
- App URL:
- User email used:

### Stage Results
- Dashboard entry:
- Welcome & onboarding:
- Infrastructure:
- System Scope:
- Governance:
- TSC Selection:
- Security Assessment:
- Security Tooling:
- Operations:
- Review:
- Generate:
- Optional settings / persistence checks:

### Branching Review
- Warnings shown:
- Recommendations shown:
- Deep dives shown:
- Decision trace summary:

### Outcome
- Pass / partial / fail:
- What felt intentionally helpful:
- What felt mismatched to this organization level:
- Follow-up bugs or notes:
```