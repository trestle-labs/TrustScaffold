# Reviewer Scope

## Review Objective

Determine whether the TrustScaffold baseline template pack minimally covers the documentation normally assessed during a SOC 2 Type I design-of-controls review before organization-specific facts, answers, control owners, system descriptions, or evidence are inserted.

## Primary Review Question

If a company completed the TrustScaffold wizard honestly and generated company-specific documents from this baseline set, would the baseline template library provide a reasonable starting point for documenting the design of controls mapped to the selected Trust Services Criteria?

## In Scope

- Baseline template language in [templates/](templates/).
- Criteria-level coverage in [TYPE1_DOCUMENTATION_COVERAGE.md](TYPE1_DOCUMENTATION_COVERAGE.md).
- Category-level TSC and COSO-oriented coverage in [COVERAGE_MATRIX.md](COVERAGE_MATRIX.md).
- Whether each selected SOC 2 criterion has enough policy, procedure, system-description, or evidence-request language to support Type I design review.
- Whether placeholders are clear enough to produce auditable company-specific language after wizard completion.
- Whether control owners, cadences, review expectations, exception handling, and evidence expectations are present where needed.

## Out Of Scope

- Whether any specific company has implemented the controls.
- Whether operating effectiveness evidence is sufficient for SOC 2 Type II.
- Whether a specific CPA firm will accept generated documents without modification.
- Legal advice, privacy counsel advice, HIPAA attestation, PCI DSS validation, or formal CPA opinion.
- Testing live application behavior, authentication, data storage, exports, or evidence ingestion.

## Review Modes

| Mode | Criteria To Review | Use When |
| --- | --- | --- |
| Security-only SOC 2 Type I | CC1.1-CC9.2 | Reviewing the minimum SOC 2 Security category baseline. |
| Security + Availability | CC1.1-CC9.2 and A1.1-A1.3 | Availability commitments are expected in the report. |
| Security + Confidentiality | CC1.1-CC9.2 and C1.1-C1.2 | Confidential customer or company information commitments are expected. |
| Security + Processing Integrity | CC1.1-CC9.2 and PI1.1-PI1.5 | Completeness, accuracy, timeliness, validity, or authorization of processing is in scope. |
| Security + Privacy | CC1.1-CC9.2 and P1.1-P8.1 | Personal information privacy commitments are in scope. |
| All TSC categories | All rows in TYPE1_DOCUMENTATION_COVERAGE.md | Reviewing the broadest baseline template set. |

## Reviewer Assessment Scale

| Assessment | Meaning |
| --- | --- |
| Sufficient | Baseline language appears adequate for Type I design documentation, subject to company-specific completion and evidence. |
| Partial | Baseline language exists but should be strengthened, split into procedures, or made more specific. |
| Missing | Baseline language does not adequately address the criterion or expected documentation area. |
| N/A | Criterion is outside the selected engagement scope. |

## Requested Reviewer Output

Return findings using [REVIEWER_FINDINGS_TEMPLATE.md](REVIEWER_FINDINGS_TEMPLATE.md). For each finding, include the affected criterion, affected template, severity, rationale, and recommended language or remediation.
