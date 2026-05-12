import { baseApi } from "@/app/store/api/baseApi";
import { get, post, put, del } from "@/app/store/api/apiHelpers";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: ({ page = 1, limit = 10, includeInactive = false }: { page?: number; limit?: number; includeInactive?: boolean }) =>
        get("/v1/api/billing/plans")({ page, limit, includeInactive }),
      providesTags: ["BillingPlan" as any],
    }),
    getPlanById: builder.query({
      query: (id: string) => get(`/v1/api/billing/plans/${id}`)(),
      providesTags: (result, error, id) => [{ type: "BillingPlan" as any, id }],
    }),
    createPlan: builder.mutation({
      query: (data: any) => post("/v1/api/billing/plans")(data),
      invalidatesTags: ["BillingPlan" as any],
    }),
    updatePlan: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => put(`/v1/api/billing/plans/${id}`)(data),
      invalidatesTags: ["BillingPlan" as any],
    }),
    deactivatePlan: builder.mutation({
      query: (id: string) => del(`/v1/api/billing/plans/${id}`)(),
      invalidatesTags: ["BillingPlan" as any],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeactivatePlanMutation,
} = planApi;
