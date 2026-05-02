'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const progressRootVariants = cva('relative w-full overflow-hidden rounded-full bg-secondary/80', {
  variants: {
    size: {
      sm: 'h-2',
      md: 'h-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const progressIndicatorVariants = cva('h-full transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Progress({
  className,
  value,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & VariantProps<typeof progressRootVariants> & VariantProps<typeof progressIndicatorVariants>) {
  return (
    <ProgressPrimitive.Root
      className={cn(progressRootVariants({ size }), className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressIndicatorVariants({ variant })}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
