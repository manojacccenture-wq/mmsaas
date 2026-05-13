import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetSuperAdminStatsQuery } from "@/features/Dashboard/api/dashboardApi";
import StatCard from "@/features/Dashboard/components/widgets/StatCard";
import RecentActivityCard from "@/features/Dashboard/components/widgets/RecentActivityCard";
import QuickActionsCard from "@/features/Dashboard/components/widgets/QuickActionsCard";
import AlertBanner from "@/features/Dashboard/components/widgets/AlertBanner";
import Card from "@/shared/components/UI/Card/Card";

// ── Icons (inline SVG — no extra library) ─────────────────────────────────────
const IconTenants = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconActive = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconDemo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconPlans = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const demoStatusColors: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  activated: "bg-green-100 text-green-700",
  rejected:  "bg-red-100 text-red-700",
};

const SuperAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { data: statsRes, isLoading } = useGetSuperAdminStatsQuery({});
  const stats = statsRes?.data;

  const recentDemoRows = (stats?.recentDemoRequests ?? []).map((d: any) => ({
    primary: d.companyName,
    secondary: d.workEmail,
    badge: {
      label: d.status,
      color: demoStatusColors[d.status] ?? "bg-gray-100 text-gray-600",
    },
    meta: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "",
  }));

  const recentTenantRows = (stats?.recentTenants ?? []).map((t: any) => ({
    primary: t.name,
    secondary: `Mode: ${t.dataMode}`,
    badge: {
      label: t.isActive ? "Active" : "Inactive",
      color: t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
    },
    meta: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
  }));

  const expiringTrials: any[] = stats?.expiringTrials ?? [];

  const quickActions = [
    { label: "Create Tenant",        onClick: () => navigate("/superadmin/tenants/create"), variant: "primary" as const },
    { label: "Demo Requests",         onClick: () => navigate("/superadmin/demo-requests") },
    { label: "Manage Plans",          onClick: () => navigate("/superadmin/plans") },
    { label: "View All Tenants",      onClick: () => navigate("/superadmin/tenants") },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* ── Welcome Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Platform Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Trial Expiry Alerts ───────────────────────────────────────── */}
      {expiringTrials.length > 0 && (
        <div className="flex flex-col gap-2">
          {expiringTrials.slice(0, 2).map((t: any) => (
            <AlertBanner
              key={t.tenantId}
              variant="warning"
              message={`${t.tenantName} (${t.planName}) — trial expires in ${t.daysLeft} day${t.daysLeft !== 1 ? "s" : ""}`}
              action={{ label: "View Tenant", onClick: () => navigate(`/superadmin/tenants/${t.tenantId}`) }}
            />
          ))}
        </div>
      )}

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tenants"
          value={isLoading ? "—" : (stats?.totalTenants ?? 0)}
          icon={<IconTenants />}
          accent="indigo"
          isLoading={isLoading}
          onClick={() => navigate("/superadmin/tenants")}
        />
        <StatCard
          label="Active Tenants"
          value={isLoading ? "—" : (stats?.activeTenants ?? 0)}
          icon={<IconActive />}
          accent="green"
          isLoading={isLoading}
        />
        <StatCard
          label="Pending Demo Requests"
          value={isLoading ? "—" : (stats?.pendingDemoRequests ?? 0)}
          icon={<IconDemo />}
          accent="amber"
          isLoading={isLoading}
          onClick={() => navigate("/superadmin/demo-requests")}
        />
        <StatCard
          label="Active Plans"
          value={isLoading ? "—" : (stats?.activePlans ?? 0)}
          icon={<IconPlans />}
          accent="violet"
          isLoading={isLoading}
          onClick={() => navigate("/superadmin/plans")}
        />
      </div>

      {/* ── Recent Activity ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivityCard
          title="Recent Demo Requests"
          rows={recentDemoRows}
          isLoading={isLoading}
          emptyMessage="No demo requests yet."
          onViewAll={() => navigate("/superadmin/demo-requests")}
        />
        <RecentActivityCard
          title="Recent Tenants"
          rows={recentTenantRows}
          isLoading={isLoading}
          emptyMessage="No tenants created yet."
          onViewAll={() => navigate("/superadmin/tenants")}
        />
      </div>

      {/* ── Trial Expiry Watch ────────────────────────────────────────── */}
      {expiringTrials.length > 0 && (
        <Card padding="p-5" rounded="rounded-2xl" className="border border-amber-200 bg-amber-50">
          <h3 className="text-sm font-semibold text-amber-800 mb-4">
            ⏳ Trials Expiring This Week ({expiringTrials.length})
          </h3>
          <div className="divide-y divide-amber-100">
            {expiringTrials.map((t: any) => (
              <div key={t.tenantId} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.tenantName}</p>
                  <p className="text-xs text-gray-500">{t.planName}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-700">{t.daysLeft}d left</span>
                  <p className="text-xs text-gray-400">{new Date(t.trialEndsAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <QuickActionsCard actions={quickActions} />
    </div>
  );
};

export default SuperAdminDashboardView;
