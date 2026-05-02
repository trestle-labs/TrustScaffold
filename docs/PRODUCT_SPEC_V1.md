# Product Spec V1

> Internal product specification for TrustScaffold V1.0. Describes what ships, why, and the user-facing behavior for each feature area.

---

## Vision

TrustScaffold is an open-source compliance automation platform — starting with SOC 2 Type II. The architecture is framework-agnostic: the template engine, evidence pipeline, audit trail, and auditor portal support any compliance framework via additional template packs (ISO 27001, HIPAA, PCI DSS, NIST CSF).

V1.0 transitions from an "AI Document Generator" to a **Canonical Compliance Ledger** (the Control Graph). It captures complex infrastructure intent, enforces an immutable document lifecycle, synchronizes bidirectionally with Git, and presents provable state to external auditors — without relying on human-curated screenshots.

TrustScaffold is the flagship application of the `trestle-labs` platform, which provides the shared compliance engine, policy template library, and learning tools that serve practitioners across the ecosystem.

> Historical scope note: Sections 1 through 7 preserve the original V1 launch scope and terminology, including the initial 7-stage wizard and 16-template launch footprint. For the current product state, repository strategy, and post-launch roadmap, see Section 8.

---

## 1. The Wizard (Intake & Infrastructure Modeling)

### Purpose
An educational compliance coach that captures granular infrastructure data while actively warning against startup compliance anti-patterns ("Lone Wolf" configurations, security theater).

### User Flow
7-stage guided process:
1. **Welcome & Onboarding** — Company name, website, primary contact, industry
2. **System Scope** — System name, description, data types handled, multi-tenant flag
3. **TSC Selection** — Security (mandatory) + optional Availability, Confidentiality, Processing Integrity, Privacy
4. **Infrastructure Profiling** — Cloud providers (AWS/Azure/GCP), hybrid/self-hosted flags, IdP selection, cloud-specific toggles (IAM, Macie, Key Vault, SCC, etc.)
5. **Operations** — Ticketing system, VCS provider, HRIS, on-call tooling, MFA/peer-review/insurance toggles, SLA values
6. **Review** — Summary of all selections before generation
7. **Generate** — Server-side Handlebars compilation of 16 templates against wizard data

### Key Behaviors
- **Multi-Cloud Arrays:** User selects multiple cloud providers; compiler outputs conditional Handlebars for all
- **Hybrid/Self-Hosted Logic:** `hostsOwnHardware` flag triggers CC6.4 physical security clauses
- **Sub-Service Mapping:** Vendor array generates Vendor Management Review Matrix
- **Lone Wolf Warnings:** Amber callouts when `requiresPeerReview=false` (CC8.1 SoD) or `requiresMfa=false` (CC6.1)
- **Human-Centric Evidence Prompts:** Evidence checklist prompts for post-mortems, access tickets, onboarding checklists
- **Show Me How Snippets:** Expandable config guides for GitHub branch protection, Azure DevOps branch policies, Entra MFA, Okta MFA, AWS SCPs
- **Idempotency:** Re-running updates existing drafts in-place; never creates duplicates

### Template Library (16 Templates)
See [TSC_MAPPING_AUDIT.md](TSC_MAPPING_AUDIT.md) for the complete criteria-to-template mapping.

---

## 2. Dashboard & The Control Graph (Lifecycle & Sync)

### Purpose
The immutable ledger of truth managing document lifecycle and preventing backdating, fabrication, or security theater.

### Features
- **Immutable Revisions:** `document_revisions` table. Edits, approvals, merges append new rows.
- **Role-Gated Approvals:** Only `admin` or `approver` roles can transition draft → approved.
- **Hash-Chained Audit Logging:** `audit_logs` with SHA-256 checksums chaining to `previous_event_checksum`. `BEFORE UPDATE/DELETE` trigger blocks mutation.
- **GitOps Export:** Approved docs exported to GitHub/Azure DevOps as branch + PR via `@octokit/rest`.
- **Two-Way Git Sync:** `pull_request` (closed/merged) webhooks hash merged content, compare to local revision, insert `merged` revision if changed.
- **Population List:** `vcs_merge_events` table auto-populated from PR webhooks. `is_self_merged` and `has_review` computed columns for SoD analysis.
- **Audit Snapshots:** `create` (tag) webhooks matching `audit/*` auto-freeze approved revision IDs into `audit_snapshots`.

