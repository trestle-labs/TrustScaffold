'use client';

import { useMemo, useRef, useState } from 'react';

import { glossaryEntries, type GlossaryEntry } from '@trestle-labs/core/client';

type HoveredGlossary = {
  entry: GlossaryEntry;
  x: number;
  y: number;
};

const BLOCKED_TAGS = new Set(['INPUT', 'TEXTAREA', 'CODE', 'PRE', 'SELECT', 'OPTION']);

function isWordChar(char: string | undefined) {
  return !!char && /[a-z0-9]/i.test(char);
}

function termVariants(term: string) {
  const variants = new Set<string>([term]);
  const acronymMatch = term.match(/^([A-Z0-9]{2,})\s+\(/);
  if (acronymMatch) variants.add(acronymMatch[1]);
  for (const part of term.split('/').map((value) => value.trim()).filter(Boolean)) {
    variants.add(part);
  }
  return [...variants];
}

function isBoundaryMatch(text: string, start: number, end: number) {
  const before = text[start - 1];
  const after = text[end];
  return !isWordChar(before) && !isWordChar(after);
}

function getCaretFromPoint(x: number, y: number): { node: Text; offset: number } | null {
  if (typeof document === 'undefined') return null;

  const d = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };

  if (typeof d.caretPositionFromPoint === 'function') {
    const caret = d.caretPositionFromPoint(x, y);
    if (caret?.offsetNode?.nodeType === Node.TEXT_NODE) {
      return { node: caret.offsetNode as Text, offset: caret.offset };
    }
  }

  if (typeof d.caretRangeFromPoint === 'function') {
    const range = d.caretRangeFromPoint(x, y);
    if (range?.startContainer?.nodeType === Node.TEXT_NODE) {
      return { node: range.startContainer as Text, offset: range.startOffset };
    }
  }

  return null;
}

export function GlossaryHoverLayer({ children, delayMs = 700 }: { children: React.ReactNode; delayMs?: number }) {
  const timerRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<HoveredGlossary | null>(null);

  const entries = useMemo(() => {
    return glossaryEntries
      .map((entry) => ({
        entry,
        variants: [...new Set([...
          termVariants(entry.term),
          ...(entry.aliases ?? []),
        ])].sort((a, b) => b.length - a.length),
      }))
      .sort((a, b) => b.entry.term.length - a.entry.term.length);
  }, []);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function findEntryAtPoint(x: number, y: number): GlossaryEntry | null {
    const caret = getCaretFromPoint(x, y);
    if (!caret) return null;

    const parentEl = caret.node.parentElement;
    if (!parentEl) return null;
    if (BLOCKED_TAGS.has(parentEl.tagName)) return null;
    if (parentEl.closest('[data-no-glossary-tooltip="true"]')) return null;

    const text = caret.node.textContent ?? '';
    const offset = Math.max(0, Math.min(caret.offset, text.length));
    if (!text.trim()) return null;

    let bestMatch: { length: number; entry: GlossaryEntry } | null = null;

    for (const item of entries) {
      for (const variant of item.variants) {
        const variantLower = variant.toLowerCase();
        const haystack = text.toLowerCase();

        let index = haystack.indexOf(variantLower);
        while (index !== -1) {
          const end = index + variantLower.length;
          const isInside = offset >= index && offset <= end;
          if (isInside && isBoundaryMatch(text, index, end)) {
            if (!bestMatch || variant.length > bestMatch.length) {
              bestMatch = { length: variant.length, entry: item.entry };
            }
          }

          index = haystack.indexOf(variantLower, index + 1);
        }
      }
    }

    return bestMatch?.entry ?? null;
  }

  function scheduleLookup(x: number, y: number) {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      const entry = findEntryAtPoint(x, y);
      if (!entry) {
        setHovered(null);
        return;
      }

      setHovered({ entry, x, y });
    }, delayMs);
  }

  return (
    <div
      className="relative"
      onMouseMove={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest('input, textarea, select, button')) {
          clearTimer();
          setHovered(null);
          return;
        }

        scheduleLookup(event.clientX, event.clientY);
      }}
      onMouseLeave={() => {
        clearTimer();
        setHovered(null);
      }}
    >
      {children}
      {hovered ? (
        <div
          className="pointer-events-none fixed z-50 max-w-sm rounded-xl border border-border bg-background px-3 py-2 shadow-2xl"
          style={{ left: hovered.x + 14, top: hovered.y + 16 }}
          role="tooltip"
          aria-live="polite"
        >
          <p className="text-xs font-semibold text-foreground">{hovered.entry.term}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hovered.entry.plainEnglishDefinition ?? hovered.entry.definition}</p>
        </div>
      ) : null}
    </div>
  );
}
