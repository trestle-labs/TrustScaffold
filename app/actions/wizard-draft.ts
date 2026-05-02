'use server';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { mergeWizardData } from '@/lib/wizard/merge-data';
import { wizardSchema, type WizardData } from '@/lib/wizard/schema';

const CURRENT_SCHEMA_VERSION = 9;

export type WizardDraftResult =
  | { ok: true }
  | { ok: false; error: string };

export type LoadDraftResult =
  | { ok: true; payload: WizardData; currentStep: number; updatedAt: string }
  | { ok: true; payload: null }
  | { ok: false; error: string };

export async function saveWizardDraftAction(
  rawPayload: WizardData,
  currentStep: number,
): Promise<WizardDraftResult> {
  const parsed = wizardSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid wizard payload' };
  }

  const context = await getDashboardContext();
  if (!context?.organization) {
    return { ok: false, error: 'No active organization' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('wizard_drafts')
    .upsert(
      {
        organization_id: context.organization.id,
        payload: parsed.data,
        schema_version: CURRENT_SCHEMA_VERSION,
        current_step: currentStep,
      },
      { onConflict: 'organization_id' },
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function loadWizardDraftAction(): Promise<LoadDraftResult> {
  const context = await getDashboardContext();
  if (!context?.organization) {
    return { ok: false, error: 'No active organization' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('wizard_drafts')
    .select('payload, current_step, updated_at, schema_version')
    .eq('organization_id', context.organization.id)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: true, payload: null };

  const persistedSchemaVersion = typeof data.schema_version === 'number' ? data.schema_version : 0;
  if (persistedSchemaVersion > CURRENT_SCHEMA_VERSION) {
    return { ok: true, payload: null };
  }

  const candidatePayload = persistedSchemaVersion < CURRENT_SCHEMA_VERSION
    ? mergeWizardData(data.payload as Partial<WizardData>)
    : data.payload;

  const parsed = wizardSchema.safeParse(candidatePayload);
  if (!parsed.success) return { ok: true, payload: null };

  if (persistedSchemaVersion < CURRENT_SCHEMA_VERSION) {
    await supabase
      .from('wizard_drafts')
      .update({
        payload: parsed.data,
        schema_version: CURRENT_SCHEMA_VERSION,
      })
      .eq('organization_id', context.organization.id);
  }

  return {
    ok: true,
    payload: parsed.data,
    currentStep: data.current_step ?? 0,
    updatedAt: data.updated_at,
  };
}