---

## 3. The Auditor Portal (Distribution)

### Purpose
Zero-setup, read-only verification for external CPAs. Replace evidence chaos with structured, timeline-backed proof.

### Features
- **Time-Boxed Authentication:** Admin generates secure magic link with configurable expiration (default 30 days).
- **Global Overview:** System Description summary, audit dates, snapshot tag under review.
- **TSC Matrix Navigation:** AICPA criteria menu (CC1–CC9, A1, C1, PI1, P1–P8).
- **Provenance Timeline:** Visual Drafted → Approved → Exported → Merged timeline with immutable system timestamps from hash-chain.
- **Anti-Theater Metadata:** SHA-256 checksums and ledger timestamps displayed alongside each revision.
- **Evidence Linkage:** `evidence_artifacts` mapped to specific criteria.

---

## 4. Telemetry-Driven Evidence Ingestion API

### Purpose
Transition from manual screenshot curation to continuous, API-driven telemetry.

### Endpoint
`POST /api/v1/evidence/ingest` — Secured via org-specific API key.

### Features
- **CSPM Integrations:** Auto-detects and normalizes Prowler, Steampipe, CloudQuery JSON.
- **Canonicalized Tamper-Evidence:** RFC 8785 JCS canonicalization → SHA-256 → frozen in Supabase Storage → logged in `evidence_artifacts`.
- **Handlebars Data Binding:** Evidence checklist template renders scanner results as Markdown tables via `{{#each evidence_runs}}` with `countByStatus` and `formatDate` helpers.
- **Stateless LLM Synthesis:** Optional provider-agnostic layer (`lib/synthesis/llm-synthesis.ts`) for formal compliance narrative generation. Raw payloads excluded from prompts. Dry-run mode for auditor transparency.
- **Auditor Verification:** `scripts/verify-hashes.sh` enables independent hash and chain verification.

---

## 5. Non-Functional Requirements

- **Idempotency:** Wizard updates existing drafts; never creates duplicates (enforced by unique partial index on `organization_id, template_id WHERE status = 'draft'`).
- **Zero-Trust Client Access:** No PATs, webhook secrets, or service-role keys in client bundle. All Git operations server-side.
- **Tenant Isolation:** RLS on all tables. Organization-scoped access verified by `current_user_has_org_role()`.
- **Build Integrity:** `npm run typecheck`, `npm run lint`, `npm run build` — zero errors.

---

## 6. System Description Auto-Generation (AICPA DC 200)

The `system-description` template programmatically generates a 7-section System Description satisfying AICPA Description Criteria (DC 3):

1. **Company Overview** — Service commitments, TSC scope (conditional sections)
2. **Infrastructure** — Cloud providers (AWS/Azure/GCP), on-premises, hybrid, network architecture
3. **Software** — Application stack, VCS, IdP, supporting software
4. **People** — Organizational structure, personnel controls, SLA values
5. **Procedures** — Change management, incident response, risk management, monitoring
6. **Data** — Classifications, encryption, subservice organizations
7. **TSC Mapping** — Criteria-to-section cross-reference table

---

## 7. Compliance Verification & Housekeeping

