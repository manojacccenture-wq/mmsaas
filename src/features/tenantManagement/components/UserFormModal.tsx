import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/components/Modal/Modal";
import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import Button from "@/shared/components/UI/Button/Button";
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../schema/users.schema";
import { useGetGlobalRolesQuery } from "../api/tenantApi";
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

  // 🔥 Fetch roles dynamically from the backend
  const { data: rolesData, isLoading: rolesLoading } = useGetGlobalRolesQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      role: user?.role || "", // This should eventually be the ID
      password: "",
    },
  });

  // Map roles to select options format
  const roleOptions = useMemo(() => {
    if (!rolesData?.data) return [];
    return rolesData.data.map((role: any) => ({
      value: role._id, // Use _id as the value for the backend
      label: role.name
    }));
  }, [rolesData]);

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
