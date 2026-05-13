import React from "react";
import { useParams } from "react-router-dom";
import { useGetAdminTenantSubscriptionQuery } from "@/features/billing/api/billingApi";
import TenantSubscriptionPanel from "@/features/billing/components/TenantSubscriptionPanel";

const TenantOverview: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();

  const {
    data: subscriptionRes,
    isLoading,
    error,
  } = useGetAdminTenantSubscriptionQuery(tenantId!, { skip: !tenantId });

  const subscription = subscriptionRes?.data ?? null;
  const errorMessage = error
    ? (error as any)?.data?.message || "Failed to load billing data."
    : null;

  return (
    <div className="p-6 flex flex-col gap-8">
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
          isLoading={isLoading}
          error={errorMessage}
        />
      </section>
    </div>
  );
};

export default TenantOverview;
