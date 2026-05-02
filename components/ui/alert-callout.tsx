import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertCalloutVariants = cva('rounded-2xl border px-4 py-3 text-sm', {
  variants: {
    variant: {
      info: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
      warning: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
      danger: 'border-red-200 bg-red-50 text-red-950 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100',
      neutral: 'border-border bg-secondary/20 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export function AlertCallout({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertCalloutVariants>) {
  return <div className={cn(alertCalloutVariants({ variant }), className)} {...props} />;
}
