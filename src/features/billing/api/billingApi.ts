import { baseApi } from "@/app/store/api/baseApi";
import { get } from "@/app/store/api/apiHelpers";

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantSubscription: builder.query({
      query: () => get("/v1/api/billing/subscriptions/me")(),
      providesTags: ["TenantSubscription" as any],
    }),
    getAvailablePlans: builder.query({
      query: () => get("/v1/api/billing/plans")({ limit: 50, includeInactive: false }),
      providesTags: ["BillingPlan" as any],
    }),
    // Super Admin: fetch any tenant's subscription by tenantId
    getAdminTenantSubscription: builder.query({
      query: (tenantId: string) => get(`/v1/api/billing/subscriptions/tenant/${tenantId}`)(),
      providesTags: ( tenantId) => [{ type: "TenantSubscription" as any, id: tenantId }],
    }),
  }),
});

export const {
  useGetTenantSubscriptionQuery,
  useGetAvailablePlansQuery,
  useGetAdminTenantSubscriptionQuery,
} = billingApi;
