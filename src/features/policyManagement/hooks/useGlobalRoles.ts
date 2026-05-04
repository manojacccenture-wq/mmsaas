import { useAppDispatch } from "@/app/store/hook";
import { showToast } from "@/shared/components/Toast/api/toastSlice";
import {
  useGetGlobalRolesQuery,
  useCreateGlobalRoleMutation,
  useDeleteGlobalRoleMutation,
} from "@/features/tenantManagement/api/tenantApi";
import type { CreateGlobalRoleFormData } from "../schema/globalRoles.schema";

/**
 * useGlobalRoles
 *
 * Encapsulates all data-fetching and mutation logic for Global Role management.
 * Components stay pure — no API calls, no toast logic, just UI.
 */
export const useGlobalRoles = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isFetching } = useGetGlobalRolesQuery({});
  const [createRole, { isLoading: isCreating }] = useCreateGlobalRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteGlobalRoleMutation();

  const roles = data?.data || [];

  const handleCreate = async (formData: CreateGlobalRoleFormData): Promise<boolean> => {
    try {
      await createRole({
        name:     formData.name,
        code:     formData.code.toUpperCase(),
        category: formData.category,
        level:    formData.level,
      }).unwrap();

      dispatch(showToast({ message: "Role created successfully", type: "success" }));
      return true;
    } catch (err: any) {
      const message = err?.data?.message || "Failed to create role";
      dispatch(showToast({ message, type: "error" }));
      return false;
    }
  };

  const handleDelete = async (roleId: string, roleName: string): Promise<boolean> => {
    try {
      await deleteRole(roleId).unwrap();
      dispatch(showToast({ message: `"${roleName}" deleted successfully`, type: "success" }));
      return true;
    } catch (err: any) {
      const message = err?.data?.message || "Failed to delete role";
      dispatch(showToast({ message, type: "error" }));
      return false;
    }
  };

  return {
    roles,
    isLoading,
    isFetching,
    isCreating,
    isDeleting,
    handleCreate,
    handleDelete,
  };
};
