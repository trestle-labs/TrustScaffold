import { NextResponse } from 'next/server';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { buildAuditReportMarkdown, buildAuditReportModel } from '@trestle-labs/core';
import { mergeWizardData } from '@trestle-labs/core';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { wizardSchema } from '@trestle-labs/core';

export async function GET() {
  const context = await getDashboardContext();

  if (!context?.organization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: draft }, { data: docs }] = await Promise.all([
    supabase
      .from('wizard_drafts')
      .select('payload')
      .eq('organization_id', context.organization.id)
      .maybeSingle(),
    supabase
      .from('generated_docs')
      .select('id, title, status, updated_at, input_payload')
      .eq('organization_id', context.organization.id)
      .order('updated_at', { ascending: false }),
  ]);

  const parsedDraft = draft?.payload ? wizardSchema.safeParse(draft.payload) : null;

  if (!parsedDraft?.success) {
    return NextResponse.json({ error: 'No saved wizard draft available' }, { status: 400 });
  }

  const current = mergeWizardData(parsedDraft.data);
  const latestBaselinePayload = docs?.find((doc) => doc.input_payload)?.input_payload;
  const parsedBaseline = latestBaselinePayload ? wizardSchema.safeParse(latestBaselinePayload) : null;
  const previous = parsedBaseline?.success ? mergeWizardData(parsedBaseline.data) : null;

  const model = buildAuditReportModel(current, docs ?? [], previous);
  const markdown = buildAuditReportMarkdown({
    organizationName: context.organization.name,
    generatedAt: new Date().toISOString(),
    model,
  });

  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `trustscaffold-audit-report-${dateStamp}.md`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}
