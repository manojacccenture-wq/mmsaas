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
  const { activeContext, mfaEnabled, backupCodeCount } = useAppSelector((state) => state.auth);
  const [isResetting, setIsResetting] = React.useState(false);
  const [resetError, setResetError] = React.useState("");

  // Super Admin has no tenantId in their context (global membership)
  const isSuperAdmin = !activeContext?.tenantId;

  const handleResetMfa = async () => {
    try {
      setIsResetting(true);
      setResetError("");
      const { default: authService } = await import("@/features/auth/api/authApi");
      const res = await authService.resetMyMfa();
      if (res.data?.success) {
        window.location.href = "/"; // Force login flow to trigger MFA setup
      }
    } catch (err: any) {
      setResetError(err.response?.data?.message || "Failed to reset MFA");
      setIsResetting(false);
    }
  };

  const renderBackupAlert = () => {
    if (!mfaEnabled || backupCodeCount >= 10) return null;

    return (
      <div className="bg-[var(--color-yellow-50)] border-l-4 border-[var(--color-yellow-400)] p-4 mb-6 mt-4 mx-6 rounded-md shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-yellow-800)]">Action Required: Authenticator Reset Recommended</h3>
            <p className="text-sm text-[var(--color-yellow-700)] mt-1">
              {backupCodeCount === 0 
                ? "You have used all your backup codes! You must reset your authenticator to avoid losing access." 
                : `You used a backup code and have ${backupCodeCount} left! Please reset your Authenticator.`}
            </p>
            {resetError && <p className="text-sm text-red-600 mt-1">{resetError}</p>}
          </div>
          <button 
            onClick={handleResetMfa}
            disabled={isResetting}
            className="px-4 py-2 bg-[var(--color-yellow-600)] text-white text-sm font-medium rounded hover:bg-[var(--color-yellow-700)] disabled:opacity-50"
          >
            {isResetting ? "Resetting..." : "Reset Authenticator"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderBackupAlert()}
      <div className="flex-1 overflow-auto">
        {isSuperAdmin ? <SuperAdminDashboardView /> : <TenantAdminDashboardView />}
      </div>
    </div>
  );
};

export default Dashboard;
