type ParsedSection = {
  title: string;
  key: string;
  content: string;
};

export type SectionChange = {
  title: string;
  previousContent: string;
  currentContent: string;
  changeType: 'changed' | 'added' | 'removed';
};

export type SectionDiffSummary = {
  changedSections: SectionChange[];
  unchangedCount: number;
};

const FRONTMATTER_PATTERN = /^---\n[\s\S]*?\n---\n?/;
const HEADING_PATTERN = /^(#{1,3})\s+(.+?)\s*$/;

function normalizeHeading(heading: string) {
  return heading.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stripFrontmatter(markdown: string) {
  return markdown.replace(FRONTMATTER_PATTERN, '');
}

function parseSections(markdown: string): ParsedSection[] {
  const lines = stripFrontmatter(markdown).split('\n');
  const sections: ParsedSection[] = [];
  let currentTitle = 'Document Overview';
  let currentKey = '__overview__';
  let buffer: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(HEADING_PATTERN);

    if (headingMatch) {
      sections.push({
        title: currentTitle,
        key: currentKey,
        content: buffer.join('\n').trim(),
      });

      const headingTitle = headingMatch[2];
      currentTitle = headingTitle;
      currentKey = normalizeHeading(headingTitle);
      buffer = [line];
      continue;
    }

    buffer.push(line);
  }

  sections.push({
    title: currentTitle,
    key: currentKey,
    content: buffer.join('\n').trim(),
  });

  return sections.filter((section) => section.content.length > 0);
}

export function diffMarkdownSections(previousMarkdown: string, currentMarkdown: string): SectionDiffSummary {
  const previousSections = parseSections(previousMarkdown);
  const currentSections = parseSections(currentMarkdown);

  const previousByKey = new Map(previousSections.map((section) => [section.key, section]));
  const currentByKey = new Map(currentSections.map((section) => [section.key, section]));

  const orderedKeys = [
    ...currentSections.map((section) => section.key),
    ...previousSections.map((section) => section.key),
  ].filter((key, index, all) => all.indexOf(key) === index);

  const changedSections: SectionChange[] = [];
  let unchangedCount = 0;

  for (const key of orderedKeys) {
    const previous = previousByKey.get(key);
    const current = currentByKey.get(key);

    if (previous && current) {
      if (previous.content === current.content) {
        unchangedCount++;
        continue;
      }

      changedSections.push({
        title: current.title,
        previousContent: previous.content,
        currentContent: current.content,
        changeType: 'changed',
      });
      continue;
    }

    if (!previous && current) {
      changedSections.push({
        title: current.title,
        previousContent: '',
        currentContent: current.content,
        changeType: 'added',
      });
      continue;
    }

    if (previous && !current) {
      changedSections.push({
        title: previous.title,
        previousContent: previous.content,
        currentContent: '',
        changeType: 'removed',
      });
    }
  }

  return {
    changedSections,
    unchangedCount,
  };
}