- **TSC Mapping Audit:** All templates formally mapped to AICPA TSC 2017. See [TSC_MAPPING_AUDIT.md](TSC_MAPPING_AUDIT.md).
- **Edge-Case Testing:** `scripts/test-templates.ts` compiles all 16 templates across 12 configuration variants (AWS-only, Azure-only, GCP-only, multi-cloud, self-hosted, hybrid, all-TSC, minimal-TSC, lone-wolf, no-vendors, Azure DevOps, multi-vendor).
- **Architecture Docs:** [CONTROL_GRAPH_ARCHITECTURE.md](CONTROL_GRAPH_ARCHITECTURE.md), [PRODUCT_SPEC_V1.md](PRODUCT_SPEC_V1.md), [BUILD_SPEC.md](BUILD_SPEC.md).
- **Operator Guides:** [LOCAL_DEV.md](LOCAL_DEV.md), [SELF-HOSTING.md](SELF-HOSTING.md).
- **Launch Repo License Audit:** The original TrustScaffold monorepo is AGPLv3 with a NOTICE file documenting third-party dependencies. Section 8.2 defines the planned repo-specific licensing model for the `trestle-labs` split.

---

## 8. Organization, Repository, and Product Roadmap

This section is the single reference for where TrustScaffold is going, how the codebase is being restructured to support it, and what the team should work on and in what order. It covers the `trestle-labs` GitHub organization strategy, the repository split and migration plan, and the phased product roadmap.

### 8.1 What TrustScaffold Is Today

TrustScaffold is a compliance automation platform that guides teams through an intelligent wizard to generate framework-mapped policy documents, enforce an immutable audit trail, and present provable compliance state to external auditors.

#### What Is Actually In Production Today
- A 10-step wizard collecting infrastructure, governance, scope, TSC selection, security tooling, and operations data via a Zod-validated schema with 150+ conditional branching rules.
- A template engine that compiles 30+ Handlebars policy templates into a complete reviewer pack covering SOC 2 / TSC, ISO 27001, HIPAA, PCI-DSS, SOX / ITGC, GDPR, and Privacy.
- A document lifecycle with role-gated approvals, hash-chained audit logs, and immutable revision history.
- A GitOps export layer pushing approved documents to GitHub and Azure DevOps as branches and pull requests with two-way webhook sync.
- An evidence ingestion API normalizing CSPM scanner output with RFC 8785 canonicalization and SHA-256 tamper evidence.
- A time-boxed auditor portal giving external CPAs structured, timeline-backed read-only access without setup.
- A security scoring and assessment system with per-domain gap identification.
- A control map that builds a dependency graph of controls across TSC criteria.
- A multi-tenant Supabase backend with RLS on all tables and organization-scoped access.

#### What Is Fully Designed But Not Yet Built
- The diagram generation layer: network topology, third-party data flow, cardholder data flow, PHI data flow, RoPA, and control-to-framework crosswalk as first-class generated artifacts.
- Artifact-level lifecycle model with dependency-scoped snapshot hashing, stale detection, fidelity gates, and human-gated review promotion.
- Expanded reviewer pack: Management Assertion Letter, CUECs/CSOCs, Bridge Letter, NIST CSF Profile, and Points of Focus Gap Analysis.
- Wizard expansion for PHI depth, PCI CDE boundary, SOX ICFR scoping, risk scoring methodology, Secure SDLC depth, and incident response SLAs.
- `trustscaffold-edu`: the teaching fork with annotation engine, what-if engine, scenario library, and audit simulation mode.

### 8.2 Why `trestle-labs`

TrustScaffold has outgrown personal-project semantics. The product is a compliance evidence platform, and the planned work includes a shared library, a teaching fork, open-source template contributions, and eventual community involvement. Keeping everything under a personal GitHub account signals side-project intent; an organization signals institutional intent.

The org name `trestle-labs` is broader than `TrustScaffold`, which leaves room for multiple products and shared infrastructure without tying the organization to one app name.

#### Open, Closed, and License Split

| Repo | Visibility | License | Rationale |
|------|-----------|---------|-----------|
| `trestle-core` | Public / Open Source | Apache 2.0 | Community contributions to control mappings and schemas improve coverage. |
| `trestle-templates` | Public / Open Source | Apache 2.0 | Practitioner-contributed policy templates are the highest-value community motion. |
| `trustscaffold` | Private initially | AGPLv3 today; commercial path optional later | The production compliance evidence platform and likely commercial surface. |
| `trustscaffold-edu` | Public or Private | TBD | Teaching tool; final visibility decision can wait until scope is clearer. |

