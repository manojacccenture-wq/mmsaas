import { baseApi } from "@/app/store/api/baseApi";
import { get } from "@/app/store/api/apiHelpers";

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantSubscription: builder.query({
      query: () => get("/v1/api/billing/subscriptions/me")(),
      providesTags: ["TenantSubscription" as any],
    }),
  }),
});

export const {
  useGetTenantSubscriptionQuery,
} = billingApi;
