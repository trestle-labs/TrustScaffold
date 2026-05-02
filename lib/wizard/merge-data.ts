import { defaultWizardValues, type WizardData } from '@/lib/wizard/schema';

export function mergeWizardData(data: Partial<WizardData> | undefined): WizardData {
  const defaultSubservice: WizardData['subservices'][number] = {
    name: '',
    description: '',
    role: '',
    dataShared: '',
    reviewCadence: 'annual',
    hasAssuranceReport: false,
    assuranceReportType: 'none',
    controlInclusion: 'carve-out',
  };

  return {
    ...defaultWizardValues,
    ...data,
    company: {
      ...defaultWizardValues.company,
      ...data?.company,
    },
    governance: {
      ...defaultWizardValues.governance,
      ...data?.governance,
      iso27001: {
        ...defaultWizardValues.governance.iso27001,
        ...data?.governance?.iso27001,
      },
      sox: {
        ...defaultWizardValues.governance.sox,
        ...data?.governance?.sox,
      },
    },
    training: {
      ...defaultWizardValues.training,
      ...data?.training,
    },
    scope: {
      ...defaultWizardValues.scope,
      ...data?.scope,
      hipaa: {
        ...defaultWizardValues.scope.hipaa,
        ...data?.scope?.hipaa,
      },
      pci: {
        ...defaultWizardValues.scope.pci,
        ...data?.scope?.pci,
      },
    },
    tscSelections: {
      ...defaultWizardValues.tscSelections,
      ...data?.tscSelections,
    },
    infrastructure: {
      ...defaultWizardValues.infrastructure,
      ...data?.infrastructure,
    },
    subservices: Array.isArray(data?.subservices) && data.subservices.length > 0
      ? data.subservices.map((subservice) => ({
          ...defaultSubservice,
          ...subservice,
        }))
      : defaultWizardValues.subservices,
    securityTooling: {
      ...defaultWizardValues.securityTooling,
      ...data?.securityTooling,
    },
    operations: {
      ...defaultWizardValues.operations,
      ...data?.operations,
      riskProgram: {
        ...defaultWizardValues.operations.riskProgram,
        ...data?.operations?.riskProgram,
      },
      incidentResponse: {
        ...defaultWizardValues.operations.incidentResponse,
        ...data?.operations?.incidentResponse,
      },
    },
    securityAssessment: {
      documentReview: {
        ...defaultWizardValues.securityAssessment.documentReview,
        ...data?.securityAssessment?.documentReview,
      },
      logReview: {
        ...defaultWizardValues.securityAssessment.logReview,
        ...data?.securityAssessment?.logReview,
      },
      rulesetReview: {
        ...defaultWizardValues.securityAssessment.rulesetReview,
        ...data?.securityAssessment?.rulesetReview,
      },
      configReview: {
        ...defaultWizardValues.securityAssessment.configReview,
        ...data?.securityAssessment?.configReview,
      },
      networkAnalysis: {
        ...defaultWizardValues.securityAssessment.networkAnalysis,
        ...data?.securityAssessment?.networkAnalysis,
      },
      fileIntegrity: {
        ...defaultWizardValues.securityAssessment.fileIntegrity,
        ...data?.securityAssessment?.fileIntegrity,
      },
    },
  };
}
