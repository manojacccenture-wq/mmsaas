import React from "react";

interface Plan {
  _id: string;
  name: string;
  code: string;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxProducts: number;
}

interface Subscription {
  status: string;
  startDate: string;
  trialEndsAt?: string;
  usageSnapshot?: {
    currentUsers: number;
    currentProducts: number;
  };
  planId: Plan;
}

interface Props {
  subscription: Subscription | null;
  isLoading: boolean;
  error?: string | null;
}

const calculateRemainingDays = (endDate: string): number => {
  const remaining = Math.ceil(
    (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return remaining > 0 ? remaining : 0;
};

const statusColors: Record<string, string> = {
  trial: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

/**
 * TenantSubscriptionPanel
 *
 * Reusable billing snapshot panel used in:
 *  - Tenant Admin → /app/:tenantId/billing (via BillingOverview)
 *  - Super Admin  → /superadmin/tenants/:tenantId (via TenantOverview)
 *
 * Accepts subscription data as props so both contexts can feed
 * their own RTK queries without coupling this component to a
 * specific API endpoint.
 */
const TenantSubscriptionPanel: React.FC<Props> = ({ subscription, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="p-6 text-gray-500 text-sm font-medium animate-pulse">
        Loading subscription data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  const currentPlan = subscription?.planId ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Trial badge */}
      {subscription?.status === "trial" && subscription?.trialEndsAt && (
        <div className="flex items-center gap-2 self-start bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <span className="text-sm font-semibold">Trial Active</span>
          <span className="text-xs font-medium ml-1 px-2 py-0.5 bg-yellow-200 rounded-md">
            {calculateRemainingDays(subscription.trialEndsAt)} days left
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── No subscription state ── */}
        {(!subscription || !currentPlan) ? (
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)]">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Current Plan</h3>
            <p className="text-sm text-gray-500">No active subscription found for this workspace.</p>
          </div>
        ) : (
          <>
            {/* ── Current Plan Card ── */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)]">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Current Plan</h3>

              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-primary-main)]">{currentPlan.name}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5 tracking-wide">{currentPlan.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{currentPlan.price}</p>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">/{currentPlan.billingCycle}</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[subscription.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Started On</span>
                  <span className="text-gray-800 font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
                </div>
                {subscription.trialEndsAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trial Ends</span>
                    <span className="text-gray-800 font-medium">{new Date(subscription.trialEndsAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Users</span>
                  <span className="text-gray-800 font-medium">{currentPlan.maxUsers > 0 ? currentPlan.maxUsers : "Unlimited"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Products</span>
                  <span className="text-gray-800 font-medium">{currentPlan.maxProducts > 0 ? currentPlan.maxProducts : "Unlimited"}</span>
                </div>
              </div>
            </div>

            {/* ── Usage Overview Card ── */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)]">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Usage Overview</h3>
              <div className="space-y-7">

                {/* Users */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Active Users</p>
                      <p className="text-xs text-gray-400 mt-0.5">Team members in workspace</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary-main)]">
                      {subscription.usageSnapshot?.currentUsers ?? 0}
                      <span className="text-gray-400 font-normal">
                        {" "}/ {currentPlan.maxUsers > 0 ? currentPlan.maxUsers : "∞"}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[var(--color-primary-main)] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: currentPlan.maxUsers > 0
                          ? `${Math.min(((subscription.usageSnapshot?.currentUsers ?? 0) / currentPlan.maxUsers) * 100, 100)}%`
                          : "15%"
                      }}
                    />
                  </div>
                </div>

                {/* Products */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Active Products</p>
                      <p className="text-xs text-gray-400 mt-0.5">Products enabled in workspace</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {subscription.usageSnapshot?.currentProducts ?? 0}
                      <span className="text-gray-400 font-normal">
                        {" "}/ {currentPlan.maxProducts > 0 ? currentPlan.maxProducts : "∞"}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: currentPlan.maxProducts > 0
                          ? `${Math.min(((subscription.usageSnapshot?.currentProducts ?? 0) / currentPlan.maxProducts) * 100, 100)}%`
                          : "15%"
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantSubscriptionPanel;
