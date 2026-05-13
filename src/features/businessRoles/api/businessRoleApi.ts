import { baseApi } from "@/app/store/api/baseApi";
import { get, post, del } from "@/app/store/api/apiHelpers";
import type { BusinessRole, Capability, AssignBusinessRolePayload } from "../types/businessRole.types";

export const businessRoleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─── Business Roles ───────────────────────────────────────────────────────
    getBusinessRoles: builder.query<{ success: boolean; data: BusinessRole[] }, void>({
      query: () => get("/v1/api/business-roles")(),
      providesTags: ["BusinessRole" as any],
    }),

    getBusinessRole: builder.query<{ success: boolean; data: BusinessRole }, string>({
      query: (id) => get(`/v1/api/business-roles/${id}`)(),
      providesTags: (_, __, id) => [
        { type: "BusinessRole" as const, id },
      ],
    }),

    createBusinessRole: builder.mutation<
      { success: boolean; data: BusinessRole },
      Partial<BusinessRole>
    >({
      query: (data) => post("/v1/api/business-roles")(data),
      invalidatesTags: ["BusinessRole" as any],
    }),

    updateBusinessRole: builder.mutation<
      { success: boolean; data: BusinessRole },
      { id: string } & Partial<BusinessRole>
    >({
      query: ({ id, ...data }) => ({ url: `/v1/api/business-roles/${id}`, method: "PUT", data }),
      invalidatesTags: (_, __, { id }) => [
        { type: "BusinessRole" as any, id },
        "BusinessRole" as any,
      ],
    }),

    deleteBusinessRole: builder.mutation<{ success: boolean }, string>({
      query: (id) => del(`/v1/api/business-roles/${id}`)(),
      invalidatesTags: ["BusinessRole" as any],
    }),

    // ─── Capabilities ─────────────────────────────────────────────────────────
    getCapabilities: builder.query<{ success: boolean; data: Capability[] }, void>({
      query: () => get("/v1/api/capabilities")(),
      providesTags: ["Capability" as any],
    }),

    // ─── Membership Assignment ────────────────────────────────────────────────
    assignBusinessRole: builder.mutation<
      { success: boolean; data: any },
      { membershipId: string } & AssignBusinessRolePayload
    >({
      query: ({ membershipId, ...data }) => ({
        url: `/v1/api/business-roles/memberships/${membershipId}/business-role`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Membership" as any, "BusinessRole" as any],
    }),
  }),
});

export const {
  useGetBusinessRolesQuery,
  useLazyGetBusinessRolesQuery,
  useGetBusinessRoleQuery,
  useCreateBusinessRoleMutation,
  useUpdateBusinessRoleMutation,
  useDeleteBusinessRoleMutation,
  useGetCapabilitiesQuery,
  useAssignBusinessRoleMutation,
} = businessRoleApi;
