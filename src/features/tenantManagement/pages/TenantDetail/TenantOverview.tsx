import React from "react";
import { useParams } from "react-router-dom";
import { useGetAdminTenantSubscriptionQuery } from "@/features/billing/api/billingApi";
import { useGetTenantUsersQuery } from "@/features/tenantManagement/api/tenantApi";
import TenantSubscriptionPanel from "@/features/billing/components/TenantSubscriptionPanel";

const TenantOverview: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();

  const {
    data: subscriptionRes,
    isLoading: subLoading,
    error: subError,
  } = useGetAdminTenantSubscriptionQuery(tenantId!, { skip: !tenantId });

  const {
    data: usersRes,
    isLoading: usersLoading,
  } = useGetTenantUsersQuery(tenantId!, { skip: !tenantId });

  const subscription = subscriptionRes?.data ?? null;
  const users = usersRes?.data ?? [];
  const userCount = users.length;
  const errorMessage = subError
    ? (subError as any)?.data?.message || "Failed to load billing data."
    : null;

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {usersLoading ? "—" : userCount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Subscription Status</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
            {subLoading ? "—" : (subscription?.status ?? "None")}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Plan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {subLoading ? "—" : (subscription?.planId?.name ?? "—")}
          </p>
        </div>
      </div>

      {/* ── Billing & Subscription Section ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-title)]">
            Billing & Subscription
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Current plan, usage limits, and subscription lifecycle for this tenant.
          </p>
        </div>

        <TenantSubscriptionPanel
          subscription={subscription}
          isLoading={subLoading}
          error={errorMessage}
        />
      </section>
    </div>
  );
};

export default TenantOverview;
