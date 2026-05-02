# TrustScaffold Design System

## Purpose
TrustScaffold should feel like one platform across wizard, dashboard, document review, auditor views, and settings. The design system exists to make visual change intentional, centralized, and theme-aware instead of page-local.

## Sources Of Truth
- Theme tokens: [app/globals.css](app/globals.css)
- Core UI primitives: [components/ui](components/ui)
- Shared style libraries: [lib/ui](lib/ui)

## Theme Model
Colors should resolve through semantic tokens rather than raw light-mode colors.

Primary tokens:
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `border`, `input`, `ring`

Rule:
- Prefer semantic token classes such as `bg-card`, `text-foreground`, `bg-popover`, `border-border`.
- Avoid hardcoded `bg-white`, `text-slate-900`, or other light-only values in shared components.
- Dark mode must be handled in the same primitive or token source, not patched per page.

## Core Primitive Layers
### Surfaces
- Cards: [components/ui/card.tsx](components/ui/card.tsx)
- Floating surfaces: [lib/ui/floating-surface.ts](lib/ui/floating-surface.ts)
- Nested panels and inset surfaces: [lib/ui/card-surfaces.ts](lib/ui/card-surfaces.ts)

### Form Controls
- Inputs: [components/ui/input.tsx](components/ui/input.tsx)
- Textareas: [components/ui/textarea.tsx](components/ui/textarea.tsx)
- Shared field tokens: [lib/ui/form-controls.ts](lib/ui/form-controls.ts)

### Status And Labels
- Badges: [components/ui/badge.tsx](components/ui/badge.tsx)
- Prefer semantic badge variants (`success`, `warning`, `neutral`, `danger`) over page-local color classes.

### Actions And Feedback
- Buttons: [components/ui/button.tsx](components/ui/button.tsx)
- Alert callouts: [components/ui/alert-callout.tsx](components/ui/alert-callout.tsx)
- Empty states: [components/ui/empty-state.tsx](components/ui/empty-state.tsx)
- List and row surfaces: [lib/ui/card-surfaces.ts](lib/ui/card-surfaces.ts)

### Inline Chips And Progress
- Code / endpoint chips: [components/ui/code-chip.tsx](components/ui/code-chip.tsx)
- Progress and meter primitives: [components/ui/progress.tsx](components/ui/progress.tsx)

## Interaction Patterns
### Tooltips / Popovers / Dropdowns
These should share the same floating-surface language.

Use:
- [components/ui/tooltip.tsx](components/ui/tooltip.tsx)
- [components/ui/popover.tsx](components/ui/popover.tsx)
- [components/ui/dropdown-menu.tsx](components/ui/dropdown-menu.tsx)

Do not restyle these ad hoc inside pages unless a platform-level primitive is missing.

### Page Composition
Preferred hierarchy:
1. Page background from global theme
2. Top-level cards from shared `Card`
3. Nested detail panels from shared `card-surfaces`
4. Inputs/selects from shared `form-controls`
5. Status pills from shared `Badge` variants

## Maintainability Rules
- If the same class recipe appears twice, consider extracting it.
- If a component is used across wizard and dashboard, styling belongs in a primitive or `lib/ui` helper.
- If a style must differ by theme, solve it in tokens or a shared primitive.
- Avoid global CSS overrides for specific HTML elements when the intent belongs in a component primitive.

## Current Shared Style Libraries
- [lib/ui/floating-surface.ts](lib/ui/floating-surface.ts)
- [lib/ui/form-controls.ts](lib/ui/form-controls.ts)
- [lib/ui/card-surfaces.ts](lib/ui/card-surfaces.ts)

## Implemented Extensions
- Semantic button tones now support platform-level action meaning.
- Alert and empty-state blocks now have shared primitives.
- List and row surfaces now have reusable shared recipes.
- Inline command, endpoint, and repo path chips now have a shared primitive.
- Coverage and readiness bars now resolve through a shared progress primitive with semantic variants.

## Remaining Candidates
- Shared icon treatment helpers for quick-action tiles and navigation affordances
- Shared filter chip / segmented control primitives for glossary and similar selector UIs
