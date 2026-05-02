# Document Publication Architecture

> Internal design note for employee-facing document publication. This covers how TrustScaffold publishes approved artifacts to Microsoft 365 / SharePoint and Confluence while keeping TrustScaffold as the canonical system of record.

---

## Goal

TrustScaffold should generate and govern compliance documents, then publish approved artifacts into the systems where employees already look for policies.

The first publication targets are:

- Microsoft 365 / SharePoint document libraries
- Confluence spaces

TrustScaffold remains the canonical source for:

- generated content
- immutable revision history
- approval state
- export and publication provenance
- auditor-facing verification

External document systems become the employee-facing distribution layer.

---

## Product Positioning

TrustScaffold should not try to replace SharePoint, Confluence, or Teams as the place employees search for policies.

Instead, the product should answer two different jobs:

- TrustScaffold: generate, approve, diff, attest, and audit policy artifacts
- Document systems: distribute, search, browse, acknowledge, and embed those artifacts in day-to-day workflows

This split preserves the compliance ledger while matching how companies actually operate.

---

## Core Principles

1. TrustScaffold is the system of record.
2. Publication is a one-way release of an approved revision unless a future feature explicitly adds controlled re-import.
3. Published artifacts must be traceable back to a specific TrustScaffold document revision.
4. External document IDs and URLs must be stored as publication metadata, not treated as the primary document identity.
5. Publishing must be provider-agnostic at the orchestration layer.

---

## User Outcomes

### Microsoft 365 / SharePoint

Admins can publish an approved PDF or DOCX into a SharePoint document library so employees can discover it via:

- SharePoint site navigation
- Teams tabs and linked libraries
- Microsoft Search
- onboarding or policy-center pages

### Confluence

Admins can publish a rendered policy page or linked artifact into a Confluence space so employees can discover it via:

- space navigation
- Confluence search
- handbook pages
- policy index pages

### Jira

Jira is not the primary document repository. It should be used later for:

- approval workflows
- policy review reminders
- periodic recertification tasks
- change-management tickets linked to a publication event

---

## Architecture Overview

```
generated_docs + document_revisions
              |
              v
  publication job orchestration
              |
    +---------+---------+
    |                   |
    v                   v
render artifact     render page payload
(PDF, DOCX)         (Confluence storage/HTML)
    |                   |
    v                   v
provider adapter     provider adapter
(SharePoint)         (Confluence)
    |                   |
    +---------+---------+
              |
              v
publication metadata + audit log + exported revision
```

---

## Domain Model

The current model already contains:

- `generated_docs` for mutable working documents
- `document_revisions` for immutable content history
- `organization_integrations` for external connection metadata

The publication feature should extend this model with publication metadata rather than duplicating document content.

Recommended additions:

### 1. Extend `integration_provider`

Add:

- `sharepoint`
- `confluence`

This keeps provider management on the existing integration table.

### 2. Expand `organization_integrations`

The current schema is VCS-specific. It should evolve into a generic connection record with provider-specific configuration kept in JSON.

Recommended fields:

- `provider_config jsonb not null default '{}'::jsonb`
- `display_name text`
- `status text` or provider-specific health stored in config

Examples:

- SharePoint config: tenant ID, site ID, drive ID, folder path, preferred format
- Confluence config: base URL, space key, parent page ID, publishing mode

### 3. Add `document_publications`

Recommended table:

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `organization_id` | Tenant boundary |
| `document_id` | Parent generated doc |
| `revision_id` | Exact immutable source revision |
| `integration_id` | Which provider connection was used |
| `provider` | Denormalized provider type |
| `format` | `pdf`, `docx`, `html`, `confluence_page` |
| `status` | `queued`, `published`, `failed`, `superseded` |
| `external_document_id` | Remote item/page identifier |
| `external_url` | Employee-facing link |
| `external_version` | Remote revision label if available |
| `published_by` | User who initiated publish |
| `published_at` | Publish timestamp |
| `error_message` | Failure summary |
| `metadata` | Provider-specific details |

This table should represent publication events, not mutable pointers only. Multiple publications for one document are expected over time.

---

## Rendering Strategy

### PDF

Recommended first path:

- Markdown -> normalized HTML -> styled print layout -> PDF

Why:

- best fidelity for policy-style documents
- easiest route to page headers, footers, cover pages, and appendices
- easiest to keep revision history intact as an appendix

