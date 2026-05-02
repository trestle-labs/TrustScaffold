# Glossary Source Registry

Internal source-of-truth for TrustScaffold glossary alignment, citation quality, and future automation.

## Purpose

Use this registry to keep definitions aligned to authoritative sources while preserving plain-English wording for operators.

## Source Strategy

1. Legal terms: Cornell Legal Information Institute (LII / Wex) when available.
2. Security and controls terms: NIST CSF, NIST SP 800-53, FFIEC guidance.
3. Assurance terms: AICPA SOC and Trust Services Criteria references.
4. Product terms: TrustScaffold internal semantics (clearly labeled as internal).

## Authoritative Link Index

| Domain | Authority | URL | Notes |
| --- | --- | --- | --- |
| Legal dictionary | Cornell LII Wex | https://www.law.cornell.edu/wex | Primary legal dictionary starting point. |
| Materiality | Cornell LII Wex | https://www.law.cornell.edu/wex/materiality | Useful for SOX and audit scoping language. |
| Due diligence | Cornell LII Wex | https://www.law.cornell.edu/wex/due_diligence | Useful for vendor and procurement controls. |
| Cybersecurity framework | NIST CSF 2.0 | https://www.nist.gov/cyberframework | Canonical framework landing page. |
| Control catalog | NIST SP 800-53 Rev. 5 | https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final | Detailed control families. |
| OSCAL catalog (automation) | NIST OSCAL catalogs | https://github.com/usnistgov/oscal-content/tree/main/nist.gov/SP800-53/rev5/json | Machine-readable control content. |
| Financial sector cybersecurity | FFIEC CAT | https://www.ffiec.gov/cyberassessmenttool.htm | Financial-services-oriented control language. |
| SOC assurance context | AICPA SOC resources | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 | High-level SOC reference entry point. |

## API and Machine-Readable Feeds

Use these feeds to support future automated glossary refresh workflows and evidence terminology checks.

| Feed | URL | Format | Suggested use |
| --- | --- | --- | --- |
| NVD CVE API v2 | https://services.nvd.nist.gov/rest/json/cves/2.0 | JSON | Enrich vulnerability-related term examples and evidence language. |
| CISA Known Exploited Vulnerabilities catalog | https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json | JSON | Keep "active exploitation" and risk language current. |
| NIST OSCAL SP 800-53 controls | https://github.com/usnistgov/oscal-content/tree/main/nist.gov/SP800-53/rev5/json | JSON (repo-hosted) | Map glossary terms to control-family context. |

## Definition Quality Rules

1. Every non-internal term should include at least one citation URL.
2. Prefer plain-English first, then formal/regulatory interpretation.
3. If definitions vary by framework, include framework tags and a TrustScaffold interpretation note.
4. Do not claim legal advice; preserve "for operational guidance" framing in UI copy.

## Maintenance Workflow

1. Propose glossary changes in lib/glossary.ts.
2. Add or validate source links in this file.
3. Confirm glossary UI renders citation links.
4. Record date and reviewer in changelog notes for significant updates.
