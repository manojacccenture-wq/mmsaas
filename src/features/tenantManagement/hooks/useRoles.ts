import { useGetTenantRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } from "../api/tenantApi";
import { mapRoleToUI } from "../api/roles.transform";
import { useAppDispatch } from "@/app/store/hook";
import { showToast } from "@/shared/components/Toast/api/toastSlice";
import type { RoleUI } from "../api/roles.types";

export const useRoles = (tenantId?: string) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, refetch } = useGetTenantRolesQuery(tenantId!, {
    skip: !tenantId,
  });

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const roles: RoleUI[] =
    data?.data?.map(mapRoleToUI) || [];

  const handleCreate = async (formData: any) => {
    try {
      await createRole({
        tenantId: tenantId!,
        data: {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
        },
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "Role created successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to create role";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleUpdate = async (roleId: string, formData: any) => {
    try {
      await updateRole({
        tenantId: tenantId!,
        roleId,
        data: {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
        },
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "Role updated successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to update role";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleDelete = async (roleId: string) => {
    try {
      await deleteRole({
        tenantId: tenantId!,
        roleId,
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "Role deleted successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to delete role";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    roles,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
