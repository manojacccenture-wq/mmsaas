/**
 * CapabilityGuard Component
 * 
 * Protects routes/components based on required capabilities
 * Usage:
 *   <CapabilityGuard capability="users.view">
 *     <UsersPage />
 *   </CapabilityGuard>
 * 
 *   <CapabilityGuard capabilities={["billing.view", "billing.manage"]} requireAll={false}>
 *     <BillingPage />
 *   </CapabilityGuard>
 */

import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCapabilities } from "@/shared/hooks/useCapabilities";

interface CapabilityGuardProps {
  children: ReactNode;
  capability?: string;
  capabilities?: string[];
  requireAll?: boolean; // true: need all capabilities, false: need any capability
  fallback?: ReactNode; // What to show if access denied
  redirectTo?: string; // Where to redirect if access denied
}

/**
 * Guard component for capability-based access control
 * Can check single or multiple capabilities
 */
const CapabilityGuard: React.FC<CapabilityGuardProps> = ({
  children,
  capability,
  capabilities,
  requireAll = true,
  fallback = null,
  redirectTo = "/access-denied",
}) => {
  const {
    hasCapability: checkCapability,
    hasAllCapabilities: checkAllCapabilities,
    hasAnyCapability: checkAnyCapability,
  } = useCapabilities();

  // Determine what capabilities to check
  const capabilitiesToCheck = capability ? [capability] : capabilities || [];

  // If no capabilities specified, grant access
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

  // Handle access denied
  if (!hasAccess) {
    // If redirect is specified, navigate to it
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Otherwise show fallback
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default CapabilityGuard;

/**
 * Higher-order component for wrapping components with capability guards
 * Usage: const ProtectedUsers = withCapabilityGuard(Users, "users.view");
 */
export const withCapabilityGuard = (
  Component: React.ComponentType<any>,
  capability: string | string[],
  options?: Omit<CapabilityGuardProps, "children" | "capability" | "capabilities">
) => {
  return (props: any) => (
    <CapabilityGuard
      capabilities={Array.isArray(capability) ? capability : [capability]}
      {...options}
    >
      <Component {...props} />
    </CapabilityGuard>
  );
};
