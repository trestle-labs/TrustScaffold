import type { Route } from 'next';
import Link from 'next/link';

import {
  archiveSelectedGeneratedDocsAction,
  exportToAzureDevOpsFromDashboardAction,
  exportToGithubFromDashboardAction,
  regenerateAllDocsAction,
} from '@/app/(dashboard)/generated-docs/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cn } from '@/lib/utils';

function statusBadgeClass(status: string) {
  if (status === 'approved') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (status === 'archived') {
    return 'bg-slate-200 text-slate-700';
  }

  return 'bg-amber-100 text-amber-700';
}

function documentActionLabel(status: string) {
  if (status === 'approved') {
    return 'View approved document';
  }

  if (status === 'archived') {
    return 'View archived document';
  }

  return 'Review and approve';
}

function documentCardClass(status: string) {
  if (status === 'approved') {
    return 'border-emerald-200 bg-emerald-50/55 dark:border-emerald-900 dark:bg-emerald-950/20';
  }

  if (status === 'archived') {
    return 'border-slate-200 bg-slate-50/70 opacity-80 dark:border-slate-800 dark:bg-slate-950/20';
  }

  return 'border-border bg-card';
}

export default async function GeneratedDocsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await getDashboardContext();

  if (!context?.organization) {
    return null;
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const successMessage = typeof resolvedSearchParams.success === 'string' ? resolvedSearchParams.success : null;
  const errorMessage = typeof resolvedSearchParams.error === 'string' ? resolvedSearchParams.error : null;
  const isAdmin = context.organization.role === 'admin';


  const supabase = await createSupabaseServerClient();
  const [{ data: docs, error }, { data: draft }] = await Promise.all([
    supabase
      .from('generated_docs')
      .select('id, title, file_name, status, version, updated_at, content_markdown, committed_to_repo, pr_url, templates(name, slug)')
      .eq('organization_id', context.organization.id)
      .order('updated_at', { ascending: false }),
    supabase
      .from('wizard_drafts')
      .select('updated_at')
      .eq('organization_id', context.organization.id)
      .maybeSingle(),
  ]);

  if (error) {
    throw new Error(`Unable to load generated docs: ${error.message}`);
  }

  const draftUpdatedAt = draft?.updated_at ? new Date(draft.updated_at) : null;
  const staleDocs = draftUpdatedAt && docs
    ? docs.filter((doc) => doc.status !== 'archived' && new Date(doc.updated_at) < draftUpdatedAt)
    : [];

  const draftCount = docs?.filter((doc) => doc.status === 'draft').length ?? 0;
  const approvedCount = docs?.filter((doc) => doc.status === 'approved').length ?? 0;
  const archivedCount = docs?.filter((doc) => doc.status === 'archived').length ?? 0;
  const canRegenerate = ['admin', 'editor'].includes(context.organization.role);
  const draftDocs = docs?.filter((doc) => doc.status === 'draft') ?? [];
  const approvedDocs = docs?.filter((doc) => doc.status === 'approved') ?? [];
  const archivedDocs = docs?.filter((doc) => doc.status === 'archived') ?? [];
  const documentSections = [
    {
      id: 'drafts',
      title: 'Drafts Awaiting Review',
      description: 'Open a draft to inspect, approve, regenerate, or archive it. Raw Markdown is collapsed so the list stays easy to scan.',
      docs: draftDocs,
      wrapperClassName: 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/15',
      countClassName: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    },
    {
      id: 'approved',
      title: 'Approved For Export',
      description: 'Approved documents are locked for export and shown separately from drafts.',
      docs: approvedDocs,
      wrapperClassName: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/15',
      countClassName: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    },
    {
      id: 'archived',
      title: 'Archived Documents',
      description: 'Archived documents are excluded from active review and export.',
      docs: archivedDocs,
      wrapperClassName: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/20',
      countClassName: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
    },
  ].filter((section) => section.docs.length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Generated Documents</CardTitle>
            <CardDescription>
              Review each generated artifact individually. Drafts move to approved status only from the document review page.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/wizard">Open Policy Wizard</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage ? <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary">{successMessage}</p> : null}
          {errorMessage ? <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMessage}</p> : null}
          {staleDocs.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-amber-800">Org profile updated since last generation</p>
                <p className="text-xs text-amber-700">
                  {staleDocs.length} document{staleDocs.length === 1 ? '' : 's'} may be out of date. Last profile update: {draftUpdatedAt ? draftUpdatedAt.toLocaleString() : ''}
                </p>
              </div>
              {canRegenerate ? (
                <form action={regenerateAllDocsAction}>
                  <Button type="submit" size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                    Update All Documents
                  </Button>
                </form>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary">Draft: {draftCount}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700">Approved: {approvedCount}</Badge>
            <Badge className="bg-slate-200 text-slate-700">Archived: {archivedCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {!docs?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No generated drafts yet</CardTitle>
            <CardDescription>Run the wizard and click generate to persist your first set of policy drafts.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <form className="space-y-4">
          {isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bulk Actions</CardTitle>
                <CardDescription>
                  Select drafts to archive, or export approved documents after configuring a repository integration in Settings. Approval is intentionally document-by-document.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm font-semibold text-foreground">Approval workflow</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Open a document with Review and approve, inspect the rendered policy, then approve that individual document. TrustScaffold does not bulk approve generated drafts.
                  </p>
                </div>
                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-secondary/25 p-4">
                    <p className="text-sm font-semibold text-foreground">Archive selected</p>
                    <p className="mt-1 text-xs text-muted-foreground">Moves only checked documents out of the active draft list. If nothing is checked, no documents are archived and you will see a selection error.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/25 p-4">
                    <p className="text-sm font-semibold text-foreground">Export approved to GitHub</p>
                    <p className="mt-1 text-xs text-muted-foreground">Creates or updates a pull request with approved documents. If GitHub is not configured, the page returns a setup error and leaves documents unchanged.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/25 p-4">
                    <p className="text-sm font-semibold text-foreground">Export approved to Azure DevOps</p>
                    <p className="mt-1 text-xs text-muted-foreground">Creates or updates an Azure DevOps pull request with approved documents. If Azure DevOps is not configured, the page returns a setup error and leaves documents unchanged.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" variant="outline" formAction={archiveSelectedGeneratedDocsAction}>Archive selected</Button>
                  <Button type="submit" formAction={exportToGithubFromDashboardAction} disabled={approvedCount === 0}>Export approved to GitHub</Button>
                  <Button type="submit" variant="secondary" formAction={exportToAzureDevOpsFromDashboardAction} disabled={approvedCount === 0}>Export approved to Azure DevOps</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {approvedCount === 0
                    ? 'Approve at least one document before exporting. Once approved documents exist, export actions include every approved document unless you select a smaller approved subset.'
                    : 'Export actions include every approved document unless you select a smaller approved subset. Draft documents remain visible until you approve them from the individual document view.'}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-6">
            {documentSections.map((section) => (
              <section key={section.id} className={cn('rounded-3xl border p-4 shadow-sm', section.wrapperClassName)}>
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                    <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  <Badge className={section.countClassName}>{section.docs.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {section.docs.map((doc) => {
                    const templateRelation = Array.isArray(doc.templates) ? doc.templates[0] : doc.templates;

                    return (
                      <Card key={doc.id} className={cn('shadow-sm backdrop-blur-0', documentCardClass(doc.status))}>
                        <CardHeader className="gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                          <div className="flex min-w-0 flex-1 gap-3">
                            {isAdmin ? (
                              <div className="pt-1">
                                <input
                                  type="checkbox"
                                  name="selected_doc_ids"
                                  value={doc.id}
                                  aria-label={`Select ${doc.title}`}
                                  className="h-5 w-5 rounded border border-primary/30 accent-primary"
                                />
                              </div>
                            ) : null}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-base leading-snug sm:text-lg">
                                  <Link className="text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:decoration-primary" href={`/generated-docs/${doc.id}` as Route}>{doc.title}</Link>
                                </CardTitle>
                                <Badge className={statusBadgeClass(doc.status)}>{doc.status}</Badge>
                                <Badge variant="secondary">v{doc.version}</Badge>
                                {doc.committed_to_repo ? <Badge variant="outline">Exported</Badge> : null}
                              </div>
                              <CardDescription className="mt-1 break-all">{doc.file_name}</CardDescription>
                              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Updated {new Date(doc.updated_at).toLocaleString()} · Template {templateRelation?.name ?? 'Unknown'}
                              </p>
                              {doc.pr_url ? (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Pull request: <a className="text-primary underline-offset-4 hover:underline" href={doc.pr_url} target="_blank" rel="noreferrer">{doc.pr_url}</a>
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-background/70 p-3 sm:w-72">
                            <p className="text-sm font-semibold text-foreground">Document-level approval</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.status === 'draft'
                                ? 'Review the rendered document, then approve or archive it.'
                                : doc.status === 'approved'
                                  ? 'Approved and eligible for export.'
                                  : 'Archived and excluded from active export.'}
                            </p>
                            <Button asChild size="sm" variant={doc.status === 'draft' ? 'default' : 'secondary'}>
                              <Link href={`/generated-docs/${doc.id}` as Route}>{documentActionLabel(doc.status)}</Link>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0">
                          <details className="rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm">
                            <summary className="cursor-pointer select-none font-medium text-muted-foreground transition-colors hover:text-foreground">
                              Show raw Markdown preview
                            </summary>
                            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-secondary/50 p-4 text-xs whitespace-pre-wrap text-foreground">
                              {doc.content_markdown}
                            </pre>
                          </details>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
