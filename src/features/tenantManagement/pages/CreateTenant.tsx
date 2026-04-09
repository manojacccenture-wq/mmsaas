import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import Button from "@/shared/components/UI/Button/Button";

import {
  createTenantSchema,
  type CreateTenantFormData,
} from "@/features/tenantManagement/schema/createTenant.schema";

import { useCreateTenantMutation } from "../api/tenantApi";
import PasswordStrengthInput from "@/shared/components/UI/PasswordStrengthInput/PasswordStrengthInput";


const CreateTenant = () => {
  const navigate = useNavigate();
  const [createTenant, { isLoading }] = useCreateTenantMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
  });

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      await createTenant(data).unwrap();

      // ✅ Redirect after success
      navigate("/superadmin/tenants");
    } catch (err) {
      console.error("Create tenant failed", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow  ">
      <h1 className="text-xl font-semibold mb-6">
        Create Tenant
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Tenant Name */}
        <Input
          label="Tenant Name"
          placeholder="Enter tenant name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* Data Mode */}
        <Select
          label="Data Mode"
          {...register("dataMode")}
          error={!!errors.dataMode}
          helperText={errors.dataMode?.message}
          options={[
            { label: "Shared", value: "shared" },
            { label: "Isolated", value: "isolated" },
          ]}
        />

        {/* Email */}
        <Input
          label="Admin Email"
          placeholder="Enter email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* 🔥 Password Strength Input (IMPORTANT PART) */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordStrengthInput
              label="Password"
              placeholder="Enter strong password"
              value={field.value}
              onChange={field.onChange}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        {/* Password */}
        {/* <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          showPasswordToggle
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        /> */}

        {/* Role */}
        {/* <Select
          label="Role"
          {...register("roleId")}
          error={!!errors.roleId}
          helperText={errors.roleId?.message}
          options={[
            {
              label: "Tenant Admin",
              value: "69d4cfd5b6dd5c5d1d097537",
            },
            {
              label: "Manager",
              value: "role_manager_id",
            },
          ]}
        /> */}

        {/* Actions */}
        <div className="flex gap-64 mt-4">
          <Button
            type="button"
            variant="outlineSecondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Tenant"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTenant;