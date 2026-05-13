import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTenantSubscriptionQuery } from "@/features/billing/api/billingApi";
import TenantSubscriptionPanel from "@/features/billing/components/TenantSubscriptionPanel";
import StatCard from "@/features/Dashboard/components/widgets/StatCard";
import QuickActionsCard from "@/features/Dashboard/components/widgets/QuickActionsCard";
import AlertBanner from "@/features/Dashboard/components/widgets/AlertBanner";

const calculateRemainingDays = (endDate: string): number => {
  const remaining = Math.ceil(
    (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return remaining > 0 ? remaining : 0;
};

const TenantAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();

  const { data: subscriptionRes, isLoading } = useGetTenantSubscriptionQuery({});
  const subscription = subscriptionRes?.data ?? null;
  const currentPlan = subscription?.planId ?? null;

  const isTrial = subscription?.status === "trial";
  const trialDaysLeft = subscription?.trialEndsAt
    ? calculateRemainingDays(subscription.trialEndsAt)
    : 0;

  const currentUsers = subscription?.usageSnapshot?.currentUsers ?? 0;
  const currentProducts = subscription?.usageSnapshot?.currentProducts ?? 0;
  const maxUsers = currentPlan?.maxUsers ?? 0;
  // const maxProducts = currentPlan?.maxProducts ?? 0;

  const quickActions = [
    { label: "Manage Users",  onClick: () => navigate(`/app/${tenantId}/users`),   variant: "primary" as const },
    { label: "Manage Roles",  onClick: () => navigate(`/app/${tenantId}/roles`) },
    { label: "View Billing",  onClick: () => navigate(`/app/${tenantId}/billing`) },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* ── Welcome Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Workspace Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Trial Warning Banner ──────────────────────────────────────── */}
      {isTrial && (
        <AlertBanner
          variant={trialDaysLeft <= 3 ? "error" : "warning"}
          message={
            trialDaysLeft > 0
              ? `Your trial is active — ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} remaining. Upgrade to keep full access.`
              : "Your trial has expired. Please upgrade your plan to continue."
          }
          action={{ label: "View Billing", onClick: () => navigate(`/app/${tenantId}/billing`) }}
        />
      )}

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Users"
          value={isLoading ? "—" : currentUsers}
          accent="indigo"
          isLoading={isLoading}
          onClick={() => navigate(`/app/${tenantId}/users`)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          }
        />
        <StatCard
          label="User Limit"
          value={isLoading ? "—" : (maxUsers > 0 ? maxUsers : "∞")}
          accent="gray"
          isLoading={isLoading}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        />
        <StatCard
          label="Active Products"
          value={isLoading ? "—" : currentProducts}
          accent="green"
          isLoading={isLoading}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          }
        />
        <StatCard
          label={isTrial ? "Trial Days Left" : "Plan Status"}
          value={isLoading ? "—" : (isTrial ? `${trialDaysLeft}d` : (subscription?.status ?? "—"))}
          accent={isTrial && trialDaysLeft <= 3 ? "red" : isTrial ? "amber" : "green"}
          isLoading={isLoading}
          onClick={() => navigate(`/app/${tenantId}/billing`)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          }
        />
      </div>

      {/* ── Subscription Panel ────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-title)] mb-4">Subscription</h2>
        <TenantSubscriptionPanel
          subscription={subscription}
          isLoading={isLoading}
          error={null}
        />
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <QuickActionsCard actions={quickActions} />
    </div>
  );
};

export default TenantAdminDashboardView;
