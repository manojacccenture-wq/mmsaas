import { useMemo, useState, useEffect } from "react";
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
import { useGetFoodErpRolesQuery } from "../api/tenantApi";
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
    watch,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      role: user?.role || "", // This should eventually be the ID
      password: "",
      productIds: user?.productIds || [],
    },
  });

  const watchProductIds = watch("productIds");

  const [appRoleSelections, setAppRoleSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.productIds && user?.appRoles) {
      const initialSelections: Record<string, string> = {};
      user.productIds.forEach((pid, index) => {
        if (user.appRoles![index]) {
          initialSelections[pid] = user.appRoles![index];
        }
      });
      setAppRoleSelections(initialSelections);
    }
  }, [user]);

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
    const finalAppRoles = data.productIds?.map(pid => appRoleSelections[pid] || null) || [];
    await onSubmit({ ...data, appRoles: finalAppRoles });
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

        {/* Password (Only for Edit Mode now, if changing password manually) */}
        {isEdit && (
          <Input
            type="password"
            label="Password (Leave empty to keep current)"
            placeholder="Enter password"
            showPasswordToggle
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}

        {/* Assign Applications */}
        {availableProducts.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Assign Applications (Optional)</label>
            <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              {availableProducts.map((product: any) => {
                const isSelected = watchProductIds?.includes(product._id || product.code);
                const isFoodErp = product.name?.toLowerCase().includes("anas") || product.code === "ANAS_KITCHEN" || product.code === "FOOD_ERP";
                
                // Fetch FoodERP roles only if Anas Kitchen is selected
                const { data: foodErpRoles, isLoading: isLoadingRoles, isError } = useGetFoodErpRolesQuery(undefined, {
                  skip: !(isSelected && isFoodErp),
                });

                const dynamicRoleOptions = useMemo(() => {
                  if (!foodErpRoles) return [];
                  return foodErpRoles.map(role => ({ value: role, label: role }));
                }, [foodErpRoles]);

                return (
                  <div key={product.code} className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={product._id || product.code}
                        {...register("productIds")}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-800">{product.name}</span>
                    </label>
                    {isSelected && isFoodErp && (
                      <div className="ml-7">
                        <Select
                          label=""
                          placeholder={isLoadingRoles ? "Loading FoodERP roles..." : isError ? "Failed to load roles" : (dynamicRoleOptions.length === 0 ? "No roles available" : "Select FoodERP Role")}
                          options={dynamicRoleOptions}
                          value={appRoleSelections[product._id || product.code] || ""}
                          onChange={(e) => setAppRoleSelections(prev => ({
                            ...prev,
                            [product._id || product.code]: e.target.value
                          }))}
                          disabled={isLoadingRoles || isError || dynamicRoleOptions.length === 0}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
