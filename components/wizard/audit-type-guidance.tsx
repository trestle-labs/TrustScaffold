'use client';

import { ArrowRight, Clock, FileCheck, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { expandAcronymsInText } from '@/lib/acronyms';
import { cn } from '@/lib/utils';
import type { ComplianceMaturity, OrgAge, TargetAuditType } from '@trestle-labs/core';

// ── Recommendation logic ─────────────────────────────────────────────────────

export function recommendAuditType(maturity: ComplianceMaturity, orgAge: OrgAge): TargetAuditType {
  if (maturity === 'first-time') return 'type1';
  if (maturity === 'some-experience' && (orgAge === '<1' || orgAge === '1-3')) return 'type1';
  return 'type2';
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface AuditTypeCardProps {
  type: 'type1' | 'type2';
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}

const TYPE_META = {
  type1: {
    label: 'SOC 2 Type I',
    tagline: 'Point-in-time design assessment',
    timeline: '3–6 months to prepare',
    icon: FileCheck,
    color: 'emerald',
    whatAuditorsTest: 'Whether your controls are suitably designed and in place as of a specific date.',
    whenItFits: [
      'You are establishing your control environment for the first time',
      'Your key policies and procedures were recently put in place',
      'A customer or prospect needs assurance quickly and will accept Type I as a starting point',
      'You plan to follow up with a Type II within 12–18 months',
    ],
    notIdealWhen: 'Enterprise customers, regulated industries, or government contracts almost always require Type II.',
    typicalCost: '$15,000–$40,000',
    auditPeriod: 'A single date (e.g., December 31, 2025)',
  },
  type2: {
    label: 'SOC 2 Type II',
    tagline: 'Period-of-time operating effectiveness',
    timeline: '6–18 months to prepare',
    icon: ShieldCheck,
    color: 'blue',
    whatAuditorsTest: 'Whether your controls operated effectively over a defined period (typically 6–12 months).',
    whenItFits: [
      'Your controls have been operating for at least 6 months',
      'Enterprise customers, financial services, or healthcare prospects require it',
      'You have already completed a Type I or internal readiness assessment',
      'You want the strongest possible assurance for sales and procurement',
    ],
    notIdealWhen: 'Controls implemented very recently — auditors cannot test effectiveness if the practice only started last month.',
    typicalCost: '$30,000–$100,000+',
    auditPeriod: 'A rolling window (e.g., Jan 1 – Dec 31, 2025)',
  },
} as const;

function AuditTypeCard({ type, selected, recommended, onSelect }: AuditTypeCardProps) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  const colorSelected = meta.color === 'emerald'
    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
    : 'border-blue-500 bg-blue-50 ring-1 ring-blue-500';
  const colorIdle = 'border-border bg-white hover:bg-secondary/30';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full flex-col gap-4 rounded-2xl border p-5 text-left transition-all',
        selected ? colorSelected : colorIdle
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', meta.color === 'emerald' ? 'text-emerald-600' : 'text-blue-600')} />
            <p className="text-sm font-semibold text-foreground">{expandAcronymsInText(meta.label)}</p>
            {recommended && (
              <Badge className={cn('text-[10px] px-1.5 py-0', meta.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}>
                Recommended
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{expandAcronymsInText(meta.tagline)}</p>
        </div>
        <div className={cn(
          'h-4 w-4 shrink-0 rounded-full border-2 mt-0.5',
          selected
            ? meta.color === 'emerald' ? 'border-emerald-500 bg-emerald-500' : 'border-blue-500 bg-blue-500'
            : 'border-muted-foreground/40'
        )} />
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <p className="font-medium text-foreground">What auditors test</p>
          <p className="text-muted-foreground">{expandAcronymsInText(meta.whatAuditorsTest)}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Audit period</p>
          <p className="text-muted-foreground">{expandAcronymsInText(meta.auditPeriod)}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Typical preparation
          </p>
          <p className="text-muted-foreground">{expandAcronymsInText(meta.timeline)}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Typical cost range</p>
          <p className="text-muted-foreground">{expandAcronymsInText(meta.typicalCost)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">This fits your situation when:</p>
        <ul className="space-y-1">
          {meta.whenItFits.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" />
              {expandAcronymsInText(item)}
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-[11px] text-amber-700">
        <span className="font-medium">Not ideal when: </span>{expandAcronymsInText(meta.notIdealWhen)}
      </p>
    </button>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

interface AuditTypeGuidanceProps {
  value: TargetAuditType;
  maturity: ComplianceMaturity;
  orgAge: OrgAge;
  onChange: (v: TargetAuditType) => void;
}

export function AuditTypeGuidance({ value, maturity, orgAge, onChange }: AuditTypeGuidanceProps) {
  const recommendation = recommendAuditType(maturity, orgAge);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{expandAcronymsInText('Which SOC 2 audit type are you targeting?')}</p>
        <p className="text-xs text-muted-foreground">
          {expandAcronymsInText('This affects the System Description template and timeline recommendations.')}
          {' '}
          {expandAcronymsInText('Based on your maturity and org age, we\'ve pre-selected a recommendation — you can override it.')}
        </p>
      </div>

      {/* Path diagram */}
      <div className="flex items-center gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{expandAcronymsInText('Typical path:')}</span>
        <span>Policies &amp; procedures established</span>
        <ArrowRight className="h-3 w-3 shrink-0" />
        <span>{expandAcronymsInText('Type I audit (design)')}</span>
        <ArrowRight className="h-3 w-3 shrink-0" />
        <span>6–12 months operating</span>
        <ArrowRight className="h-3 w-3 shrink-0" />
        <span>{expandAcronymsInText('Type II audit (effectiveness)')}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AuditTypeCard
          type="type1"
          selected={value === 'type1'}
          recommended={recommendation === 'type1'}
          onSelect={() => onChange('type1')}
        />
        <AuditTypeCard
          type="type2"
          selected={value === 'type2'}
          recommended={recommendation === 'type2'}
          onSelect={() => onChange('type2')}
        />
      </div>

      <button
        type="button"
        onClick={() => onChange('unsure')}
        className={cn(
          'w-full rounded-2xl border border-dashed px-4 py-2.5 text-xs transition-colors',
          value === 'unsure'
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border text-muted-foreground hover:border-muted-foreground/50'
        )}
      >
        I&apos;m not sure yet — generate documentation that works for either audit type
      </button>

      {value === 'unsure' && (
        <p className="rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          {expandAcronymsInText('The generated policies will be written to satisfy both Type I and Type II requirements.')}
          {' '}
          {expandAcronymsInText('You can revisit this decision once you have spoken with an auditor or CPA firm.')}
        </p>
      )}
    </div>
  );
}
