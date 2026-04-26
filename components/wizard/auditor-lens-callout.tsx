import { ShieldCheck } from 'lucide-react';
import { expandAcronymsInText } from '@/lib/acronyms';

type AuditorLensCalloutProps = {
  criterion: string;
  message: string;
};

export function AuditorLensCallout({ criterion, message }: AuditorLensCalloutProps) {
  const expandedCriterion = expandAcronymsInText(criterion);
  const expandedMessage = expandAcronymsInText(message);

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
      <div>
        <p className="font-medium text-blue-900">Auditor&apos;s Lens · {expandedCriterion}</p>
        <p className="mt-1 text-blue-700">{expandedMessage}</p>
      </div>
    </div>
  );
}
