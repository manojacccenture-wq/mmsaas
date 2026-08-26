import {  useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RootState } from "@/app/store/store";
import Modal from "@/shared/components/Modal/Modal";
import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import Button from "@/shared/components/UI/Button/Button";
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../schema/users.schema";
import { useLazyGetBusinessRolesQuery } from "@/features/businessRoles/api/businessRoleApi";
import type { TenantUserUI } from "../api/tenant.types";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>;
  isLoading: boolean;
  user?: TenantUserUI;
}

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  user,
}: UserFormModalProps) => {
  const isEdit = !!user;
  const schema = isEdit ? updateUserSchema : createUserSchema;

  const activeContext = useSelector((state: RootState) => state.auth.activeContext);
  const availableProducts = activeContext?.products || [];

  // 🔥 Fetch business roles lazily only on dropdown interaction
  const [triggerFetch, { data: rolesRes, isLoading: rolesLoading }] = useLazyGetBusinessRolesQuery();

  const handleRoleFocus = () => {
    triggerFetch();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      role: user?.role || "", // This should eventually be the ID
      password: "",
      productIds: [],
    },
  });

  // Map business roles to select options format
  const roleOptions = useMemo(() => {
    if (!rolesRes?.data) return [];
    return rolesRes.data.map((role: any) => ({
      value: role._id, 
      label: role.name
    }));
  }, [rolesRes]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={
        <h2>
          {isEdit ? "Edit User" : "Add User"}
        </h2>
      }
      width="500px"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <Input
          label="Email"
          placeholder="Enter email address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Role Select - Now Dynamic */}
        <Select
          label="Role"
          placeholder={rolesLoading ? "Loading roles..." : "Select a role"}
          options={roleOptions}
          {...register("role")}
          onFocus={handleRoleFocus}
          error={!!errors.role}
          helperText={errors.role?.message}
          disabled={rolesLoading}
        />

        {/* Password */}
        <Input
          type="password"
          label={isEdit ? "Password (Leave empty to keep current)" : "Password"}
          placeholder="Enter password"
          showPasswordToggle
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* Assign Applications */}
        {!isEdit && availableProducts.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Assign Applications (Optional)</label>
            <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              {availableProducts.map((product: any) => (
                <label key={product.code} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={product._id || product.code}
                    {...register("productIds")}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-800">{product.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outlineSecondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
