/**
 * Capability-based Permission Utilities
 * 
 * All permission checks should use these utilities, NOT role-name checks
 * This ensures compatibility with dynamic tenant-created roles
 */

/**
 * Check if user has a specific capability
 * @param capabilities - User's capability array
 * @param requiredCapability - Single capability to check
 * @returns true if user has the capability
 */
export const hasCapability = (
  capabilities: string[],
  requiredCapability: string
): boolean => {
  if (!capabilities || !Array.isArray(capabilities)) {
    return false;
  }
  return capabilities.includes(requiredCapability);
};

/**
 * Check if user has ANY of the provided capabilities
 * @param capabilities - User's capability array
 * @param requiredCapabilities - Array of capabilities (user needs at least one)
 * @returns true if user has any of the capabilities
 */
export const hasAnyCapability = (
  capabilities: string[],
  requiredCapabilities: string[]
): boolean => {
  if (!capabilities || !Array.isArray(capabilities)) {
    return false;
  }
  if (!requiredCapabilities || requiredCapabilities.length === 0) {
    return true;
  }
  return requiredCapabilities.some((cap) => capabilities.includes(cap));
};

/**
 * Check if user has ALL of the provided capabilities
 * @param capabilities - User's capability array
 * @param requiredCapabilities - Array of capabilities (user needs all of them)
 * @returns true if user has all capabilities
 */
export const hasAllCapabilities = (
  capabilities: string[],
  requiredCapabilities: string[]
): boolean => {
  if (!capabilities || !Array.isArray(capabilities)) {
    return false;
  }
  if (!requiredCapabilities || requiredCapabilities.length === 0) {
    return true;
  }
  return requiredCapabilities.every((cap) => capabilities.includes(cap));
};

/**
 * Filter modules by user capabilities
 * @param modules - Array of module configurations
 * @param capabilities - User's capability array
 * @returns Filtered array of accessible modules
 */
export const filterModulesByCapabilities = (
  modules: any[],
  capabilities: string[]
): any[] => {
  if (!modules || !Array.isArray(modules)) {
    return [];
  }
  if (!capabilities || !Array.isArray(capabilities)) {
    return [];
  }

  return modules.filter((module) => {
    // If module has no required capabilities, always include
    if (!module.requiredCapabilities || module.requiredCapabilities.length === 0) {
      return true;
    }

    // Check if user has ALL required capabilities
    return hasAllCapabilities(capabilities, module.requiredCapabilities);
  });
};

/**
 * Filter routes by user capabilities
 * @param routes - Array of route configurations
 * @param capabilities - User's capability array
 * @returns Filtered array of accessible routes
 */
export const filterRoutesByCapabilities = (
  routes: any[],
  capabilities: string[]
): any[] => {
  if (!routes || !Array.isArray(routes)) {
    return [];
  }
  if (!capabilities || !Array.isArray(capabilities)) {
    return [];
  }

  return routes.filter((route) => {
    // If route has no required capabilities, always include
    if (!route.requiredCapabilities || route.requiredCapabilities.length === 0) {
      return true;
    }

    // Check if user has ALL required capabilities
    return hasAllCapabilities(capabilities, route.requiredCapabilities);
  });
};

/**
 * Get all nested routes from modules
 * @param modules - Array of module configurations
 * @returns Flat array of all routes
 */
export const getAllRoutesFromModules = (modules: any[]): any[] => {
  return modules.flatMap((module) => module.routes || []);
};

/**
 * Validate permission string format
 * @param permission - Permission string to validate
 * @returns true if permission follows standard format (e.g., "users.view", "billing.create")
 */
export const isValidPermissionFormat = (permission: string): boolean => {
  const permissionRegex = /^[a-z-]+\.[a-z-]+$/;
  return permissionRegex.test(permission);
};

/**
 * Get permission group from full permission string
 * Example: "users.view" -> "users"
 * @param permission - Full permission string
 * @returns Permission group/module
 */
export const getPermissionGroup = (permission: string): string => {
  const [group] = permission.split(".");
  return group;
};

/**
 * Get permission action from full permission string
 * Example: "users.view" -> "view"
 * @param permission - Full permission string
 * @returns Permission action
 */
export const getPermissionAction = (permission: string): string => {
  const [, action] = permission.split(".");
  return action;
};
