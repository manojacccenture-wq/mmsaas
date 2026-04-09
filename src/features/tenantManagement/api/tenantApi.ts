// features/tenantManagement/api/tenantApi.ts

import { baseApi } from "@/app/store/api/baseApi";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "http://localhost:5000/v1/api/tenant",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Tenant"],
    }),

    getTenantUsers: builder.query({
      query: (tenantId: string) => ({
        url: `http://localhost:5000/v1/api/tenant/${tenantId}/users`,
        method: "GET",
      }),
    }),

    createTenant: builder.mutation({
      query: (body) => ({
        url: "http://localhost:5000/v1/api/tenant/create-with-admin",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Tenant"],
    }),
    
  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantUsersQuery,
  useCreateTenantMutation,
} = tenantApi;