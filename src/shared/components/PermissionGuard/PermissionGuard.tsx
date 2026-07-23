/**
 * PermissionGuard Component
 * 
 * Renders children only if user has required capabilities
 * Useful for showing/hiding buttons, actions, sections based on permissions
 * 
 * Usage:
 *   <PermissionGuard capability="users.create">
 *     <Button>Create User</Button>
 *   </PermissionGuard>
 * 
 *   <PermissionGuard capabilities={["users.edit", "users.delete"]} requireAll={false}>
 *     <div>User Management Actions</div>
 *   </PermissionGuard>
 */

import React, { ReactNode } from "react";
import { useCapabilities } from "@/shared/hooks/useCapabilities";

interface PermissionGuardProps {
  children: ReactNode;
  capability?: string;
  capabilities?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Component for conditional rendering based on capabilities
 * Useful for UI elements that should only appear if user has permission
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  capability,
  capabilities,
  requireAll = true,
  fallback = null,
}) => {
  const {
    hasCapability: checkCapability,
    hasAllCapabilities: checkAllCapabilities,
    hasAnyCapability: checkAnyCapability,
  } = useCapabilities();

  // Determine what capabilities to check
  const capabilitiesToCheck = capability ? [capability] : capabilities || [];

  // If no capabilities specified, show children
  if (capabilitiesToCheck.length === 0) {
    return <>{children}</>;
  }

  // Check access based on requireAll flag
  let hasAccess = true;

  if (capabilitiesToCheck.length === 1) {
    hasAccess = checkCapability(capabilitiesToCheck[0]);
  } else if (requireAll) {
    hasAccess = checkAllCapabilities(capabilitiesToCheck);
  } else {
    hasAccess = checkAnyCapability(capabilitiesToCheck);
  }

  // Return children if access granted, otherwise fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;

/**
 * Hook for checking if button should be shown
 * @param capability - Required capability
 * @returns true if button should be visible
 */
export const useCanShow = (capability: string | string[]): boolean => {
  const { hasCapability, hasAllCapabilities } = useCapabilities();
  
  if (Array.isArray(capability)) {
    return hasAllCapabilities(capability);
  }
  return hasCapability(capability);
};

/**
 * Hook for checking if action/button should be enabled
 * @param capability - Required capability
 * @returns true if action/button should be enabled
 */
export const useCanPerform = (capability: string): boolean => {
  const { hasCapability } = useCapabilities();
  return hasCapability(capability);
};
