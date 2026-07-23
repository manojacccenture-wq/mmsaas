/**
 * Permission Constants and Guides
 * 
 * IMPORTANT:
 * ============
 * These are example permissions. Actual permissions come from backend.
 * Frontend should NEVER hardcode role-to-permission mappings.
 * 
 * All permissions follow pattern: "module.action"
 * Examples: "users.view", "billing.create", "roles.edit"
 */

/**
 * User Management Permissions
 */
export const USER_PERMISSIONS = {
  VIEW: "users.view",
  CREATE: "users.create",
  EDIT: "users.edit",
  DELETE: "users.delete",
  BULK_EDIT: "users.bulk_edit",
} as const;

/**
 * Role Management Permissions
 */
export const ROLE_PERMISSIONS = {
  VIEW: "roles.view",
  CREATE: "roles.create",
  EDIT: "roles.edit",
  DELETE: "roles.delete",
  ASSIGN: "roles.assign",
} as const;

/**
 * Policy Management Permissions
 */
export const POLICY_PERMISSIONS = {
  VIEW: "policy.view",
  CREATE: "policy.create",
  EDIT: "policy.edit",
  DELETE: "policy.delete",
} as const;

/**
 * Business Roles Management Permissions
 */
export const BUSINESS_ROLE_PERMISSIONS = {
  VIEW: "business-roles.view",
  CREATE: "business-roles.create",
  EDIT: "business-roles.edit",
  DELETE: "business-roles.delete",
} as const;

/**
 * Billing Permissions
 */
export const BILLING_PERMISSIONS = {
  VIEW: "billing.view",
  MANAGE: "billing.manage",
  VIEW_INVOICES: "billing.invoices.view",
  MANAGE_SUBSCRIPTION: "billing.subscription.manage",
} as const;


/**
 * Dashboard Permissions
 */
export const DASHBOARD_PERMISSIONS = {
  VIEW: "dashboard.view",
} as const;

/**
 * All permissions grouped by module
 */
export const ALL_PERMISSIONS = {
  users: USER_PERMISSIONS,
  roles: ROLE_PERMISSIONS,
  policy: POLICY_PERMISSIONS,
  businessRoles: BUSINESS_ROLE_PERMISSIONS,
  billing: BILLING_PERMISSIONS,
  dashboard: DASHBOARD_PERMISSIONS,
} as const;

/**
 * Example permission sets for different roles
 * These are for reference only - backend is source of truth
 */
export const EXAMPLE_PERMISSION_SETS = {
  ADMIN: [
    ...Object.values(USER_PERMISSIONS),
    ...Object.values(ROLE_PERMISSIONS),
    ...Object.values(POLICY_PERMISSIONS),
    ...Object.values(BUSINESS_ROLE_PERMISSIONS),
    ...Object.values(BILLING_PERMISSIONS),
  ],
  MANAGER: [
    USER_PERMISSIONS.VIEW,
    USER_PERMISSIONS.CREATE,
    USER_PERMISSIONS.EDIT,
    BILLING_PERMISSIONS.VIEW,
  ],
  VIEWER: [
    USER_PERMISSIONS.VIEW,
    BILLING_PERMISSIONS.VIEW,
  ],
  CASHIER: [
    BILLING_PERMISSIONS.VIEW,
    BILLING_PERMISSIONS.MANAGE,
  ],
} as const;

/**
 * Type definitions for TypeScript support
 */
export type UserPermission = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS];
export type RolePermission = typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS];
export type PolicyPermission = typeof POLICY_PERMISSIONS[keyof typeof POLICY_PERMISSIONS];
export type BusinessRolePermission = typeof BUSINESS_ROLE_PERMISSIONS[keyof typeof BUSINESS_ROLE_PERMISSIONS];
export type BillingPermission = typeof BILLING_PERMISSIONS[keyof typeof BILLING_PERMISSIONS];
export type DashboardPermission = typeof DASHBOARD_PERMISSIONS[keyof typeof DASHBOARD_PERMISSIONS];

export type AllPermissions =
  | UserPermission
  | RolePermission
  | PolicyPermission
  | BusinessRolePermission
  | BillingPermission
  | DashboardPermission;
