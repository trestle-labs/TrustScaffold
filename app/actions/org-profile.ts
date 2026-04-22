'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { wizardSchema, type WizardData } from '@/lib/wizard/schema';

const SCHEMA_VERSION = 6;

function str(formData: FormData, key: string, fallback: string): string {
  const val = formData.get(key);
  return typeof val === 'string' ? val : fallback;
}

export async function updateOrgProfileAction(formData: FormData): Promise<void> {
  const context = await getDashboardContext();
  if (!context?.organization) redirect('/login');

  if (!['admin', 'editor'].includes(context.organization.role)) {
    redirect('/settings?error=Only+admins+and+editors+can+update+the+org+profile');
  }

  const supabase = await createSupabaseServerClient();
  const { data: draft } = await supabase
    .from('wizard_drafts')
    .select('payload, current_step')
    .eq('organization_id', context.organization.id)
    .maybeSingle();

  if (!draft?.payload) {
    redirect('/settings?error=Complete+the+wizard+first+to+establish+your+org+profile');
  }

  const current = draft.payload as WizardData;

  const updated: WizardData = {
    ...current,
    company: {
      ...current.company,
      primaryContactName: str(formData, 'primaryContactName', current.company.primaryContactName),
      primaryContactEmail: str(formData, 'primaryContactEmail', current.company.primaryContactEmail),
      complianceMaturity: (str(formData, 'complianceMaturity', current.company.complianceMaturity) as WizardData['company']['complianceMaturity']),
      targetAuditType: (str(formData, 'targetAuditType', current.company.targetAuditType) as WizardData['company']['targetAuditType']),
    },
    governance: {
      ...current.governance,
      securityOfficerTitle: str(formData, 'securityOfficerTitle', current.governance.securityOfficerTitle ?? ''),
    },
    infrastructure: {
      ...current.infrastructure,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      idpProvider: str(formData, 'idpProvider', current.infrastructure.idpProvider ?? '') as any,
    },
    securityTooling: {
      ...current.securityTooling,
      siemTool: str(formData, 'siemTool', current.securityTooling.siemTool ?? ''),
      endpointProtectionTool: str(formData, 'endpointProtectionTool', current.securityTooling.endpointProtectionTool ?? ''),
      monitoringTool: str(formData, 'monitoringTool', current.securityTooling.monitoringTool ?? ''),
      vulnerabilityScanningTool: str(formData, 'vulnerabilityScanningTool', current.securityTooling.vulnerabilityScanningTool ?? ''),
    },
    operations: {
      ...current.operations,
      ticketingSystem: str(formData, 'ticketingSystem', current.operations.ticketingSystem ?? ''),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hrisProvider: str(formData, 'hrisProvider', current.operations.hrisProvider ?? '') as any,
      onCallTool: str(formData, 'onCallTool', current.operations.onCallTool ?? ''),
      versionControlSystem: str(formData, 'versionControlSystem', current.operations.versionControlSystem ?? ''),
    },
  };

  const parsed = wizardSchema.safeParse(updated);
  if (!parsed.success) {
    redirect(`/settings?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Invalid profile data')}`);
  }

  const { error } = await supabase
    .from('wizard_drafts')
    .upsert(
      {
        organization_id: context.organization.id,
        payload: parsed.data,
        schema_version: SCHEMA_VERSION,
        current_step: draft.current_step ?? 0,
      },
      { onConflict: 'organization_id' },
    );

  if (error) redirect(`/settings?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/generated-docs');
  revalidatePath('/settings');
  redirect('/settings?success=Org+profile+updated.+Documents+will+be+flagged+as+stale+until+regenerated.');
}
