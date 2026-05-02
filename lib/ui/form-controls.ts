export const fieldBaseClassName = [
  'w-full',
  'border',
  'border-input',
  'bg-background',
  'text-foreground',
  'shadow-sm',
  'transition-colors',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');

export const inputFieldClassName = [
  fieldBaseClassName,
  'flex',
  'h-11',
  'rounded-2xl',
  'px-4',
  'py-2',
  'text-sm',
  'placeholder:text-muted-foreground',
  'file:border-0',
  'file:bg-transparent',
  'file:text-sm',
  'file:font-medium',
  'file:text-foreground',
].join(' ');

export const textareaFieldClassName = [
  fieldBaseClassName,
  'flex',
  'min-h-[120px]',
  'rounded-2xl',
  'px-4',
  'py-3',
  'text-sm',
  'placeholder:text-muted-foreground',
].join(' ');

export const selectFieldClassName = [
  fieldBaseClassName,
  'h-11',
  'rounded-2xl',
  'px-4',
  'text-sm',
].join(' ');

export const compactSearchFieldClassName = [
  fieldBaseClassName,
  'h-10',
  'rounded-xl',
  'px-3',
  'text-sm',
  'placeholder:text-muted-foreground',
].join(' ');
