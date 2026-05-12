import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/UI/Button/Button";
import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import { useCreatePlanMutation } from "../api/planApi";
import {
  createPlanSchema,
  type CreatePlanFormData,
} from "../schema/createPlan.schema";

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const [createPlan, { isLoading }] = useCreatePlanMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof createPlanSchema>, any, CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      billingCycle: "monthly",
      price: 0,
      maxUsers: 0,
      maxProducts: 0,
    },
  });

  const onSubmit: SubmitHandler<CreatePlanFormData> = async (data) => {
    try {
      await createPlan(data).unwrap();
      navigate("/superadmin/plans");
    } catch (err) {
      console.error("Create plan failed", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="mb-6 text-xl font-semibold">Create Subscription Plan</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Plan Name"
          placeholder="e.g. Starter"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <Input
          label="Plan Code"
          placeholder="e.g. STARTER"
          {...register("code")}
          error={!!errors.code}
          helperText={errors.code?.message}
        />

        <Input
          label="Price"
          type="number"
          placeholder="0"
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        <Select
          label="Billing Cycle"
          {...register("billingCycle")}
          error={!!errors.billingCycle}
          helperText={errors.billingCycle?.message}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
            { label: "Lifetime", value: "lifetime" },
          ]}
        />

        <Input
          label="Max Users"
          type="number"
          placeholder="0 (unlimited)"
          {...register("maxUsers")}
          error={!!errors.maxUsers}
          helperText={errors.maxUsers?.message}
        />

        <Input
          label="Max Products"
          type="number"
          placeholder="0 (unlimited)"
          {...register("maxProducts")}
          error={!!errors.maxProducts}
          helperText={errors.maxProducts?.message}
        />

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100">
          <Button type="button" variant="outlineSecondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Plan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlan;
