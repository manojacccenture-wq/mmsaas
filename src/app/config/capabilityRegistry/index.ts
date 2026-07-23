/**
 * Capability-Driven Module Registry
 * 
 * This registry defines all available modules and their required capabilities.
 * Frontend dynamically filters modules based on user's activeContext.permissions
 * 
 * KEY PRINCIPLE:
 * Frontend depends ONLY on permissions[], NOT role names
 * This allows custom tenant-created roles to work seamlessly
 */

import { dashboardModule } from "./modules/dashboard";
import { usersModule } from "./modules/users";
import { businessRolesModule } from "./modules/businessRoles";
import { billingModule } from "./modules/billing";

/**
 * All available modules in the application
 * Sorted by priority for consistent sidebar ordering
 */
export const ALL_MODULES = [
  dashboardModule,
  usersModule,
  businessRolesModule,
  billingModule,
  // Add new modules here following the same pattern
] as const;

/**
 * Get all modules that should be visible based on capabilities
 * @param permissions - Array of capability strings from activeContext.permissions
 * @returns Filtered array of accessible modules
 */
export const getAccessibleModules = (permissions: string[]) => {
  return ALL_MODULES.filter((module) => {
    // If module has no required capabilities, always show
    if (module.requiredCapabilities.length === 0) {
      return true;
    }

    // Check if user has ALL required capabilities for this module
    return module.requiredCapabilities.every((cap) =>
      permissions.includes(cap)
    );
  }).sort((a, b) => a.priority - b.priority);
};

/**
 * Get a specific module by ID
 * @param moduleId - Module identifier
 * @returns Module configuration or undefined
 */
export const getModuleById = (moduleId: string) => {
  return ALL_MODULES.find((module) => module.id === moduleId);
};

/**
 * Get all routes that should be accessible
 * @param permissions - Array of capability strings
 * @returns Flattened array of all accessible routes
 */
export const getAccessibleRoutes = (permissions: string[]) => {
  return getAccessibleModules(permissions).flatMap((module) => module.routes);
};

/**
 * Get sidebar structure based on accessible modules
 * @param permissions - Array of capability strings
 * @returns Array of sidebar items (modules + their children)
 */
export const getAccessibleSidebarItems = (permissions: string[]) => {
  return getAccessibleModules(permissions).map((module) => module.sidebar);
};

export type ModuleConfig = typeof ALL_MODULES[number];
export type RouteConfig = ModuleConfig["routes"][number];
export type SidebarConfig = ModuleConfig["sidebar"];

export { dashboardModule, usersModule, businessRolesModule, billingModule };
