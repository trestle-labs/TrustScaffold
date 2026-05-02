import { createHash } from 'node:crypto';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MarkdownDocument } from '@/components/documents/markdown-document';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeChip } from '@/components/ui/code-chip';
import { Progress } from '@/components/ui/progress';
import { getEvidenceStatusBadgeVariant, getRevisionSourceBadgeVariant, getRevisionSourceLabel } from '@/lib/evidence/auditor-display';
import { getCriteriaByCategory, TSC_CRITERIA, type TscCriterion } from '@/lib/tsc-criteria';
import { metricPanelSurfaceClassName, mutedInsetSurfaceClassName, nestedPanelSurfaceClassName } from '@/lib/ui/card-surfaces';
import { cn } from '@/lib/utils';
import { createSupabaseServiceRoleClient } from '@/lib/supabase-service';

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function validatePortalToken(rawToken: string) {
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const supabase = createSupabaseServiceRoleClient();

  const { data: portalToken, error } = await supabase
    .from('auditor_portal_tokens')
    .select(`
      id,
      organization_id,
      snapshot_id,
      label,
      stage,
      expires_at,
      last_accessed_at,
      organizations(name, system_description),
      audit_snapshots(
        id,
        tag_name,
        audit_period_start,
        audit_period_end,
        description
      )
    `)
    .eq('token_hash', tokenHash)
    .single();

  if (error || !portalToken) return null;

  // Check expiration
  if (new Date(portalToken.expires_at) < new Date()) return null;

  // Update last_accessed_at
  await supabase
    .from('auditor_portal_tokens')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('id', portalToken.id);

  return portalToken;
}

