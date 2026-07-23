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
    getTenantRoles: builder.query({
      query: (tenantId: string) =>
        get(`/v1/api/tenant/${tenantId}/roles`)(),
      providesTags: ["TenantRole"],
    }),
    createTenant: builder.mutation({
      query: post("/v1/api/tenant/create-with-admin"),
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
    createRole: builder.mutation({
      query: ({ tenantId, data }: { tenantId: string; data: any }) =>
        post(`/v1/api/tenant/${tenantId}/roles`)(data),
      invalidatesTags: ["TenantRole"],
    }),
    updateRole: builder.mutation({
      query: ({ tenantId, roleId, data }: { tenantId: string; roleId: string; data: any }) =>
        put(`/v1/api/tenant/${tenantId}/roles/${roleId}`)(data),
      invalidatesTags: ["TenantRole"],
    }),
    deleteRole: builder.mutation({
      query: ({ tenantId, roleId }: { tenantId: string; roleId: string }) =>
        del(`/v1/api/tenant/${tenantId}/roles/${roleId}`)(),
      invalidatesTags: ["TenantRole"],
    }),

    // IAM & Global Roles Integration
    getGlobalRoles: builder.query({
      query: get("/v1/api/roles"),
      providesTags: ["TenantRole"],
    }),
    createGlobalRole: builder.mutation({
      query: (data: any) => post("/v1/api/roles")(data),
      invalidatesTags: ["TenantRole"],
    }),
    deleteGlobalRole: builder.mutation({
      query: (id: string) => ({ url: `/v1/api/roles/${id}`, method: "DELETE" }),
      invalidatesTags: ["TenantRole"],
    }),
    getIAMPolicies: builder.query({
      query: get("/v1/api/iam/policies"),
      providesTags: ["IAMPolicy" as any],
    }),
    createIAMPolicy: builder.mutation({
      query: (data: any) => post("/v1/api/iam/policies")(data),
      invalidatesTags: ["IAMPolicy" as any],
    }),
    attachPolicyToRole: builder.mutation({
      query: (data: { roleId: string; policyId: string }) => post("/v1/api/iam/policies/attach")(data),
      invalidatesTags: ["TenantRole"],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantUsersQuery,
  useGetTenantRolesQuery,
  useCreateTenantMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetUserTotpMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetGlobalRolesQuery,
  useCreateGlobalRoleMutation,
  useDeleteGlobalRoleMutation,
  useGetIAMPoliciesQuery,
  useCreateIAMPolicyMutation,
  useAttachPolicyToRoleMutation,
} = tenantApi;