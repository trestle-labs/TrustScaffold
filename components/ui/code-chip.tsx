import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const codeChipVariants = cva('inline-flex items-center rounded-md px-1.5 py-0.5 font-mono', {
  variants: {
    variant: {
      default: 'bg-secondary text-foreground',
      warning: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
    },
    size: {
      sm: 'text-xs',
      xs: 'text-[11px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

export function CodeChip({ className, variant, size, ...props }: React.ComponentProps<'code'> & VariantProps<typeof codeChipVariants>) {
  return <code className={cn(codeChipVariants({ variant, size }), className)} {...props} />;
}