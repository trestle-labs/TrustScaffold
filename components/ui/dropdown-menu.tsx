'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { floatingSurfaceBaseClassName } from '@/lib/ui/floating-surface';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;

const StyledDropdownMenuContent = ({ className, sideOffset = 8, ...props }: React.ComponentProps<typeof DropdownMenuContent>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuContent
      sideOffset={sideOffset}
      className={cn(floatingSurfaceBaseClassName, 'min-w-[12rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl p-1', className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const StyledDropdownMenuItem = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuItem>) => (
  <DropdownMenuItem
    className={cn('flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)}
    {...props}
  />
);

export { DropdownMenu, StyledDropdownMenuContent as DropdownMenuContent, StyledDropdownMenuItem as DropdownMenuItem, DropdownMenuTrigger };
