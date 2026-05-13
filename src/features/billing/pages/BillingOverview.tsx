import React from "react";
import { useGetTenantSubscriptionQuery, useGetAvailablePlansQuery } from "../api/billingApi";
import TenantSubscriptionPanel from "../components/TenantSubscriptionPanel";
import Button from "@/shared/components/UI/Button/Button";

const BillingOverview: React.FC = () => {
  const { data: subscriptionRes, isLoading: subLoading, error: subError } = useGetTenantSubscriptionQuery({});
  const { data: plansRes, isLoading: plansLoading } = useGetAvailablePlansQuery({});

  const subscription = subscriptionRes?.data ?? null;
  const currentPlan = subscription?.planId ?? null;
  const availablePlans = plansRes?.data?.data || [];

  const errorMessage = subError
    ? (subError as any)?.data?.message || "Failed to load billing overview."
    : null;

  if (subLoading || plansLoading) {
    return <div className="p-6 text-gray-600 font-medium">Loading billing information...</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Billing & Subscription</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your workspace subscription, usage, and billing settings.</p>
        </div>
      </div>

      {/* ── Subscription Panel (reusable shared component) ── */}
      <TenantSubscriptionPanel
        subscription={subscription}
        isLoading={false}
        error={errorMessage}
      />

      {/* ── Available Plans Section ── */}
      {availablePlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-title)] mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((p: any) => {
              const isCurrentPlan = currentPlan?._id === p._id;

              return (
                <div
                  key={p._id}
                  className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                    isCurrentPlan
                      ? "border-[var(--color-primary-main)] ring-1 ring-[var(--color-primary-main)]"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    {isCurrentPlan && (
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-[var(--color-primary-main)] text-xs font-semibold rounded-full mb-4">
                        Current Plan
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <div className="mt-4 mb-6">
                      <span className="text-3xl font-extrabold">₹{p.price}</span>
                      <span className="text-gray-500 text-sm font-medium uppercase ml-1">/{p.billingCycle}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {p.maxUsers > 0 ? `Up to ${p.maxUsers} Users` : "Unlimited Users"}
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {p.maxProducts > 0 ? `Up to ${p.maxProducts} Products` : "Unlimited Products"}
                      </li>
                      {p.isTrialPlan && (
                        <li className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {p.trialDays} Days Free Trial
                        </li>
                      )}
                    </ul>
                  </div>
                  <Button variant={isCurrentPlan ? "outlineSecondary" : "primary"} className="w-full" disabled={isCurrentPlan}>
                    {isCurrentPlan ? "Current Plan" : "Request Upgrade"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingOverview;
