// features/tenantManagement/api/tenantApi.ts

import { baseApi } from "@/app/store/api/baseApi";
import { get, post, put, del } from "@/app/store/api/apiHelpers"

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: get("/v1/api/tenant"),
      providesTags: ["Tenant"],
    }),
    getTenantUsers: builder.query({
      query: (tenantId: string) =>
        get(`/v1/api/tenant/${tenantId}/users`)(),
      providesTags: ["TenantUser"],
    }),
    createTenant: builder.mutation({
      query: post("/v1/api/tenant/create-with-admin"),
      invalidatesTags: ["Tenant"],
    }),
    deleteTenant: builder.mutation({
      query: (tenantId: string) =>
        del(`/v1/api/tenant/${tenantId}`)(),
      invalidatesTags: ["Tenant"],
    }),
    createUser: builder.mutation({
      query: ({ tenantId, data }: { tenantId: string; data: any }) =>
        post(`/v1/api/tenant/${tenantId}/users`)(data),
      invalidatesTags: ["TenantUser"],
    }),
    updateUser: builder.mutation({
      query: ({ tenantId, userId, data }: { tenantId: string; userId: string; data: any }) =>
        put(`/v1/api/tenant/${tenantId}/users/${userId}`)(data),
      invalidatesTags: ["TenantUser"],
    }),
    deleteUser: builder.mutation({
      query: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
        del(`/v1/api/tenant/${tenantId}/users/${userId}`)(),
      invalidatesTags: ["TenantUser"],
    }),
    resetUserTotp: builder.mutation({
      query: ({ userId }: { userId: string }) =>
        post(`/v1/api/users/${userId}/reset-totp`)(),
      invalidatesTags: ["TenantUser"],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantUsersQuery,
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetUserTotpMutation,
} = tenantApi;