### DOCX

Recommended later path:

- Markdown AST -> DOCX builder

Why later:

- stricter formatting model
- more mapping work for tables, callouts, and policy banners
- no immediate need for native Word tracked changes in the first slice

### Confluence Page Rendering

Recommended path:

- Markdown -> sanitized HTML / Atlassian storage format

Publishing mode options:

- publish as a page body
- publish a summary page plus attached PDF/DOCX artifact

The second mode is often safer for preserving print-stable compliance artifacts.

---

## SharePoint Adapter

### Recommended Scope

The SharePoint adapter should support:

- upload artifact to a configured document library folder
- overwrite or version the prior item depending on org preference
- return remote item ID and web URL
- optionally write basic metadata fields such as framework, policy type, effective date, and source revision hash

### API Boundary

Provider service contract:

```ts
type PublishArtifactInput = {
  fileName: string;
  contentType: string;
  bytes: Buffer;
  title: string;
  revisionId: string;
  contentHash: string;
};

type PublishArtifactResult = {
  externalDocumentId: string;
  externalUrl: string;
  externalVersion?: string;
  metadata?: Record<string, unknown>;
};
```

### Auth Model

Use Microsoft Graph with an org-managed app registration.

Recommended initial approach:

- tenant admin grants the app access to the target site/library
- TrustScaffold stores encrypted refreshable credentials or app-only credentials depending on deployment mode

---

## Confluence Adapter

### Recommended Scope

The Confluence adapter should support:

- create or update a page in a configured space
- optionally attach the generated PDF artifact
- return page ID and canonical URL
- preserve a reference to the TrustScaffold revision in page metadata or labels

### Publishing Modes

1. `page_only`
2. `attachment_only`
3. `page_with_attachment`

Default recommendation:

- `page_with_attachment` for policy rollouts

This gives users a browsable page and preserves a downloadable artifact.

---

## Changelog and Revision Integrity

The employee-facing system should not be the only place revision history lives.

TrustScaffold should publish one of the following with each artifact:

- a revision-history appendix in the PDF/DOCX
- metadata containing the source revision ID and hash
- a backlink to the TrustScaffold document detail page

For V1 of publication, the changelog requirement should mean:

- include the latest approved revision provenance
- preserve a human-readable revision history section

It should not require native Word tracked changes.

---

## User Access Later

Users should be able to find published documents through both TrustScaffold and the external repository.

### Inside TrustScaffold

Each generated document page should show:

- latest approved revision
- latest exported artifact formats
- last publication status
- published destination links
- who published and when

### Outside TrustScaffold

Users should find documents through:

- SharePoint library navigation
- Teams tabs that point to the library
- Microsoft Search
- Confluence space navigation
- Confluence search
- handbook or onboarding indexes

TrustScaffold should later expose a policy index page that surfaces all publication destinations by framework and status.

---

## Security and Compliance Requirements

1. Only approved revisions can be published.
2. Publication actions must append audit log events.
3. Provider credentials must remain encrypted at rest.
4. Publication metadata must be organization-scoped under RLS.
5. Failed publication attempts must capture non-secret error summaries for admin debugging.
6. Remote URLs must be treated as distribution pointers, not proof of compliance by themselves.

---

## Recommended Delivery Sequence

### Phase 1

- PDF rendering service
- SharePoint integration record support
- `document_publications` table
- publish approved revision to SharePoint
- show publication link/status in document detail view

### Phase 2

- DOCX output
- Confluence adapter
- publication history UI

### Phase 3

- scheduled republish when a new revision is approved
- employee acknowledgment workflows
- Jira-linked review tasks
- multi-destination publication profiles

---

## Open Decisions

1. Should SharePoint publishing use app-only auth, delegated auth, or support both?
2. Should Confluence prefer page rendering or attached artifacts by default?
3. Should publication metadata live only in a new `document_publications` table, or should `generated_docs` also cache the latest publication pointers for faster UI reads?
4. Should PDF rendering run inline in the request path or as a background job?

Current recommendation:

- app-only auth for SharePoint where possible
- `page_with_attachment` for Confluence
- authoritative history in `document_publications` with optional cached latest pointers later
- inline generation for the first small-scope PDF slice, background jobs once DOCX and multi-destination publishing arrive