export default async function AuditorPortalPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCriterion = typeof resolvedSearchParams.criterion === 'string' ? resolvedSearchParams.criterion : null;

  const portalToken = await validatePortalToken(token);
  if (!portalToken) return notFound();

  const org = Array.isArray(portalToken.organizations) ? portalToken.organizations[0] : portalToken.organizations;
  const snapshot = Array.isArray(portalToken.audit_snapshots) ? portalToken.audit_snapshots[0] : portalToken.audit_snapshots;

  if (!org || !snapshot) return notFound();

  const stage = (portalToken as Record<string, unknown>).stage as string ?? 'presentation';
  const isEvidence = stage === 'evidence';

  const supabase = createSupabaseServiceRoleClient();

  // Load snapshot revisions with their documents and templates
  const { data: snapshotRevisions } = await supabase
    .from('audit_snapshot_revisions')
    .select(`
      revision_id,
      document_revisions(
        id,
        document_id,
        source,
        content_markdown,
        content_hash,
        commit_sha,
        pr_url,
        created_at,
        generated_docs(
          id,
          title,
          file_name,
          templates(slug, name, criteria_mapped)
        )
      )
    `)
    .eq('snapshot_id', snapshot.id);

  // Build a map of criteria code -> revisions
  const criteriaToRevisions = new Map<string, typeof flatRevisions>();

  type FlatRevision = {
    id: string;
    source: string;
    content_markdown: string;
    commit_sha: string | null;
    pr_url: string | null;
    created_at: string;
    doc_title: string;
    doc_file_name: string;
    template_name: string;
    criteria_mapped: string[];
  };

  const flatRevisions: FlatRevision[] = [];

  for (const sr of snapshotRevisions ?? []) {
    const rev = Array.isArray(sr.document_revisions) ? sr.document_revisions[0] : sr.document_revisions;
    if (!rev) continue;

    const doc = Array.isArray(rev.generated_docs) ? rev.generated_docs[0] : rev.generated_docs;
    if (!doc) continue;

    const template = Array.isArray(doc.templates) ? doc.templates[0] : doc.templates;
    const criteriaMapped = (template?.criteria_mapped ?? []) as string[];

    const flat: FlatRevision = {
      id: rev.id,
      source: rev.source,
      content_markdown: rev.content_markdown,
      commit_sha: rev.commit_sha,
      pr_url: rev.pr_url,
      created_at: rev.created_at,
      doc_title: doc.title,
      doc_file_name: doc.file_name,
      template_name: template?.name ?? 'Unknown',
      criteria_mapped: criteriaMapped,
    };

    flatRevisions.push(flat);

    // Map to each criterion this template covers
    for (const code of criteriaMapped) {
      // Expand CC6 -> CC6.1, CC6.2, etc.
      for (const criterion of TSC_CRITERIA) {
        if (criterion.code.startsWith(code)) {
          const existing = criteriaToRevisions.get(criterion.code) ?? [];
          existing.push(flat);
          criteriaToRevisions.set(criterion.code, existing);
        }
      }
    }
  }

  // Load all provenance (full revision history) for the selected criterion's documents
  let provenanceRevisions: {
    id: string;
    source: string;
    commit_sha: string | null;
    pr_url: string | null;
    created_at: string;
    document_id: string;
  }[] = [];

  if (isEvidence && selectedCriterion) {
    const revForCriterion = criteriaToRevisions.get(selectedCriterion) ?? [];
    const docIds = [...new Set(revForCriterion.map((r) => {
      const sr = (snapshotRevisions ?? []).find((s) => {
        const rev = Array.isArray(s.document_revisions) ? s.document_revisions[0] : s.document_revisions;
        return rev?.id === r.id;
      });
      const rev = sr ? (Array.isArray(sr.document_revisions) ? sr.document_revisions[0] : sr.document_revisions) : null;
      const doc = rev ? (Array.isArray(rev.generated_docs) ? rev.generated_docs[0] : rev.generated_docs) : null;
      return doc?.id;
    }).filter(Boolean))];

    if (docIds.length) {
      const { data: allRevisions } = await supabase
        .from('document_revisions')
        .select('id, source, commit_sha, pr_url, created_at, document_id')
        .in('document_id', docIds)
        .order('created_at', { ascending: true });

      provenanceRevisions = allRevisions ?? [];
    }
  }

  // Load hash-chain audit log entries for anti-theater metadata
  let auditLogEntries: {
    id: string;
    action: string;
    entity_id: string;
    event_checksum: string;
    created_at: string;
    details: Record<string, unknown> | null;
  }[] = [];

  if (isEvidence && selectedCriterion && provenanceRevisions.length) {
    const docIds = [...new Set(provenanceRevisions.map((r) => r.document_id))];
    const { data: logs } = await supabase
      .from('audit_logs')
      .select('id, action, entity_id, event_checksum, created_at, details')
      .eq('organization_id', portalToken.organization_id)
      .eq('entity_type', 'generated_doc')
      .in('entity_id', docIds)
      .order('created_at', { ascending: true });

    auditLogEntries = logs ?? [];
  }

  // Load evidence artifacts for this org and audit period (evidence stage only)
  let evidence: {
    id: string;
    control_mapping: string;
    artifact_name: string;
    status: string;
    collection_tool: string;
    source_system: string;
    collected_at: string;
  }[] | null = null;

  if (isEvidence) {
    const { data } = await supabase
      .from('evidence_artifacts')
      .select('id, control_mapping, artifact_name, status, collection_tool, source_system, collected_at')
      .eq('organization_id', portalToken.organization_id)
      .gte('collected_at', snapshot.audit_period_start)
      .lte('collected_at', snapshot.audit_period_end + 'T23:59:59Z')
      .order('collected_at', { ascending: false });
    evidence = data;
  }

  // Group evidence by control mapping
  const evidenceByControl = new Map<string, typeof evidence>();
  for (const artifact of evidence ?? []) {
    // Match both exact code and parent code (CC6 matches CC6.1)
    for (const criterion of TSC_CRITERIA) {
      if (criterion.code === artifact.control_mapping || criterion.code.startsWith(artifact.control_mapping + '.') || artifact.control_mapping.startsWith(criterion.code.split('.')[0])) {
        const existing = evidenceByControl.get(criterion.code) ?? [];
        existing.push(artifact);
        evidenceByControl.set(criterion.code, existing);
      }
    }
  }

  const criteriaByCategory = getCriteriaByCategory();
  const selectedCriterionData = selectedCriterion ? TSC_CRITERIA.find((c) => c.code === selectedCriterion) : null;
  const selectedRevisions = selectedCriterion ? (criteriaToRevisions.get(selectedCriterion) ?? []) : [];
  const selectedEvidence = selectedCriterion ? (evidenceByControl.get(selectedCriterion) ?? []) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">TrustScaffold Auditor Portal</h1>
              <p className="text-sm text-muted-foreground">{portalToken.label}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isEvidence ? 'default' : 'secondary'}
                className="text-xs"
              >
                {isEvidence ? 'Stage 2 — Evidence Review' : 'Stage 1 — Control Presentation'}
              </Badge>
              <Badge variant="outline" className="text-xs">Read-only access</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Global Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>{org.system_description ?? 'No system description provided.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="font-medium text-foreground">Audit Period</p>
                <p className="text-muted-foreground">{snapshot.audit_period_start} — {snapshot.audit_period_end}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Snapshot Tag</p>
                <p className="text-muted-foreground">{snapshot.tag_name}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Policies Frozen</p>
                <p className="text-muted-foreground">{flatRevisions.length} document revision{flatRevisions.length === 1 ? '' : 's'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Stage 1: Control Presentation ═══ */}
        {!isEvidence && (
          <>
            {/* Control Mapping Matrix */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Control Mapping Matrix</CardTitle>
                <CardDescription>
                  Overview of how policies map to AICPA Trust Services Criteria. Each row represents a policy document frozen in this audit snapshot with its criteria coverage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flatRevisions.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 pr-4 font-semibold text-foreground">Policy Document</th>
                          <th className="pb-3 pr-4 font-semibold text-foreground">Template</th>
                          <th className="pb-3 pr-4 font-semibold text-foreground">TSC Criteria</th>
                          <th className="pb-3 font-semibold text-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {flatRevisions.map((rev) => (
                          <tr key={rev.id} className="align-top">
                            <td className="py-3 pr-4">
                              <p className="font-medium text-foreground">{rev.doc_title}</p>
                              <p className="text-xs text-muted-foreground">{rev.doc_file_name}</p>
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">{rev.template_name}</td>
                            <td className="py-3 pr-4">
                              <div className="flex flex-wrap gap-1">
                                {rev.criteria_mapped.map((code) => (
                                  <Badge key={code} variant="outline" className="font-mono text-[10px]">{code}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant={getRevisionSourceBadgeVariant(rev.source)}>
                                {getRevisionSourceLabel(rev.source)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No policy documents are linked to this audit snapshot.</p>
                )}
              </CardContent>
            </Card>

            {/* Criteria Coverage Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Criteria Coverage</CardTitle>
                <CardDescription>
                  Trust Services Criteria categories with policy coverage indicators. A green dot means at least one policy maps to criteria in that category.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...criteriaByCategory.entries()].map(([category, criteria]) => {
                  const covered = criteria.filter((c) => criteriaToRevisions.has(c.code)).length;
                  const total = criteria.length;
                  const pct = total > 0 ? Math.round((covered / total) * 100) : 0;

                  return (
                    <div key={category}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{category}</p>
                        <span className="text-xs text-muted-foreground">{covered}/{total} criteria ({pct}%)</span>
                      </div>
                      <Progress value={pct} variant="success" size="sm" aria-label={`${category} coverage ${pct}%`} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Policy Summaries */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Summaries</CardTitle>
                <CardDescription>
                  Brief overview of each frozen policy document. Full document text, provenance timelines, and evidence artifacts are available once the audit progresses to Stage 2.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {flatRevisions.length ? flatRevisions.map((rev) => {
                  // Extract the first meaningful paragraph (skip headers)
                  const lines = rev.content_markdown.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
                  const summary = lines.slice(0, 3).join(' ').slice(0, 300);

                  return (
                    <div key={rev.id} className={cn(metricPanelSurfaceClassName, 'rounded-xl')}>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary">{rev.template_name}</Badge>
                        <span className="text-xs text-muted-foreground">{rev.doc_file_name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {summary}{summary.length >= 300 ? '…' : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rev.criteria_mapped.map((code) => (
                          <Badge key={code} variant="outline" className="font-mono text-[10px]">{code}</Badge>
                        ))}
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-muted-foreground">No policy documents are linked to this audit snapshot.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ═══ Stage 2: Evidence Review (existing TSC Matrix + Detail) ═══ */}
        {isEvidence && (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Left nav: TSC criteria tree */}
          <Card className="h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-base">Trust Services Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...criteriaByCategory.entries()].map(([category, criteria]) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                  <ul className="space-y-1">
                    {criteria.map((c) => {
                      const hasPolicy = criteriaToRevisions.has(c.code);
                      const hasEvidence = evidenceByControl.has(c.code);
                      const isSelected = selectedCriterion === c.code;

                      return (
                        <li key={c.code}>
                          <Link
                            href={`/auditor/${token}?criterion=${c.code}` as never}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                          >
                            <span className="font-mono text-xs">{c.code}</span>
                            <span className="truncate">{c.title}</span>
                            <span className="ml-auto flex gap-1">
                              {hasPolicy ? <span className="h-2 w-2 rounded-full bg-emerald-400" title="Policy linked" /> : null}
                              {hasEvidence ? <span className="h-2 w-2 rounded-full bg-blue-400" title="Evidence linked" /> : null}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right panel: detail view */}
          <div className="space-y-6">
            {!selectedCriterion ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select a criterion</CardTitle>
                  <CardDescription>
                    Click on a Trust Services Criteria code in the left navigation to view its linked policy, provenance timeline, and evidence artifacts.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <>
                {/* Criterion header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">{selectedCriterionData?.code}</Badge>
                      <CardTitle>{selectedCriterionData?.title}</CardTitle>
                    </div>
                    <CardDescription>{selectedCriterionData?.description}</CardDescription>
                  </CardHeader>
                </Card>

                {/* The Policy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Policy</CardTitle>
                    <CardDescription>
                      The exact document revision frozen at the time of the audit snapshot.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedRevisions.length ? (
                      <div className="space-y-6">
                        {selectedRevisions.map((rev) => (
                          <div key={rev.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{rev.template_name}</Badge>
                              <span className="text-xs text-muted-foreground">{rev.doc_file_name}</span>
                            </div>
                            <div className={cn(nestedPanelSurfaceClassName, 'rounded-xl p-6')}>
                              <MarkdownDocument markdown={rev.content_markdown} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No policy document is linked to this criterion in the current snapshot.</p>
                    )}
                  </CardContent>
                </Card>

                {/* The Provenance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provenance Timeline</CardTitle>
                    <CardDescription>
                      The complete revision history showing how this policy evolved through the Control Graph.
                      Timestamps are anchored to the immutable hash-chain audit ledger — they cannot be backdated.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {provenanceRevisions.length ? (
                      <ol className="relative border-l-2 border-border pl-6 space-y-4">
                        {provenanceRevisions.map((rev) => {
                          // Find the matching audit log entry for hash-chain proof
                          const matchingLog = auditLogEntries.find(
                            (log) => log.entity_id === rev.document_id &&
                              new Date(log.created_at).getTime() >= new Date(rev.created_at).getTime() - 5000 &&
                              new Date(log.created_at).getTime() <= new Date(rev.created_at).getTime() + 5000,
                          );

                          return (
                            <li key={rev.id} className="relative">
                              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-border" />
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={getRevisionSourceBadgeVariant(rev.source)}>
                                  {getRevisionSourceLabel(rev.source)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(rev.created_at).toLocaleString()}
                                </span>
                              </div>
                              {rev.commit_sha ? (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Commit: <CodeChip>{rev.commit_sha.slice(0, 8)}</CodeChip>
                                </p>
                              ) : null}
                              {rev.pr_url ? (
                                <p className="mt-1 text-xs">
                                  <a href={rev.pr_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                    View Pull Request
                                  </a>
                                </p>
                              ) : null}
                              {matchingLog ? (
                                <div className={cn(mutedInsetSurfaceClassName, 'mt-1 rounded border border-border px-2 py-1')}>
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Hash-Chain Proof (anti-backdating)</p>
                                  <p className="font-mono text-[11px] text-muted-foreground break-all">
                                    SHA-256: {matchingLog.event_checksum}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Ledger timestamp: {new Date(matchingLog.created_at).toISOString()}
                                  </p>
                                </div>
                              ) : null}
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">No revision history is available for this criterion.</p>
                    )}
                  </CardContent>
                </Card>

                {/* The Evidence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidence Artifacts</CardTitle>
                    <CardDescription>
                      Evidence collected from external scanners during the audit period that maps to this criterion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedEvidence.length ? (
                      <div className="space-y-3">
                        {selectedEvidence.map((artifact) => (
                          <div
                            key={artifact.id}
                            className={cn(metricPanelSurfaceClassName, 'flex items-center gap-4')}
                          >
                            <Badge variant={getEvidenceStatusBadgeVariant(artifact.status)}>{artifact.status}</Badge>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">{artifact.artifact_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {artifact.collection_tool} · {artifact.source_system} · Collected {new Date(artifact.collected_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No evidence artifacts are linked to this criterion for the audit period.</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
