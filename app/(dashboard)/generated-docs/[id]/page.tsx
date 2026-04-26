import Link from 'next/link';

import { approveGeneratedDocAction, archiveGeneratedDocAction, regenerateDocAction, rejectGeneratedDocAction } from '@/app/(dashboard)/generated-docs/actions';
import { MarkdownDocument } from '@/components/documents/markdown-document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { diffMarkdownSections } from '@/lib/documents/section-diff';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function GeneratedDocDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await getDashboardContext();

  if (!context?.organization) {
    return null;
  }

  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const successMessage = typeof resolvedSearchParams.success === 'string' ? resolvedSearchParams.success : null;
  const errorMessage = typeof resolvedSearchParams.error === 'string' ? resolvedSearchParams.error : null;

  const supabase = await createSupabaseServerClient();
  const { data: doc, error } = await supabase
    .from('generated_docs')
    .select('id, title, file_name, content_markdown, status, version, updated_at, approved_at, templates(name)')
    .eq('organization_id', context.organization.id)
    .eq('id', id)
    .single();

  if (error || !doc) {
    throw new Error(error?.message ?? 'Generated document not found');
  }

  const { data: latestApprovedRevision } = await supabase
    .from('document_revisions')
    .select('id, content_markdown, created_at')
    .eq('document_id', doc.id)
    .eq('source', 'approved')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const sectionDiff = latestApprovedRevision
    ? diffMarkdownSections(latestApprovedRevision.content_markdown, doc.content_markdown)
    : null;

  const { data: decisionHistory } = await supabase
    .from('audit_logs')
    .select('id, action, details, actor_user_id, created_at')
    .eq('organization_id', context.organization.id)
    .eq('entity_type', 'generated_doc')
    .eq('entity_id', doc.id)
    .in('action', ['document.approved', 'document.rejected'])
    .order('created_at', { ascending: false })
    .limit(8);

  const templateRelation = Array.isArray(doc.templates) ? doc.templates[0] : doc.templates;
  const canApprove = ['admin', 'approver'].includes(context.organization.role) && doc.status !== 'approved';
  const canArchive = context.organization.role === 'admin' && doc.status !== 'archived';
  const canRegenerate = ['admin', 'editor'].includes(context.organization.role);
  const canReject = ['admin', 'editor'].includes(context.organization.role) && doc.status === 'draft';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{doc.title}</CardTitle>
              <Badge>{doc.status}</Badge>
              <Badge variant="secondary">v{doc.version}</Badge>
            </div>
            <CardDescription>{doc.file_name} · Template {templateRelation?.name ?? 'Unknown'}</CardDescription>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Updated {new Date(doc.updated_at).toLocaleString()}
              {doc.approved_at ? ` · Approved ${new Date(doc.approved_at).toLocaleString()}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/generated-docs">Back to documents</Link>
            </Button>
            {canApprove ? (
              <form action={approveGeneratedDocAction}>
                <input type="hidden" name="document_id" value={doc.id} />
                <Button type="submit">Approve</Button>
              </form>
            ) : null}
            {canRegenerate ? (
              <form action={regenerateDocAction}>
                <input type="hidden" name="document_id" value={doc.id} />
                <Button type="submit" variant="secondary" title="Re-render this document from the wizard data stored at last generation">
                  Regenerate
                </Button>
              </form>
            ) : null}
            {canArchive ? (
              <form action={archiveGeneratedDocAction}>
                <input type="hidden" name="document_id" value={doc.id} />
                <Button type="submit" variant="ghost">Archive</Button>
              </form>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {successMessage ? <p className="rounded-2xl bg-primary/10 px-4 py-3 text-primary">{successMessage}</p> : null}
          {errorMessage ? <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-destructive">{errorMessage}</p> : null}
          {sectionDiff ? (
            <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-amber-900">Review Changes Since Last Approved</p>
                <Badge className="bg-amber-100 text-amber-900">{sectionDiff.changedSections.length} changed</Badge>
                <Badge variant="secondary">{sectionDiff.unchangedCount} unchanged</Badge>
              </div>
              <p className="text-xs text-amber-800">
                Compare section-level changes before deciding whether to approve this draft. If these changes are acceptable, approve the full document.
              </p>
              {sectionDiff.changedSections.length === 0 ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  No section changes detected versus the latest approved revision.
                </p>
              ) : (
                <div className="space-y-3">
                  {sectionDiff.changedSections.map((change, index) => (
                    <details key={`${change.title}-${index}`} className="rounded-xl border border-amber-200 bg-white px-4 py-3">
                      <summary className="cursor-pointer text-sm font-medium text-foreground">
                        {change.title} ({change.changeType})
                      </summary>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div className="rounded-xl border border-border bg-secondary/20 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Previously approved</p>
                          {change.previousContent ? (
                            <MarkdownDocument markdown={change.previousContent} className="text-sm" />
                          ) : (
                            <p className="text-xs text-muted-foreground">No content in prior approved revision.</p>
                          )}
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/20 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current draft</p>
                          {change.currentContent ? (
                            <MarkdownDocument markdown={change.currentContent} className="text-sm" />
                          ) : (
                            <p className="text-xs text-muted-foreground">Section removed from current draft.</p>
                          )}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-secondary/20 p-4">
              <p className="text-sm font-semibold text-foreground">No prior approved baseline yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Approve this document once to establish the first approved revision baseline for future section-level comparisons.
              </p>
            </div>
          )}
          {canReject ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">Reject Draft Changes</p>
              <p className="mt-1 text-xs text-rose-800">
                Rejecting requires a reviewer reason. The current draft will be archived and the previous approved version remains the active baseline.
              </p>
              <form action={rejectGeneratedDocAction} className="mt-3 space-y-3">
                <input type="hidden" name="document_id" value={doc.id} />
                <Textarea
                  name="rejection_reason"
                  required
                  minLength={10}
                  placeholder="Explain why this draft was rejected (required)."
                  className="min-h-24 border-rose-300 bg-white"
                />
                <Button type="submit" className="bg-rose-600 text-white hover:bg-rose-700">Reject Changes</Button>
              </form>
            </div>
          ) : null}
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/25 p-4">
              <p className="font-semibold text-foreground">Approve</p>
              <p className="mt-1 text-xs">Locks this draft as approved for export and writes an approved revision. Admins and approvers can approve documents.</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/25 p-4">
              <p className="font-semibold text-foreground">Regenerate</p>
              <p className="mt-1 text-xs">Re-renders this document from the wizard payload stored on this document. Use Generate from the wizard to refresh all drafts from the latest wizard answers.</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/25 p-4">
              <p className="font-semibold text-foreground">Archive</p>
              <p className="mt-1 text-xs">Moves this document out of the active list. Admins can archive drafts or approved documents when they should no longer be exported.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/20 p-4">
            <p className="text-sm font-semibold text-foreground">Decision History</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Approval and rejection events are recorded with timestamp, actor, and reviewer reason for audit traceability.
            </p>
            {!decisionHistory?.length ? (
              <p className="mt-3 text-xs text-muted-foreground">No approval or rejection decisions recorded yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {decisionHistory.map((event) => {
                  const details = typeof event.details === 'object' && event.details !== null ? event.details as Record<string, unknown> : {};
                  const reason = typeof details.reason === 'string' ? details.reason : null;

                  return (
                    <div key={event.id} className="rounded-xl border border-border bg-background px-3 py-2">
                      <p className="text-xs font-medium text-foreground">
                        {event.action === 'document.approved' ? 'Approved' : 'Rejected'} · {new Date(event.created_at).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Actor: {event.actor_user_id ?? 'system'}</p>
                      {reason ? <p className="mt-1 text-xs text-muted-foreground">Reason: {reason}</p> : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm md:p-8">
            <MarkdownDocument markdown={doc.content_markdown} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}