Until the repo split is complete, the current monorepo remains AGPLv3 as defined by the root [LICENSE](LICENSE) and [NOTICE](NOTICE).

### 8.3 The `trestle-labs` Repository Ecosystem

```text
trestle-labs/
├── .github
├── trestle-core
├── trestle-templates
├── trustscaffold
└── trustscaffold-edu
```

#### `trestle-core`
The extractable pure TypeScript library with zero UI or framework dependencies. It should publish as `@trestle-labs/core`, and both `trustscaffold` and `trustscaffold-edu` should consume it as a dependency.

```text
trestle-core/src/
├── wizard/
│   ├── schema.ts
│   ├── merge-data.ts
│   ├── rule-matrix.ts
│   ├── document-generation-rules.ts
│   ├── template-manifest.ts
│   ├── template-payload.ts
│   ├── control-map.ts
│   ├── security-scoring.ts
│   └── audit-report.ts
├── documents/
│   ├── template-engine.ts
│   ├── template-artifacts.ts
│   ├── section-diff.ts
│   ├── frontmatter.ts
│   └── document-artifacts.ts
├── diagrams/
│   ├── registry.ts
│   ├── snapshot.ts
│   ├── renderers/
│   └── artifacts/
├── auth/
├── evidence/
├── synthesis/
└── shared/
```

#### `trestle-templates`
Pure Markdown and Handlebars. No code dependencies. Community-contributable. Apache 2.0 licensed.

```text
trestle-templates/
├── security/
├── availability/
├── confidentiality/
├── privacy/
├── hipaa/
├── pci-dss/
├── iso27001/
├── sox/
└── cross-framework/
```

#### `trustscaffold`
The production platform. After extraction, this should contain only what is inherently application-specific: the Next.js app, Supabase integration, UI components, and the Zustand wizard store.

```text
trustscaffold/
├── app/
├── components/
├── lib/
│   ├── supabase*.ts
│   └── wizard/store.ts
├── supabase/
└── docs/
```

#### `trustscaffold-edu`
The teaching tool. A new Next.js application consuming `@trestle-labs/core` and `@trestle-labs/templates`.

```text
trustscaffold-edu/
├── app/
│   ├── scenarios/
│   ├── wizard/
│   ├── what-if/
│   ├── simulate/
│   └── frameworks/
├── components/
├── content/
└── lib/
```

### 8.4 Migration Plan

These migration phases run in parallel with the product stages in Section 8.5. They describe repository and platform-infrastructure work, not a serial prerequisite chain that must fully complete before product delivery continues.

#### Phase 0: Org Setup
1. Create `trestle-labs/.github` with org profile `README.md`.
2. Transfer the existing repository to `trestle-labs/trustscaffold`.
3. Create empty `trestle-labs/trestle-core` and `trestle-labs/trestle-templates` repositories.
4. Add `CONTRIBUTING.md` and issue templates to `.github` before any public announcement.

#### Phase 1: Extract `trestle-templates`
1. Copy `docs/reviewer-pack/templates/` into `trestle-templates`.
2. Add `README.md`, `CONTRIBUTING.md`, and a framework coverage matrix.
3. License as Apache 2.0.
4. Add `trestle-templates` as a versioned dependency in `trustscaffold`.
5. Update template loading paths to resolve from the package.

Verification: `npm run typecheck` passes, and document generation still works end-to-end.

#### Phase 2: Extract `trestle-core`
1. Set up `trestle-core` as a TypeScript library with a build and proper package exports.
2. Copy the extractable files from `lib/wizard/`, `lib/documents/`, and related pure logic into `src/`.
3. Add a workspace reference in `trustscaffold/package.json` during development.
4. Update imports across `trustscaffold` to use `@trestle-labs/core/...`.
5. Run `typecheck` incrementally, not only at the end.
6. Add a thin test suite covering schema validation, rule evaluation, document trigger logic, and template payload output for known fixtures.
7. Switch from workspace reference to a proper versioned package once green.

