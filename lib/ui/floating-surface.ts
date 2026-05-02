export const floatingSurfaceBaseClassName = [
  'z-50',
  'border',
  'border-border',
  'bg-popover',
  'bg-[linear-gradient(180deg,hsl(var(--popover)),hsl(var(--secondary)))]',
  'text-popover-foreground',
  'shadow-lg',
  'ring-1',
  'ring-primary/10',
  'backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-popover',
  'dark:shadow-2xl',
  'outline-none',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95',
  'data-[state=open]:zoom-in-95',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=top]:slide-in-from-bottom-2',
].join(' ');

export const popoverSurfaceClassName = [
  floatingSurfaceBaseClassName,
  'w-80',
  'rounded-2xl',
  'p-4',
].join(' ');

export const tooltipSurfaceClassName = [
  floatingSurfaceBaseClassName,
  'max-w-xs',
  'rounded-2xl',
  'px-3',
  'py-2.5',
  'text-xs',
  'leading-5',
].join(' ');
