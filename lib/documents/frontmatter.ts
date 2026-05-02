export type ParsedDocumentFrontmatter = {
  criteriaMapped: string[];
  tscCategory: string | null;
};

function parseInlineCriteriaValue(rawValue: string): string[] {
  const value = rawValue.trim();
  if (!value) return [];

  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ''))
      .filter(Boolean);
  }

  return value
    .split(',')
    .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ''))
    .filter(Boolean);
}

export function parseDocumentFrontmatter(markdown: string): ParsedDocumentFrontmatter {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {
      criteriaMapped: [],
      tscCategory: null,
    };
  }

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const criteriaMapped: string[] = [];
  let tscCategory: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const categoryMatch = line.match(/^tsc_category:\s*(.+)$/);
    if (categoryMatch) {
      tscCategory = categoryMatch[1].trim().replace(/^['\"]|['\"]$/g, '');
      continue;
    }

    const criteriaMatch = line.match(/^criteria_mapped:\s*(.*)$/);
    if (!criteriaMatch) {
      continue;
    }

    const inlineValue = criteriaMatch[1]?.trim() ?? '';
    if (inlineValue) {
      criteriaMapped.push(...parseInlineCriteriaValue(inlineValue));
      continue;
    }

    for (let nestedIndex = index + 1; nestedIndex < lines.length; nestedIndex += 1) {
      const nestedRawLine = lines[nestedIndex];
      const nestedLine = nestedRawLine.trim();

      if (!nestedLine) {
        continue;
      }

      if (/^[A-Za-z0-9_]+:\s*/.test(nestedLine)) {
        break;
      }

      const listMatch = nestedLine.match(/^-\s+(.+)$/);
      if (!listMatch) {
        break;
      }

      criteriaMapped.push(listMatch[1].trim().replace(/^['\"]|['\"]$/g, ''));
      index = nestedIndex;
    }
  }

  return {
    criteriaMapped: [...new Set(criteriaMapped)],
    tscCategory,
  };
}
