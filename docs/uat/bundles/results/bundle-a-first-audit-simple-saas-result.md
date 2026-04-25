# Bundle A Result Template — First Audit, Simple SaaS

- Bundle: `A`
- Tester: GitHub Copilot
- Date: 2026-04-25
- App URL: `http://localhost:3010`
- User email used: `level1.aws.uat.20260425e@trustscaffold.local`


## Stage Results

- Dashboard-first landing: pass after fix
  - Actual route: initial fresh signup landed on `/wizard`; `signupAction` now redirects to `/dashboard`.
  - Quick actions visible: dashboard restored after applying pending local migrations for `wizard_drafts`.
  - Theme toggle visible: yes.

- Welcome: partial
  - First-time tone visible: yes, Review preserved first-time guidance.
  - Required-field gating worked: yes, Review/Generate blocked incomplete payloads.
  - Audit type recommendation observed: SOC 2 Type I selected for the first-audit path.
  - Deviation: selecting `The org is the company` displayed the workspace org name but still raised `Company name is required`; tester switched to the governed-company option and entered the same org name to continue.

- Infrastructure: partial
  - Provider profile captured: AWS, Okta, GitHub, Rippling.
  - Multi-cloud warning shown: no, AWS-only path did not trigger multi-cloud warning.
  - Hybrid warning shown: no, cloud-only path did not trigger hybrid warning.
  - AWS controls shown: yes, AWS IAM and Availability Zone language generated.
  - Azure/GCP/physical controls hidden: yes for the generated Level 1 package.
  - Deviation fixed during run: fresh wizard defaults no longer pre-populate a Supabase sub-service row; testers now start with an empty vendor list.
  - Open deviation: updated UAT docs place sub-service organizations in Infrastructure, but the live wizard still renders the vendor-entry block in System Scope.

- System Scope: pass
  - Vendors entered: AWS, Okta, GitHub, Rippling.
  - Role auto-fill worked: vendor role/detail fields restored and rendered in generated docs.
  - Auto-fill hint cleared on override: not manually re-checked in this run.

- Governance: pass
  - First-time guidance visible: yes.
  - Deep dives shown: founder-led oversight, founder-led security ownership, and ad hoc founder review captured.
  - Hidden mature-only fields stayed hidden: yes for the Level 1 profile path.

- TSC Selection: pass
  - Privacy contradiction warning shown: yes, `Customer PII` with Privacy unchecked surfaced the expected attention item.

- Operations: pass
  - Okta MFA guidance shown: yes, System Description and Evidence Checklist reference Okta MFA.
  - GitHub peer-review guidance shown: yes, System Description and Evidence Checklist reference GitHub branch protection and peer review.
  - Gap deep dives stayed hidden: yes, because MFA and peer review were enabled.

- Review: pass
  - First-time maturity preserved: yes.
  - AWS-only environment preserved: yes.
  - Privacy contradiction visible: yes.

- Generate: pass
  - Blocked until required issues resolved: yes.
  - Redirected to `/generated-docs`: yes.
  - Generated count: 13 draft documents.
  - Unresolved `{{` tokens found: no; database verification found 0 unresolved-token documents across 13 drafts.
  - Provider context preserved: database verification found Okta references in 5 drafts and AWS/GitHub/Okta/Rippling context across the generated set.
  - System Description content QA: after regeneration, the Company Overview preserves the entered system description without wrapping it in broken `provides ... deployed as ...` grammar.
  - Vendor Management Policy content QA: after regeneration, AWS/Okta/GitHub/Rippling descriptions match the saved wizard draft, assurance cadence renders as `Annual review`, and the review cadence sentence reads `Critical vendors are reviewed annually.`
  - SOC 2 Evidence Checklist/package QA: after regenerating affected drafts, the evidence checklist maps CC1-CC9, preserves AWS/Okta/GitHub/Rippling context, renders `SOC 2 Type II` report labels, and no generated draft contains unresolved placeholders, raw cadence enums, doubled periods, or the reviewed awkward wording patterns.

## Overall Outcome

- Pass / partial / fail: partial
- What felt helpful: Review preserved first-time guidance, AWS-only scope, provider details, and the Customer PII/Privacy attention item before generation.
- What felt mismatched: updated docs say vendors are captured in Infrastructure, but the live wizard still captures them in System Scope. The `same-as-company` Welcome path also displayed the org name without satisfying validation.
- Follow-up bugs: fixed during run — removed the product-specific Supabase default sub-service row so fresh Level 1 drafts start clean; corrected System Description overview grammar; corrected Vendor Management Policy cadence labels and grammar; expanded and polished the SOC 2 Evidence Checklist; corrected incident commander, assurance-report labels, and internal-audit/data-retention cadence wording. Earlier fixes remain valid: local migrations/template backfills, logout submission, explicit SOC 2 Type I System Description language, and dashboard-first signup.
