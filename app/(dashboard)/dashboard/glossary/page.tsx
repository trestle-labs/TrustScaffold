import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { glossaryEntries } from '@/lib/glossary';

export default function GlossaryPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Glossary</CardTitle>
          <CardDescription>
            Alphabetical reference for compliance terms, workflow language, and acronyms used throughout TrustScaffold.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Definitions (A-Z)</CardTitle>
          <CardDescription>Use this page as a quick reference while completing wizard and review workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3">
            {glossaryEntries.map((entry) => (
              <div key={entry.term} className="rounded-2xl border border-border bg-card px-4 py-3">
                <dt className="text-sm font-semibold text-foreground">{entry.term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
