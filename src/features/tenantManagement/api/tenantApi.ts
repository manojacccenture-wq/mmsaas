// features/tenantManagement/api/tenantApi.ts

import { baseApi } from "@/app/store/api/baseApi";
import { get, post } from "@/app/store/api/apiHelpers"

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: get("/v1/api/tenant"),
      providesTags: ["Tenant"],
    }),
    getTenantUsers: builder.query({
      query: (tenantId: string) =>
        get(`/v1/api/tenant/${tenantId}/users`)(),
    }),


    createTenant: builder.mutation({
      query: post("/v1/api/tenant/create-with-admin"),
      invalidatesTags: ["Tenant"],
    }),

  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantUsersQuery,
  useCreateTenantMutation,
} = tenantApi;