import { useGetTenantUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from "../api/tenantApi";
import { mapTenantUserToUI } from "../api/tenant.transform";
import { useAppDispatch } from "@/app/store/hook";
import { showToast } from "@/shared/components/Toast/api/toastSlice";
import type { TenantUserUI } from "../api/tenant.types";

export const useUsers = (tenantId?: string) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, refetch } = useGetTenantUsersQuery(tenantId!, {
    skip: !tenantId,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users: TenantUserUI[] =
    data?.data?.map(mapTenantUserToUI) || [];

  const handleCreate = async (formData: any) => {
    try {
      await createUser({
        tenantId: tenantId!,
        data: {
          email: formData.email,
          businessRoleId: formData.role, // Mapping form 'role' to 'businessRoleId'
          password: formData.password,
        },
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "User created successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to create user";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleUpdate = async (userId: string, formData: any) => {
    try {
      const updateData: any = {
        email: formData.email,
        businessRoleId: formData.role, // Mapping form 'role' to 'businessRoleId'
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUser({
        tenantId: tenantId!,
        userId,
        data: updateData,
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "User updated successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to update user";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser({
        tenantId: tenantId!,
        userId,
      }).unwrap();
      await refetch();
      dispatch(showToast({ message: "User deleted successfully", type: "success" }));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to delete user";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    users,
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
