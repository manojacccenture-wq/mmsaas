import React from "react";
import { useAppSelector } from "@/app/store/hook";
import SuperAdminDashboardView from "@/features/Dashboard/components/views/SuperAdminDashboardView";
import TenantAdminDashboardView from "@/features/Dashboard/components/views/TenantAdminDashboardView";

/**
 * Dashboard — Shared entry point for all authenticated roles.
 *
 * Mounted at:
 *   /superadmin            → Super Admin view
 *   /app/:tenantId         → Tenant Admin view
 *
 * Role detection uses the existing Redux auth.activeContext pattern,
 * identical to getRoleConfig.ts — no new selectors needed.
 */
const Dashboard: React.FC = () => {
  const activeContext = useAppSelector((state) => state.auth.activeContext);

  // Super Admin has no tenantId in their context (global membership)
  const isSuperAdmin = !activeContext?.tenantId;

  if (isSuperAdmin) {
    return <SuperAdminDashboardView />;
  }

  return <TenantAdminDashboardView />;
};

export default Dashboard;
