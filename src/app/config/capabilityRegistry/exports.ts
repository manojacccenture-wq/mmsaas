/**
 * Barrel exports for easy importing
 * Reduces import path length and centralizes exports
 */

// ============================================================================
// CAPABILITY REGISTRY
// ============================================================================
export {
  ALL_MODULES,
  getAccessibleModules,
  getModuleById,
  getAccessibleRoutes,
  getAccessibleSidebarItems,
  type ModuleConfig,
  type RouteConfig,
  type SidebarConfig,
} from "@/app/config/capabilityRegistry";

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================
export {
  USER_PERMISSIONS,
  ROLE_PERMISSIONS,
  POLICY_PERMISSIONS,
  BUSINESS_ROLE_PERMISSIONS,
  BILLING_PERMISSIONS,
  INVENTORY_PERMISSIONS,
  DASHBOARD_PERMISSIONS,
  ALL_PERMISSIONS,
  EXAMPLE_PERMISSION_SETS,
  type AllPermissions,
} from "@/app/config/permissions.constants";

// ============================================================================
// HOOKS
// ============================================================================
export {
  useCapabilities,
  useHasCapability,
  useAccessibleModules,
  useAccessibleRoutes,
} from "@/shared/hooks/useCapabilities";

// ============================================================================
// COMPONENTS
// ============================================================================
export {
  default as CapabilityGuard,
  withCapabilityGuard,
} from "@/shared/components/CapabilityGuard/CapabilityGuard";

export {
  default as PermissionGuard,
  useCanShow,
  useCanPerform,
} from "@/shared/components/PermissionGuard/PermissionGuard";

export { default as CapabilitySidebar } from "@/app/Layout/Dashboard/components/CapabilitySidebar";

export { default as DynamicTenantRouter } from "@/app/routes/DynamicTenantRouter";

// ============================================================================
// UTILITIES
// ============================================================================
export {
  hasCapability,
  hasAnyCapability,
  hasAllCapabilities,
  filterModulesByCapabilities,
  filterRoutesByCapabilities,
  getAllRoutesFromModules,
  isValidPermissionFormat,
  getPermissionGroup,
  getPermissionAction,
} from "@/shared/utils/permissions/capabilityUtils";

// ============================================================================
// TYPES
// ============================================================================
export type {
  Capability,
  CapabilityList,
  SidebarItemConfig,
  RouteConfig,
  ModuleConfig,
  BusinessRole,
  ActiveContext,
  AuthState,
  CapabilitiesHook,
  CapabilityGuardProps,
  PermissionGuardProps,
  CapabilitySidebarProps,
  DashboardLayoutProps,
  PermissionError,
  ModuleNotFoundError,
} from "@/app/types/capabilities.types";
