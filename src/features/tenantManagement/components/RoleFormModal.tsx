import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/components/Modal/Modal";
import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import Checkbox from "@/shared/components/UI/CheckBox/CheckBox";
import { createRoleSchema, updateRoleSchema, type CreateRoleFormData, type UpdateRoleFormData } from "../schema/roles.schema";
import { AVAILABLE_PERMISSIONS, getPermissionsByCategory } from "../config/permissionsConfig";
import type { RoleUI } from "../api/roles.types";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleFormData | UpdateRoleFormData) => Promise<void>;
  isLoading: boolean;
  role?: RoleUI;
}

const RoleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  role,
}: RoleFormModalProps) => {
  const isEdit = !!role;
  const schema = isEdit ? updateRoleSchema : createRoleSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateRoleFormData | UpdateRoleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissions: role?.permissions || [],
    },
  });



  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateRoleFormData | UpdateRoleFormData) => {
    await onSubmit(data);
    handleClose();
  };

  const categories = getPermissionsByCategory();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={
        <h2>
          {isEdit ? "Edit Role" : "Create Role"}
        </h2>
      }
      width="600px"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        {/* Role Name */}
        <Input
          label="Role Name"
          placeholder="Enter role name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* Description */}
        <Input
          label="Description (Optional)"
          placeholder="Enter role description"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        {/* Permissions */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-heading">
            Permissions
          </label>

          {Object.entries(categories).map(([category, perms]) => (
            <div key={category} className="space-y-2">
              <h4 className="capitalize">
                {category}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                {perms.map((permValue) => {
                  const permission = AVAILABLE_PERMISSIONS.find(p => p.value === permValue);
                  if (!permission) return null;

                  return (
                    <Controller
                      key={permission.value}
                      name="permissions"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          label={permission.label}
                          checked={field.value.includes(permission.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, permission.value]);
                            } else {
                              field.onChange(
                                field.value.filter((p: string) => p !== permission.value)
                              );
                            }
                          }}
                        />
                      )}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {errors.permissions && (
            <p className="text-sm text-danger mt-2">
              {errors.permissions.message}
            </p>
          )}
        </div>

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

export default RoleFormModal;