Verification: all existing tests pass, and `trustscaffold` generates documents identically to before the extraction.

#### Phase 3: Scaffold `trustscaffold-edu`
1. Create a new Next.js app under `trestle-labs/trustscaffold-edu`.
2. Add `@trestle-labs/core` and `@trestle-labs/templates` as dependencies.
3. Move UAT scenario bundles into `trestle-core/fixtures/` so both apps can consume them.
4. Build a scenario browser that runs fixtures through the wizard engine and renders generated documents.
5. Add a stub annotation panel alongside each document section.

#### Phase 4: Core-First Rule
After Phase 2, all new compliance logic lands in `trestle-core` before it lands anywhere else.

#### Decisions To Make Before Phase 1
- Template versioning model: whether `trestle-templates` versions independently from `trestle-core`.
- Open-source timing: whether `trestle-core` and `trestle-templates` go public immediately or after a review window.
- UAT bundle ownership: whether shared fixtures move into `trestle-core/fixtures/`.

### 8.5 Product Roadmap

#### What Is Actually In Product Today
- 10-step compliance wizard with Zod validation, 150+ conditional branching rules, and show-me-how config snippets.
- 30+ policy templates covering SOC 2 / TSC, ISO 27001 baseline, HIPAA, PCI-DSS, SOX / ITGC, GDPR, and Privacy.
- Handlebars template engine compiling wizard answers into a complete reviewer pack.
- Control map dependency graph builder and security scoring system.
- Immutable audit log with SHA-256 hash chaining.
- Role-gated document approvals.
- GitOps export to GitHub and Azure DevOps.
- Two-way webhook sync for pull request merge events.
- Evidence ingestion API with RFC 8785 canonicalization and CSPM scanner normalization.
- Time-boxed auditor portal with TSC matrix navigation and provenance timeline.
- Multi-tenant Supabase backend with RLS.

#### What Is Designed And Ready To Build
- Diagram generation layer: artifact registry, snapshot hashing, fidelity gates, grade and stale lifecycle, and six standalone diagram artifacts.
- Expanded reviewer pack: Management Assertion Letter, CUECs, CSOCs, Bridge Letter, Points of Focus Gap Analysis, and NIST CSF Profile.
- Wizard expansion: PHI element depth, PCI CDE boundary, SOX ICFR scoping, risk scoring methodology, Secure SDLC depth, and incident response SLA collection.
- `trustscaffold-edu` annotation engine, what-if engine, scenario library, and audit simulation mode.

The roadmap below is intentionally a product-maturity ladder. It starts with TrustScaffold as a strong standalone dashboard and document generator, and ends with TrustScaffold as a multi-product compliance platform with a shared core, external integrations, and a broader ecosystem. These stages describe capability maturity, not a strict sequencing rule for the migration phases above.

#### Stage 1: Standalone Dashboard Foundation
Goal: make the current application unmistakably useful as a single-tenant-feeling, self-contained compliance dashboard for one organization at a time.

Focus:
- Polish the dashboard experience around generated documents, control posture, document status, and recent activity.
- Make the current reviewer-pack flow obvious and reliable for a single operator.
- Tighten onboarding so a first user can complete the wizard and produce a credible initial document set without assistance.

Exit criteria:
- A new team can complete setup and understand their current compliance posture entirely inside the dashboard.
- The product feels complete even before cross-repo extraction, distribution, and ecosystem work land.

#### Stage 2: Guided Document Factory
Goal: turn the dashboard into a repeatable document-generation system instead of a one-time wizard demo.

Focus:
- Strengthen the 10-step wizard so branching logic, field guidance, and generated outputs are consistent and comprehensible.
- Improve security scoring, gap surfacing, and control-map visibility so the dashboard explains what is missing and why.
- Add higher-signal warnings when user inputs are insufficient for audit-grade outputs.

Exit criteria:
- TrustScaffold reliably produces a baseline reviewer pack with clear gaps and next actions.
- Users can regenerate and compare outputs without losing confidence in the system.

