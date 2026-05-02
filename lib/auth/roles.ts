import type { OrganizationRole } from '@/lib/types';
import { formatDisplayLabel } from '@/lib/utils';

export const ORG_ROLE_OPTIONS: OrganizationRole[] = ['admin', 'editor', 'approver', 'viewer'];

const ADMIN_ROLES: OrganizationRole[] = ['admin'];
const EDIT_ROLES: OrganizationRole[] = ['admin', 'editor'];
const APPROVE_ROLES: OrganizationRole[] = ['admin', 'approver'];

export function isAdminRole(role: string | null | undefined): role is OrganizationRole {
  return typeof role === 'string' && ADMIN_ROLES.includes(role as OrganizationRole);
}

export function canEditOrganization(role: string | null | undefined): role is OrganizationRole {
  return typeof role === 'string' && EDIT_ROLES.includes(role as OrganizationRole);
}

export function canApproveDocuments(role: string | null | undefined): role is OrganizationRole {
  return typeof role === 'string' && APPROVE_ROLES.includes(role as OrganizationRole);
}

export function canRejectOrRegenerateDocuments(role: string | null | undefined): role is OrganizationRole {
  return typeof role === 'string' && EDIT_ROLES.includes(role as OrganizationRole);
}

export function isValidOrganizationRole(role: string): role is OrganizationRole {
  return ORG_ROLE_OPTIONS.includes(role as OrganizationRole);
}

export function getOrganizationRoleDisplay(role: string | null | undefined): string {
  return formatDisplayLabel(role);
}
