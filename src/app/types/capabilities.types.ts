/**
 * Capability-Driven Architecture - Type Definitions & API Documentation
 * 
 * This file defines all types and interfaces used in the capability-driven system
 */

// ==============================================================================
// CAPABILITY TYPES
// ==============================================================================

/**
 * Represents a single capability string
 * Format: "module.action" (e.g., "users.view", "billing.create")
 */
export type Capability = string;

/**
 * Array of capabilities assigned to a user
 */
export type CapabilityList = Capability[];

// ==============================================================================
// MODULE CONFIGURATION TYPES
// ==============================================================================

/**
 * Configuration for a sidebar item
 */
export interface SidebarItemConfig {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  requiredCapabilities: Capability[];
  children?: SidebarItemConfig[];
}

/**
 * Configuration for a route
 */
export interface RouteConfig {
  id: string;
  path: string;
  label: string;
  requiredCapabilities: Capability[];
  component?: string;
}

/**
 * Configuration for a module
 */
export interface ModuleConfig {
  id: string;
  label: string;
  icon?: string;
  path: string;
  requiredCapabilities: Capability[];
  priority: number;
  isCore?: boolean;
  description?: string;
  routes: RouteConfig[];
  sidebar: SidebarItemConfig;
}

// ==============================================================================
// AUTH TYPES
// ==============================================================================

/**
 * Business role configuration from backend
 */
export interface BusinessRole {
  id?: string;
  name: string;
  capabilities: Capability[];
  description?: string;
}

/**
 * Active context in Redux auth state
 */
export interface ActiveContext {
  tenantId: string;
  businessRole: BusinessRole;
  permissions: Capability[];
  products?: any[];
  isSuperAdmin?: boolean;
}

/**
 * Auth state interface
 */
export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  activeContext: ActiveContext | null;
  permissions: Capability[];
  tenants: any[];
}

// ==============================================================================
// HOOK RETURN TYPES
// ==============================================================================

/**
 * Return type for useCapabilities hook
 */
export interface CapabilitiesHook {
  permissions: Capability[];
  businessRole?: BusinessRole;
  hasCapability: (capability: Capability) => boolean;
  hasAnyCapability: (capabilities: Capability[]) => boolean;
  hasAllCapabilities: (capabilities: Capability[]) => boolean;
  filterModules: (modules: ModuleConfig[]) => ModuleConfig[];
  filterRoutes: (routes: RouteConfig[]) => RouteConfig[];
}

// ==============================================================================
// COMPONENT PROPS TYPES
// ==============================================================================

/**
 * Props for CapabilityGuard component
 */
export interface CapabilityGuardProps {
  children: React.ReactNode;
  capability?: Capability;
  capabilities?: Capability[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Props for PermissionGuard component
 */
export interface PermissionGuardProps {
  children: React.ReactNode;
  capability?: Capability;
  capabilities?: Capability[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Props for CapabilitySidebar component
 */
export interface CapabilitySidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  modules?: ModuleConfig[];
}

/**
 * Props for DashboardLayout component
 */
export interface DashboardLayoutProps {
  modules?: ModuleConfig[];
}

// ==============================================================================
// UTILITY FUNCTION TYPES
// ==============================================================================

/**
 * Signature for capability checking function
 */
export type CapabilityChecker = (capabilities: Capability[], required: Capability) => boolean;

/**
 * Signature for module filtering function
 */
export type ModuleFilter = (modules: ModuleConfig[], capabilities: Capability[]) => ModuleConfig[];

/**
 * Signature for route filtering function
 */
export type RouteFilter = (routes: RouteConfig[], capabilities: Capability[]) => RouteConfig[];

// ==============================================================================
// PERMISSION CONSTANTS TYPES
// ==============================================================================

/**
 * Type-safe permission constant object
 */
export interface PermissionConstants {
  [module: string]: {
    [action: string]: Capability;
  };
}

// ==============================================================================
// REGISTRY TYPES
// ==============================================================================

/**
 * Module registry configuration
 */
export interface ModuleRegistry {
  getAllModules: () => ModuleConfig[];
  getAccessibleModules: (capabilities: Capability[]) => ModuleConfig[];
  getModuleById: (moduleId: string) => ModuleConfig | undefined;
  getAccessibleRoutes: (capabilities: Capability[]) => RouteConfig[];
  getAccessibleSidebarItems: (capabilities: Capability[]) => SidebarItemConfig[];
}

// ==============================================================================
// ERROR & STATUS TYPES
// ==============================================================================

/**
 * Permission error type
 */
export class PermissionError extends Error {
  constructor(
    public capability: Capability,
    public userCapabilities: Capability[]
  ) {
    super(`User lacks required capability: ${capability}`);
    this.name = "PermissionError";
  }
}

/**
 * Module not found error type
 */
export class ModuleNotFoundError extends Error {
  constructor(public moduleId: string) {
    super(`Module not found: ${moduleId}`);
    this.name = "ModuleNotFoundError";
  }
}

// ==============================================================================
// VALIDATION TYPES
// ==============================================================================

/**
 * Validation result for capability checks
 */
export interface ValidationResult {
  valid: boolean;
  missingCapabilities?: Capability[];
  message?: string;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  throwOnError?: boolean;
  logWarnings?: boolean;
}

// ==============================================================================
// FEATURE FLAG TYPES (FOR FUTURE USE)
// ==============================================================================

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  id: string;
  requiredCapabilities: Capability[];
  enabled: boolean;
  beta?: boolean;
}

/**
 * Feature flags registry
 */
export interface FeatureFlagRegistry {
  [featureId: string]: FeatureFlag;
}

// ==============================================================================
// AUDIT & LOGGING TYPES
// ==============================================================================

/**
 * Permission access log entry
 */
export interface PermissionAccessLog {
  timestamp: Date;
  userId?: string;
  capability: Capability;
  granted: boolean;
  context?: string;
}

/**
 * Permission audit trail
 */
export interface PermissionAudit {
  logs: PermissionAccessLog[];
  addLog: (log: PermissionAccessLog) => void;
  getLogsFor: (capability: Capability) => PermissionAccessLog[];
}
