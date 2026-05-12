import React from "react";
import { useGetTenantSubscriptionQuery, useGetAvailablePlansQuery } from "../api/billingApi";
import Button from "@/shared/components/UI/Button/Button";

const BillingOverview: React.FC = () => {
  const { data: subscriptionRes, isLoading: subLoading, error: subError } = useGetTenantSubscriptionQuery({});
  console.log('subscriptionRes: ', subscriptionRes)
  const { data: plansRes, isLoading: plansLoading } = useGetAvailablePlansQuery({});

  const subscription = subscriptionRes?.data ?? null;
  console.log('subscription: ', subscription)
  const currentPlan = subscription?.planId ?? null;
  console.log('currentPlan: ', currentPlan)
  const availablePlans = plansRes?.data?.data || [];

  const errorMessage = subError ? (subError as any)?.data?.message || "Failed to load billing overview." : null;

  if (subLoading || plansLoading) {
    return <div className="p-6 text-gray-600 font-medium">Loading billing information...</div>;
  }

  if (errorMessage) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Remove the early return that blocked the whole page

  // Calculate Trial Remaining Days
  const calculateRemainingDays = (endDate: string) => {
    const remaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Billing & Subscription</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your workspace subscription, usage, and billing settings.</p>
        </div>
        {subscription?.status === "trial" && subscription?.trialEndsAt && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <span className="text-sm font-semibold">Trial Active</span>
            <span className="text-xs font-medium ml-2 px-2 py-0.5 bg-yellow-200 rounded-md">
              {calculateRemainingDays(subscription.trialEndsAt)} days left
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(!subscription || !currentPlan) ? (
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)]">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Plan</h2>
            <p className="text-gray-600">No active subscription found for this workspace.</p>
          </div>
        ) : (
          <>
            {/* Current Plan Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)] flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Current Plan</h2>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-3xl font-bold text-[var(--color-primary-main)]">{currentPlan.name}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">{currentPlan.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">₹{currentPlan.price}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">/{currentPlan.billingCycle}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="text-gray-900 font-semibold capitalize">{subscription.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Started On</span>
                    <span className="text-gray-900 font-semibold">{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                  {subscription.trialEndsAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Trial Ends</span>
                      <span className="text-gray-900 font-semibold">{new Date(subscription.trialEndsAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Usage Overview Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-neutral-20)]">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Usage Overview</h2>
              <div className="space-y-8">
                {/* Users Limit */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Active Users</p>
                      <p className="text-xs text-gray-500 mt-1">Number of team members in workspace</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary-main)]">
                      {subscription.usageSnapshot?.currentUsers || 0} <span className="text-gray-400 font-medium">/ {currentPlan.maxUsers > 0 ? currentPlan.maxUsers : "Unlimited"}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-[var(--color-primary-main)] h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: currentPlan.maxUsers > 0 ? `${Math.min(((subscription.usageSnapshot?.currentUsers || 0) / currentPlan.maxUsers) * 100, 100)}%` : "15%" }}
                    ></div>
                  </div>
                </div>

                {/* Products Limit */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Active Products</p>
                      <p className="text-xs text-gray-500 mt-1">Number of products enabled</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {subscription.usageSnapshot?.currentProducts || 0} <span className="text-gray-400 font-medium">/ {currentPlan.maxProducts > 0 ? currentPlan.maxProducts : "Unlimited"}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: currentPlan.maxProducts > 0 ? `${Math.min(((subscription.usageSnapshot?.currentProducts || 0) / currentPlan.maxProducts) * 100, 100)}%` : "15%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Available Plans Section */}
      {availablePlans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-title)] mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((p: any) => {
              const isCurrentPlan = currentPlan?._id === p._id;
              
              return (
                <div key={p._id} className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between transition-all hover:shadow-md ${isCurrentPlan ? 'border-[var(--color-primary-main)] ring-1 ring-[var(--color-primary-main)]' : 'border-gray-200'}`}>
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
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {p.maxUsers > 0 ? `Up to ${p.maxUsers} Users` : 'Unlimited Users'}
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {p.maxProducts > 0 ? `Up to ${p.maxProducts} Products` : 'Unlimited Products'}
                      </li>
                      {p.isTrialPlan && (
                        <li className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {p.trialDays} Days Free Trial
                        </li>
                      )}
                    </ul>
                  </div>
                  <Button 
                    variant={isCurrentPlan ? "outlineSecondary" : "primary"} 
                    className="w-full"
                    disabled={isCurrentPlan}
                  >
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
