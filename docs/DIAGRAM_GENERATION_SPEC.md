# Diagram Generation Spec

> Implementation companion for Stage 3 of [PRODUCT_SPEC_V1.md](PRODUCT_SPEC_V1.md). This document gives the diagram-generation work a durable home and breaks the effort into shippable epics.

---

## Purpose

TrustScaffold's diagram generation work turns architecture and data-flow outputs into first-class compliance artifacts. The goal is not just to render diagrams, but to generate reviewable, versioned, evidence-aware artifacts with explicit freshness, assumptions, and audit-readiness semantics.

## Scope

This spec covers:
- artifact registry and trigger model
- dependency-scoped snapshot hashing
- fidelity gates and stale-state logic
- typed artifact-body model by renderer
- standalone diagram and annex inventory
- epic breakdown and sprint order for implementation

## Core Model

### Artifact Registry

Every diagram or diagram-adjacent output should be registered with:
- `slug`
- `title`
- `renderer`
- `artifactClass`
- `frameworkTags`
- `trigger`
- `dependencies`
- `fidelityGate`
- `bundleMembership`

The registry is the single source of truth for what can be generated, when it becomes eligible, and what inputs can make it stale.

### Dependency-Scoped Snapshot Hashing

Each artifact should carry a dependency snapshot hash computed from the subset of wizard answers and derived inputs that actually feed that artifact. Hashing the full wizard payload is too coarse; hashing the dependency slice enables precise stale detection and better reviewer trust.

### Fidelity Gates

Each artifact should declare a minimum input-completeness bar before it can claim a higher review grade. Eligibility to render does not imply eligibility to claim audit-readiness.

### Typed Artifact Bodies

Artifact payloads should use a discriminated union keyed by renderer type so downstream review, export, and rendering paths can be strict about assumptions.

Suggested renderer families:
- `mermaid`
- `markdown-table`
- `narrative-structured`
- `matrix`

### Review and Staleness Model

Each artifact should support:
- `storedGrade`
- `displayGrade`
- `stale`
- `staleReasons`
- `eligibleForReview`
- `reviewedAt`
- `reviewedBy`
- `dependencySnapshotHash`

## Artifact Inventory

### Standalone Artifacts
1. Network topology boundary diagram
2. Third-party subservice data flow diagram
3. Cardholder data flow diagram
4. PHI data flow map
5. Record of Processing Activities (RoPA)
6. Control-to-framework crosswalk

### Annex Inventory

Annex outputs should be registry-driven as well, even when they render inline with a parent document. Initial annex coverage should include the diagram-adjacent outputs referenced by the reviewer pack and architecture bundles.

## Epic Breakdown

### Epic 1: Registry and Type System
- establish artifact metadata types
- establish renderer discriminants
- define trigger and dependency contracts

### Epic 2: Dependency Snapshot Engine
- canonicalize dependency slices
- compute stable hashes
- store and compare prior dependency snapshots

### Epic 3: Persistence and Lifecycle Model
- persist artifact bodies and state
- add stale-state derivation and display-grade logic
- wire review metadata into generated-document flows

### Epic 4: Renderer Abstraction
- add a renderer interface
- support Mermaid and non-diagram structured outputs through one contract
- normalize rendering failures and fallback states

### Epic 5: Standalone Artifact Generation
- ship all six standalone artifacts
- register triggers and dependency lists per artifact
- validate expected output shape for each renderer

### Epic 6: Annex Integration
- register annex outputs in the same catalog
- attach annexes to parent document-generation flows
- preserve provenance between parent documents and annex artifacts

### Epic 7: Fidelity Gates and Review Promotion
- define completeness thresholds per artifact
- prevent automatic promotion from renderable to audit-ready
- surface missing-input reasons clearly to operators and reviewers

### Epic 8: Review UX and Stale-State Surfacing
- show grade, stale status, and stale reasons in the dashboard
- surface artifact review actions and timestamps
- clarify assumptions and dependency provenance in the UI

### Epic 9: Bundle Export and Publication
- support bundle export for Architecture and Data Flow Pack
- derive bundle grade from constituent artifacts
- preserve artifact provenance in exports

### Epic 10: Validation, QA, and Observability
- add fixture-based tests for registry, hashing, and stale transitions
- add E2E coverage for rendering and review state
- add diagnostics for generation failures and unexpected state transitions

## Recommended Sprint Order

### Sprint 1: Foundations
- Epics 1 through 3

### Sprint 2: Rendering and Generation
- Epics 4 through 6

### Sprint 3: Review Semantics
- Epics 7 and 8

### Sprint 4: Export, QA, and Hardening
- Epics 9 and 10

## Definition of Done

The diagram-generation system is done when:
- all standalone artifacts are registry-driven
- dependency-scoped stale detection is working
- fidelity gates prevent false audit-readiness
- review metadata is visible and actionable
- exports preserve provenance
- automated tests cover generation, stale transitions, and review semantics