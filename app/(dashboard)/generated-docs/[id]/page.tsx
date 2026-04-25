import Link from 'next/link';

import { approveGeneratedDocAction, archiveGeneratedDocAction, regenerateDocAction } from '@/app/(dashboard)/generated-docs/actions';
import { MarkdownDocument } from '@/components/documents/markdown-document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
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

  const templateRelation = Array.isArray(doc.templates) ? doc.templates[0] : doc.templates;
  const canApprove = ['admin', 'approver'].includes(context.organization.role) && doc.status !== 'approved';
  const canArchive = context.organization.role === 'admin' && doc.status !== 'archived';
  const canRegenerate = ['admin', 'editor'].includes(context.organization.role);

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
          <div className="rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm md:p-8">
            <MarkdownDocument markdown={doc.content_markdown} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}