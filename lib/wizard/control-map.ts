import { selectedTscLabels, type WizardData } from '@/lib/wizard/schema';

export type ControlMapNodeType = 'answer' | 'framework' | 'control' | 'subservice' | 'document';

export type ControlMapNode = {
  id: string;
  label: string;
  type: ControlMapNodeType;
  stage: string;
  description?: string;
};

export type ControlMapEdge = {
  from: string;
  to: string;
  label: string;
};

export type ControlMapGraph = {
  nodes: ControlMapNode[];
  edges: ControlMapEdge[];
};

export type ControlMapDocument = {
  id: string;
  title: string;
  status: string;
};

function boolLabel(value: boolean) {
  return value ? 'Yes' : 'No';
}

export function buildControlMapGraph(data: WizardData, docs: ControlMapDocument[]): ControlMapGraph {
  const nodeMap = new Map<string, ControlMapNode>();
  const edges: ControlMapEdge[] = [];

  function addNode(node: ControlMapNode) {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, node);
    }
  }

  function addEdge(from: string, to: string, label: string) {
    edges.push({ from, to, label });
  }

  function addAnswer(id: string, stage: string, label: string, description: string) {
    addNode({ id, type: 'answer', stage, label, description });
  }

  function addFramework(id: string, label: string, description?: string) {
    addNode({ id, type: 'framework', stage: 'Cross-stage', label, description });
  }

  function addControl(id: string, label: string, description?: string) {
    addNode({ id, type: 'control', stage: 'Cross-stage', label, description });
  }

  function addSubservice(id: string, label: string, description?: string) {
    addNode({ id, type: 'subservice', stage: 'Sub-service Organizations', label, description });
  }

  function addDocument(id: string, label: string, status: string) {
    addNode({ id, type: 'document', stage: 'Generated Docs', label, description: `Status: ${status}` });
  }

  addFramework('framework-soc2', 'SOC 2 Trust Services Criteria', 'Core framework used by TrustScaffold');

  addAnswer(
    'answer-phi',
    'System Scope',
    `Contains PHI: ${boolLabel(data.scope.containsPhi)}`,
    'Controls whether HIPAA-aligned controls and language are required.'
  );
  if (data.scope.containsPhi) {
    addFramework('framework-hipaa', 'HIPAA Security Rule', 'Administrative, technical, and physical safeguards');
    addControl('control-hipaa-workforce', 'PHI workforce access governance');
    addControl('control-hipaa-incident', 'PHI incident escalation');
    addEdge('answer-phi', 'framework-hipaa', 'Triggers healthcare safeguards');
    addEdge('framework-hipaa', 'control-hipaa-workforce', 'Requires');
    addEdge('framework-hipaa', 'control-hipaa-incident', 'Requires');
  }

  addAnswer(
    'answer-cde',
    'System Scope',
    `Has CDE: ${boolLabel(data.scope.hasCardholderDataEnvironment)}`,
    'Controls whether PCI-focused controls are required.'
  );
  if (data.scope.hasCardholderDataEnvironment) {
    addFramework('framework-pci', 'PCI DSS', 'Cardholder data environment protection and segmentation');
    addControl('control-pci-segmentation', 'CDE segmentation and boundary control');
    addControl('control-pci-admin', 'Privileged access hardening for CDE');
    addEdge('answer-cde', 'framework-pci', 'Triggers cardholder controls');
    addEdge('framework-pci', 'control-pci-segmentation', 'Requires');
    addEdge('framework-pci', 'control-pci-admin', 'Requires');
  }

  addAnswer(
    'answer-mfa',
    'Operations',
    `Requires MFA: ${boolLabel(data.operations.requiresMfa)}`,
    'Defines identity assurance baseline for administrative and remote access.'
  );
  addControl('control-mfa', 'Multi-factor authentication enforcement');
  addEdge('answer-mfa', 'control-mfa', data.operations.requiresMfa ? 'Enabled by answer' : 'Gap to close');

  addAnswer(
    'answer-peer-review',
    'Operations',
    `Peer review required: ${boolLabel(data.operations.requiresPeerReview)}`,
    'Impacts change management control strength.'
  );
  addControl('control-change-review', 'Documented peer review for production changes');
  addEdge('answer-peer-review', 'control-change-review', data.operations.requiresPeerReview ? 'Control asserted' : 'Control weakened');

  addAnswer(
    'answer-risk-register',
    'Operations',
    `Risk register: ${boolLabel(data.operations.hasRiskRegister)}`,
    'Shows whether formal risk identification and tracking is present.'
  );
  addControl('control-risk-register', 'Risk register and periodic review');
  addEdge('answer-risk-register', 'control-risk-register', data.operations.hasRiskRegister ? 'Implemented' : 'Missing evidence');

  addAnswer(
    'answer-internal-audit',
    'Governance',
    `Internal audit program: ${boolLabel(data.governance.hasInternalAuditProgram)}`,
    'Maps to monitoring and governance oversight expectations.'
  );
  addControl('control-control-monitoring', 'Control monitoring and internal audit cadence');
  addEdge('answer-internal-audit', 'control-control-monitoring', data.governance.hasInternalAuditProgram ? 'Implemented' : 'Compensating process needed');

  const selectedTsc = selectedTscLabels(data);
  addAnswer(
    'answer-tsc',
    'Trust Services Criteria',
    `Selected TSC: ${selectedTsc.length ? selectedTsc.join(', ') : 'Security only'}`,
    'Determines which trust criteria are reflected in generated artifacts.'
  );

  selectedTsc.forEach((criterion) => {
    const key = criterion.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const frameworkId = `framework-tsc-${key}`;
    const controlId = `control-tsc-${key}`;
    addFramework(frameworkId, `SOC 2 ${criterion}`);
    addControl(controlId, `${criterion} control narrative`);
    addEdge('answer-tsc', frameworkId, 'Selected criterion');
    addEdge(frameworkId, controlId, 'Adds control obligations');
    addEdge(frameworkId, 'framework-soc2', 'Part of SOC 2');
  });

  const usableSubservices = data.subservices.filter((subservice) => subservice.name.trim().length > 0);
  if (usableSubservices.length > 0) {
    addControl('control-vendor-oversight', 'Sub-service vendor oversight and assurance collection');
  }

  usableSubservices.forEach((subservice, index) => {
    const id = `subservice-${index}`;
    const report = subservice.hasAssuranceReport ? `Assurance: ${subservice.assuranceReportType}` : 'No assurance report documented';
    addSubservice(id, subservice.name, `${subservice.role || 'Unspecified role'} · ${report}`);
    addAnswer(
      `answer-subservice-${index}`,
      'Sub-service Organizations',
      `${subservice.name} (${subservice.controlInclusion})`,
      'Defines whether controls are inclusive or carve-out for this provider.'
    );
    addEdge(`answer-subservice-${index}`, id, 'Declared relationship');
    addEdge(id, 'control-vendor-oversight', 'Requires ongoing review');

    if (subservice.controlInclusion === 'inclusive') {
      addEdge(id, 'framework-soc2', 'Controls included in scope');
    } else {
      addEdge(id, 'framework-soc2', 'Carve-out with complementary controls');
    }
  });

  const publishableDocs = docs.filter((doc) => doc.status !== 'archived').slice(0, 12);
  publishableDocs.forEach((doc) => {
    const docId = `doc-${doc.id}`;
    addDocument(docId, doc.title, doc.status);

    if (data.scope.containsPhi) {
      addEdge('framework-hipaa', docId, 'Reflected in policy language');
    }

    if (data.scope.hasCardholderDataEnvironment) {
      addEdge('framework-pci', docId, 'Reflected in policy language');
    }

    addEdge('framework-soc2', docId, 'Baseline governance language');
    addEdge('control-mfa', docId, 'Operational control text');
    addEdge('control-change-review', docId, 'Change management text');
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}
