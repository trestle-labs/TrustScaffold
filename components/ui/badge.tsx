import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'border border-border bg-background/80 text-foreground',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200',
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
      neutral: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
      danger: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
