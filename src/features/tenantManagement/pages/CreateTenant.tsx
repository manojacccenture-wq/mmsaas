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
      <h1 className="mb-6">
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

        {/* Assigned Products */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-semibold text-gray-700">Assign Products</label>
          <Controller
            name="products"
            control={control}
            defaultValue={["ANAS_KITCHEN"]}
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    checked={field.value?.includes("ANAS_KITCHEN")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), "ANAS_KITCHEN"]);
                      } else {
                        field.onChange((field.value || []).filter((v: string) => v !== "ANAS_KITCHEN"));
                      }
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Anas Kitchen App</p>
                    <p className="text-xs text-gray-500">Core restaurant management application</p>
                  </div>
                </label>
                {errors.products && <p className="text-xs text-red-500">{errors.products.message}</p>}
              </div>
            )}
          />
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100">
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