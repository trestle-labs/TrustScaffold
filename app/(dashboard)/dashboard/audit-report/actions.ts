'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function submitAuditReportAttestationAction(formData: FormData) {
  const context = await getDashboardContext();

  if (!context?.organization) {
    redirect('/login');
  }

  if (!['admin', 'approver', 'editor'].includes(context.organization.role)) {
    redirect('/dashboard/audit-report?error=You%20do%20not%20have%20permission%20to%20submit%20attestations');
  }

  const readiness = String(formData.get('readiness') ?? '').trim();
  const note = String(formData.get('attestation_note') ?? '').trim();

  if (!['ready', 'not-ready'].includes(readiness)) {
    redirect('/dashboard/audit-report?error=Select%20a%20report%20readiness%20status');
  }

  if (note.length < 10) {
    redirect('/dashboard/audit-report?error=Provide%20an%20attestation%20note%20(10%2B%20characters)');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('append_audit_log', {
    p_organization_id: context.organization.id,
    p_action: 'audit_report.attested',
    p_entity_type: 'organization',
    p_entity_id: context.organization.id,
    p_details: {
      readiness,
      note,
      submitted_by: context.email ?? context.userId,
      submitted_at: new Date().toISOString(),
    },
  });

  if (error) {
    redirect(`/dashboard/audit-report?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/audit-report');
  redirect('/dashboard/audit-report?success=Attestation%20submitted');
}