#### Stage 3: Audit-Grade Artifact System
Goal: evolve from document generation into reviewable, evidence-aware artifact production.

Focus:
- Implement the diagram generation layer: artifact registry, dependency-scoped snapshot hashing, fidelity gates, typed artifact bodies, and standalone diagram records. See [DIAGRAM_GENERATION_SPEC.md](DIAGRAM_GENERATION_SPEC.md) for the implementation companion covering the artifact model, epic breakdown, and sprint order.
- Ship the six standalone artifacts: network topology boundary diagram, third-party subservice data flow, cardholder data flow, PHI data flow map, RoPA, and control-to-framework crosswalk.
- Add artifact status concepts: `storedGrade`, `displayGrade`, `stale`, `staleReasons`, `eligibleForReview`, `reviewedAt`, and `reviewedBy`.
- Add bundle export for Architecture and Data Flow Pack with derived grade.

Exit criteria:
- Generated artifacts behave like first-class review objects instead of decorative annexes.
- Artifact freshness, assumptions, and audit readiness are visible and enforceable.

#### Stage 4: Auditor Workspace
Goal: make the product operational for audit and diligence workflows, not just internal drafting.

Focus:
- Expand the reviewer pack with Management Assertion Letter, CUECs, CSOCs, Bridge Letter, Points of Focus Gap Analysis, NIST CSF Profile, PCI Responsibility Matrix, and User Entity Controls Guide.
- Add auditor briefing materials, security metrics dashboard outputs, RACI matrix, incident response flowchart, and third-party risk assessment artifacts.
- Deepen the auditor portal with better scope navigation, provenance trails, and artifact review surfaces.

Exit criteria:
- An external auditor or customer security reviewer can navigate the workspace with minimal hand-holding.
- TrustScaffold supports audit kickoff, evidence review, and readiness conversations directly in product.

#### Stage 5: Audit-Grade Wizard Fidelity
Goal: collect the operational detail required for non-placeholder, auditor-usable outputs across major frameworks.

Focus:
- Expand wizard coverage for PHI, PCI, SOX, ISO, risk management, Secure SDLC, and incident response.
- Ensure every expansion includes schema migration coverage in `merge-data.ts` and related validation paths.
- Replace hardcoded assumptions with explicitly collected operational answers wherever document quality depends on them.

Exit criteria:
- Major artifacts no longer rely on obvious placeholder language.
- Wizard answers are deep enough to support auditor-usable SOC 2, HIPAA, PCI, SOX, and ISO-adjacent outputs.

#### Stage 6: Internal Distribution and Consumption
Goal: move from internal drafting to real internal use across policy consumers, reviewers, and operating teams.

Focus:
- Export approved documents as PDF and DOCX with revision provenance.
- Publish approved outputs into SharePoint, Microsoft 365, and Confluence while keeping TrustScaffold as the system of record.
- Add Jira-linked workflows for acknowledgement, review, recertification, and change-management coordination.

Exit criteria:
- Approved outputs are readable where employees already work.
- Publication, revision provenance, and downstream coordination work without manual copy-paste.

#### Stage 7: Evidence and Control Operations Platform
Goal: expand from policy generation into a living system of record for evidence and control operations.

Focus:
- Harden the evidence ingestion pipeline with payload sanitization, depth and size guards, anomaly logging, and safer storage boundaries.
- Add a schema-mapping webhook adapter for generic external evidence payloads.
- Build first-party integrations on top of the adapter surface without forking the ingestion model.
- Improve document editing and review with Tiptap-based refinement, revision diffs, and clear separation between compiled content and approved edits.

Exit criteria:
- TrustScaffold is no longer just a document dashboard; it is a control-and-evidence operating surface.
- Evidence can arrive from multiple systems and still map back to one canonical compliance model.

#### Stage 8: Shared-Core Product Platform
Goal: turn TrustScaffold from one app into a platform architecture that supports multiple products and contribution models.

