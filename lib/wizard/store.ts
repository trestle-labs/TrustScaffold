'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { defaultWizardValues, type WizardData } from '@/lib/wizard/schema';
export { mergeWizardData } from '@/lib/wizard/merge-data';
import { mergeWizardData } from '@/lib/wizard/merge-data';

type WizardStore = {
  organizationId: string | null;
  currentStep: number;
  data: WizardData;
  lastGeneratedAt: string | null;
  hasHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setOrganization: (organizationId: string) => void;
  setCurrentStep: (step: number) => void;
  setData: (data: WizardData) => void;
  reset: (organizationId?: string) => void;
  markGenerated: () => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      organizationId: null,
      currentStep: 0,
      data: defaultWizardValues,
      lastGeneratedAt: null,
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      setOrganization: (organizationId) => {
        if (get().organizationId !== organizationId) {
          set({ organizationId, currentStep: 0, data: defaultWizardValues, lastGeneratedAt: null });
          return;
        }

        set({ organizationId });
      },
      setCurrentStep: (currentStep) => set({ currentStep }),
      setData: (data) => set({ data: mergeWizardData(data) }),
      reset: (organizationId) =>
        set({
          organizationId: organizationId ?? get().organizationId,
          currentStep: 0,
          data: defaultWizardValues,
          lastGeneratedAt: null,
        }),
      markGenerated: () => set({ lastGeneratedAt: new Date().toISOString() }),
    }),
    {
      name: 'trustscaffold-wizard',
      version: 8,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organizationId: state.organizationId,
        currentStep: state.currentStep,
        data: state.data,
        lastGeneratedAt: state.lastGeneratedAt,
      }),
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<WizardStore>;

        return {
          organizationId: state.organizationId ?? null,
          currentStep: state.currentStep ?? 0,
          data: mergeWizardData(state.data),
          lastGeneratedAt: state.lastGeneratedAt ?? null,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
