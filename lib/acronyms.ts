type AcronymReplacementRule = {
  shortForm: string;
  longForm: string;
  regex: RegExp;
};

const ACRONYM_RULES: AcronymReplacementRule[] = [
  {
    shortForm: 'AWS',
    longForm: 'Amazon Web Services',
    regex: /\bAWS\b(?!\s*\()/g,
  },
  {
    shortForm: 'GCP',
    longForm: 'Google Cloud Platform',
    regex: /\bGCP\b(?!\s*\()/g,
  },
  {
    shortForm: 'SOC 2',
    longForm: 'System and Organization Controls 2',
    regex: /\bSOC 2\b(?!\s*\()/g,
  },
  {
    shortForm: 'SOC 1',
    longForm: 'System and Organization Controls 1',
    regex: /\bSOC 1\b(?!\s*\()/g,
  },
  {
    shortForm: 'HRIS',
    longForm: 'Human Resources Information System',
    regex: /\bHRIS\b(?!\s*\()/g,
  },
  {
    shortForm: 'TSC',
    longForm: 'Trust Services Criteria',
    regex: /\bTSC\b(?!\s*\()/g,
  },
  {
    shortForm: 'PII',
    longForm: 'Personally Identifiable Information',
    regex: /\bPII\b(?!\s*\()/g,
  },
  {
    shortForm: 'PHI',
    longForm: 'Protected Health Information',
    regex: /\bPHI\b(?!\s*\()/g,
  },
  {
    shortForm: 'PCI',
    longForm: 'Payment Card Industry',
    regex: /\bPCI\b(?!\s*\()/g,
  },
  {
    shortForm: 'CDE',
    longForm: 'Cardholder Data Environment',
    regex: /\bCDE\b(?!\s*\()/g,
  },
  {
    shortForm: 'GDPR',
    longForm: 'General Data Protection Regulation',
    regex: /\bGDPR\b(?!\s*\()/g,
  },
  {
    shortForm: 'CCPA',
    longForm: 'California Consumer Privacy Act',
    regex: /\bCCPA\b(?!\s*\()/g,
  },
  {
    shortForm: 'CPRA',
    longForm: 'California Privacy Rights Act',
    regex: /\bCPRA\b(?!\s*\()/g,
  },
  {
    shortForm: 'PIPEDA',
    longForm: 'Personal Information Protection and Electronic Documents Act',
    regex: /\bPIPEDA\b(?!\s*\()/g,
  },
  {
    shortForm: 'DSAR',
    longForm: 'Data Subject Access Request',
    regex: /\bDSAR\b(?!\s*\()/g,
  },
  {
    shortForm: 'MFA',
    longForm: 'Multi-Factor Authentication',
    regex: /\bMFA\b(?!\s*\()/g,
  },
  {
    shortForm: 'SSO',
    longForm: 'Single Sign-On',
    regex: /\bSSO\b(?!\s*\()/g,
  },
  {
    shortForm: 'IdP',
    longForm: 'Identity Provider',
    regex: /\bIdP\b(?!\s*\()/g,
  },
  {
    shortForm: 'VCS',
    longForm: 'Version Control System',
    regex: /\bVCS\b(?!\s*\()/g,
  },
  {
    shortForm: 'CI/CD',
    longForm: 'Continuous Integration and Continuous Delivery',
    regex: /\bCI\/CD\b(?!\s*\()/g,
  },
  {
    shortForm: 'SLA',
    longForm: 'Service Level Agreement',
    regex: /\bSLA\b(?!\s*\()/g,
  },
  {
    shortForm: 'RTO',
    longForm: 'Recovery Time Objective',
    regex: /\bRTO\b(?!\s*\()/g,
  },
  {
    shortForm: 'RPO',
    longForm: 'Recovery Point Objective',
    regex: /\bRPO\b(?!\s*\()/g,
  },
  {
    shortForm: 'NDA',
    longForm: 'Non-Disclosure Agreement',
    regex: /\bNDA\b(?!\s*\()/g,
  },
  {
    shortForm: 'API',
    longForm: 'Application Programming Interface',
    regex: /\bAPI\b(?!\s*\()/g,
  },
  {
    shortForm: 'URL',
    longForm: 'Uniform Resource Locator',
    regex: /\bURL\b(?!\s*\()/g,
  },
  {
    shortForm: 'FIM',
    longForm: 'File Integrity Monitoring',
    regex: /\bFIM\b(?!\s*\()/g,
  },
] as const;

export function expandAcronymsInText(text: string | null | undefined): string {
  if (!text) {
    return '';
  }

  let expanded = text;
  for (const rule of ACRONYM_RULES) {
    expanded = expanded.replace(rule.regex, `${rule.longForm} (${rule.shortForm})`);
  }

  return expanded;
}

export const acronymGlossary = ACRONYM_RULES.map((rule) => ({
  shortForm: rule.shortForm,
  longForm: rule.longForm,
}));
