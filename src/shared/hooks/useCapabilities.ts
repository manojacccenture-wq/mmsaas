/**
 * useCapabilities Hook
 * 
 * Provides access to user capabilities and permission checking functions
 * Source: activeContext.permissions from Redux auth store
 */

import { useMemo } from "react";
import { useAppSelector } from "@/app/store/hook";
import {
  hasCapability,
  hasAnyCapability,
  hasAllCapabilities,
  filterModulesByCapabilities,
  filterRoutesByCapabilities,
} from "@/shared/utils/permissions/capabilityUtils";

/**
 * Hook to access and check user capabilities
 * @returns Object containing permissions array and checking functions
 */
export const useCapabilities = () => {
  const { activeContext } = useAppSelector((state) => state.auth);

  // Memoize permissions array to prevent unnecessary re-renders
  const permissions = useMemo(() => {
    return activeContext?.permissions || [];
  }, [activeContext?.permissions]);

  // Memoize capability checking functions
  const capabilityFunctions = useMemo(
    () => ({
      /**
       * Check if user has a specific capability
       * @param capability - Single capability string
       * @returns true if user has the capability
       */
      hasCapability: (capability: string): boolean => {
        return hasCapability(permissions, capability);
      },

      /**
       * Check if user has ANY of the provided capabilities
       * @param capabilities - Array of capability strings
       * @returns true if user has any of them
       */
      hasAnyCapability: (capabilities: string[]): boolean => {
        return hasAnyCapability(permissions, capabilities);
      },

      /**
       * Check if user has ALL of the provided capabilities
       * @param capabilities - Array of capability strings
       * @returns true if user has all of them
       */
      hasAllCapabilities: (capabilities: string[]): boolean => {
        return hasAllCapabilities(permissions, capabilities);
      },

      /**
       * Filter modules by user capabilities
       * @param modules - Array of module configurations
       * @returns Filtered modules user can access
       */
      filterModules: (modules: any[]): any[] => {
        return filterModulesByCapabilities(modules, permissions);
      },

      /**
       * Filter routes by user capabilities
       * @param routes - Array of route configurations
       * @returns Filtered routes user can access
       */
      filterRoutes: (routes: any[]): any[] => {
        return filterRoutesByCapabilities(routes, permissions);
      },
    }),
    [permissions]
  );

  return {
    permissions,
    businessRole: activeContext?.businessRole,
    ...capabilityFunctions,
  };
};

/**
 * Alternative hook for just checking a single capability
 * More efficient if you only need to check one capability
 * @param capability - Capability string to check
 * @returns true if user has the capability
 */
export const useHasCapability = (capability: string): boolean => {
  const { hasCapability: check } = useCapabilities();
  return check(capability);
};

/**
 * Hook to get all accessible modules
 * @param modules - Array of modules to filter
 * @returns Only modules user can access
 */
export const useAccessibleModules = (modules: any[]) => {
  const { filterModules } = useCapabilities();
  return useMemo(() => filterModules(modules), [modules, filterModules]);
};

/**
 * Hook to get all accessible routes
 * @param routes - Array of routes to filter
 * @returns Only routes user can access
 */
export const useAccessibleRoutes = (routes: any[]) => {
  const { filterRoutes } = useCapabilities();
  return useMemo(() => filterRoutes(routes), [routes, filterRoutes]);
};
