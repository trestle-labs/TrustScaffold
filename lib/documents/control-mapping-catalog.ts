export type ControlMappingDescriptor = {
  title: string;
  description: string;
};

const EXTERNAL_CONTROL_MAPPING_CATALOG: Record<string, ControlMappingDescriptor> = {
  COMMON: {
    title: 'Common Baseline Controls',
    description: 'Shared control language intended to be reused across multiple compliance frameworks.',
  },
  SOX: {
    title: 'Sarbanes-Oxley (SOX) Controls',
    description: 'Control language mapped to SOX / IT General Controls reporting and financial control expectations.',
  },
  'PCI-DSS': {
    title: 'PCI DSS Controls',
    description: 'Control language mapped to Payment Card Industry Data Security Standard requirements.',
  },
  HIPAA: {
    title: 'HIPAA Security Rule Controls',
    description: 'Control language mapped to HIPAA administrative, physical, and technical safeguard expectations.',
  },
  NIST: {
    title: 'NIST Control References',
    description: 'Control language mapped to NIST control families used for security and risk governance.',
  },
  FFIEC: {
    title: 'FFIEC Control References',
    description: 'Control language mapped to FFIEC expectations for financial institutions and IT governance.',
  },
};

export function describeExternalControlMapping(code: string): ControlMappingDescriptor {
  const normalizedCode = code.trim().toUpperCase();
  const catalogMatch = EXTERNAL_CONTROL_MAPPING_CATALOG[normalizedCode];

  if (catalogMatch) {
    return catalogMatch;
  }

  return {
    title: `${code} Mapping Tag`,
    description: 'Control language mapping tag declared in this document frontmatter for framework-level review.',
  };
}
