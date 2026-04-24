'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut } from 'lucide-react';

import { signOut } from '@/app/(dashboard)/actions';
import { dashboardNavigation } from '@/components/layout/dashboard-sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrg } from '@/components/providers/org-provider';

export function DashboardHeader({ appVersion, appCommit }: { appVersion: string; appCommit: string }) {
  const { email, organization } = useOrg();
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-4 border-b border-white/60 bg-white/75 px-4 py-4 backdrop-blur dark:border-border dark:bg-card/90 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/70">Active Organization</p>
          <Badge variant="outline" className="text-[10px]">{appVersion}</Badge>
          <Badge variant="outline" className="text-[10px] font-mono">{appCommit}</Badge>
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">{organization?.name ?? 'No organization found'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {organization ? `${organization.role} role · ${organization.id}` : 'Organization context unavailable'}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between gap-3 rounded-2xl px-4 lg:hidden">
              <span>Navigate</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-border bg-white p-2 shadow-panel dark:bg-card">
            {dashboardNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-3">
                  <Link href={item.href} className={isActive ? 'bg-secondary/70 text-foreground' : ''}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between gap-3 rounded-2xl px-4 sm:max-w-none">
              <span className="max-w-[12rem] truncate text-left sm:max-w-48">{email ?? 'Authenticated user'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-border bg-white p-2 shadow-panel dark:bg-card">
            <form action={signOut}>
              <DropdownMenuItem className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent" asChild>
                <button type="submit" className="w-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
