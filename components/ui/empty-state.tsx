import { cn } from '@/lib/utils';
import { emptyStateSurfaceClassName } from '@/lib/ui/card-surfaces';

export function EmptyState({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn(emptyStateSurfaceClassName, className)} {...props} />;
}
