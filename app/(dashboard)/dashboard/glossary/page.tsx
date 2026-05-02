'use client';

import { useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { glossaryEntries } from '@/lib/glossary';
import { getGlossarySourceTypeLabel, GLOSSARY_STAGE_ORDER } from '@/lib/glossary-display';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<'All' | string>('All');

  const availableStages = useMemo(() => {
    const found = new Set<string>();
    for (const entry of glossaryEntries) {
      for (const stage of entry.wizardStages ?? []) found.add(stage);
    }

    return GLOSSARY_STAGE_ORDER.filter((stage) => found.has(stage));
  }, []);

  const filteredEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return glossaryEntries.filter((entry) => {
      const matchesStage = selectedStage === 'All' || (entry.wizardStages ?? []).includes(selectedStage);
      if (!matchesStage) return false;

      if (!needle) return true;

      const haystack = [
        entry.term,
        entry.definition,
        entry.plainEnglishDefinition ?? '',
        entry.aliases?.join(' ') ?? '',
        entry.sourceAuthority ?? '',
        entry.frameworkTags?.join(' ') ?? '',
        entry.wizardStages?.join(' ') ?? '',
      ].join(' ').toLowerCase();

      return haystack.includes(needle);
    });
  }, [query, selectedStage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Glossary</CardTitle>
          <CardDescription>
            Alphabetical reference for compliance terms, workflow language, and acronyms used throughout TrustScaffold, with source citations where available.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Definitions (A-Z)</CardTitle>
          <CardDescription>Use this page as a quick reference while completing wizard and review workflows. External definitions are linked to their source authority.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by term, definition, framework, or stage"
              className="h-10 rounded-xl px-3"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedStage('All')}
                className={`rounded-full border px-3 py-1 text-xs ${selectedStage === 'All' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
              >
                All Stages
              </button>
              {availableStages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  className={`rounded-full border px-3 py-1 text-xs ${selectedStage === stage ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <dl className="grid gap-3">
            {filteredEntries.map((entry) => (
              <div key={entry.term} className="rounded-2xl border border-border bg-card px-4 py-3">
                <dt className="text-sm font-semibold text-foreground">{entry.term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{entry.definition}</dd>
                {entry.plainEnglishDefinition ? (
                  <dd className="mt-1 text-xs text-muted-foreground">Plain-English: {entry.plainEnglishDefinition}</dd>
                ) : null}
                {entry.frameworkTags?.length ? (
                  <dd className="mt-2 text-xs text-muted-foreground">Frameworks: {entry.frameworkTags.join(', ')}</dd>
                ) : null}
                {entry.wizardStages?.length ? (
                  <dd className="mt-1 text-xs text-muted-foreground">Wizard stages: {entry.wizardStages.join(', ')}</dd>
                ) : null}
                {entry.sourceAuthority ? (
                  <dd className="mt-1 text-xs text-muted-foreground">
                    Source: {getGlossarySourceTypeLabel(entry.sourceType)} - {entry.sourceAuthority}
                    {entry.sourceUrl ? (
                      <>
                        {' '}
                        <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                          reference link
                        </a>
                      </>
                    ) : null}
                  </dd>
                ) : null}
                {entry.trustScaffoldInterpretation ? (
                  <dd className="mt-1 text-xs text-muted-foreground">TrustScaffold interpretation: {entry.trustScaffoldInterpretation}</dd>
                ) : null}
              </div>
            ))}
            {filteredEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                No glossary entries matched this search/filter yet.
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