Focus:
- Complete the `trestle-labs` org setup and repo transfers.
- Establish `trestle-core` and `trestle-templates` as independent packages consumed by `trustscaffold`.
- Move template authority into `trestle-templates` and keep new compliance logic in `trestle-core`.
- Create the foundation for bring-your-own-template packs and community contribution.

Exit criteria:
- `trustscaffold` is one product on top of a shared platform, not the only place where logic lives.
- The platform can support multiple apps, package consumers, and contribution paths.

#### Stage 9: Multi-Product Ecosystem
Goal: extend the platform into adjacent product experiences without duplicating the core engine.

Focus:
- Launch `trustscaffold-edu` on top of `@trestle-labs/core` and `@trestle-labs/templates`.
- Ship the annotation engine, what-if engine, scenario browser, framework decision tree, and audit simulation mode.
- Move shared UAT bundles and learning fixtures into shared packages so both apps run on the same scenarios and logic.

Exit criteria:
- The teaching product and the production product share the same engine and template substrate.
- The ecosystem proves that the platform architecture supports more than one surface area.

#### Stage 10: Full Compliance Platform Expansion
Goal: complete the transition from standalone dashboard to broad compliance platform with multi-framework depth, continuous evidence motion, and ecosystem leverage.

Focus:
- Deepen current coverage into first-class framework packs for ISO 27001, HIPAA, PCI-DSS, and potentially NIST CSF assessment mode.
- Add high-priority new framework targets such as FedRAMP, CMMC, CIS Controls, NY DFS Part 500, DORA, and NIS2.
- Evaluate sector-specific and regional packs including GLBA, HITRUST, CSA STAR, FERPA, SWIFT CSCF, Cyber Essentials, ISO 27701, ISO 27017, ISO 27018, EU AI Act support, SEC disclosure support, Australia Privacy Act, Quebec Law 25, and PIPEDA.
- Expand platform capabilities with AI-assisted policy refinement, broader continuous-compliance integrations, white-label or embeddable deployment options, and `trustscaffold-edu` certification-alignment or CPE partnership exploration.

Exit criteria:
- TrustScaffold operates as a coherent compliance platform rather than a single dashboard with templates.
- Expansion is driven by repeatable customer demand while reusing the same control, artifact, and evidence substrate.

### 8.6 Definition of Done: Ecosystem Separation

The `trestle-labs` migration is complete when:
1. `trestle-core` exists as an independent, versioned, tested TypeScript package.
2. `trestle-templates` exists as an independent, versioned, Apache 2.0 template library.
3. `trustscaffold` imports from `@trestle-labs/core` and `@trestle-labs/templates` with no internal copies.
4. `trustscaffold-edu` runs against the same packages and generates documents from scenario bundles.
5. The UAT scenario bundles live in `trestle-core/fixtures/` and are consumed by both apps.
6. All new compliance logic lands in `trestle-core` before it lands anywhere else.
7. CI passes across all active repos.

### 8.7 Guiding Principles

- Core logic belongs in `trestle-core`, not in the app. If a rule, schema change, or renderer is useful to both the production platform and the teaching tool, it belongs in the shared library.
- Templates are community property. `trestle-templates` is where compliance practitioners who are not developers should be able to contribute with a low-friction workflow.
- Diagrams are evidence, not decoration. Every generated diagram should carry a version, a source snapshot hash, a framework tag set, and an assumptions block.
- Fidelity gates prevent false confidence. No generated artifact should claim audit readiness when the wizard inputs that feed it are incomplete.
- The teaching tool teaches the system, not just the output. `trustscaffold-edu` should explain why controls exist, what evidence proves them, and how frameworks relate.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 15 |
| UI | Tailwind CSS + shadcn/ui | — |
| Runtime | React | 19 |
| Language | TypeScript | 5.7 |
| Database & Auth | Supabase (PostgreSQL + Auth) | — |
| Templating | Handlebars | 4.7 |
| Forms | React Hook Form + Zod | — |
| State | Zustand | 5.0 |
| Git Integration | @octokit/rest | 21.1 |
| Markdown Rendering | react-markdown | 9.0 |
