import { baseApi } from "@/app/store/api/baseApi";
import { get } from "@/app/store/api/apiHelpers";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminStats: builder.query({
      query: () => get("/v1/api/billing/admin/stats")(),
      providesTags: ["DashboardStats" as any],
    }),
  }),
});

export const { useGetSuperAdminStatsQuery } = dashboardApi;
