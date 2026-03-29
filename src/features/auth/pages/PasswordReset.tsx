import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import PasswordStrengthInput from "@/shared/components/UI/PasswordStrengthInput/PasswordStrengthInput";

import {
  passwordResetSchema,
  type PasswordResetFormData,
} from "@/features/auth/schemas/passwordResetSchema";

const PasswordReset: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<PasswordResetFormData> = (data) => {
    console.log("Reset Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md  rounded-2xl  p-6 sm:p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {/* 🔐 SECURITY MESSAGE */}
        <div className="mb-4 p-3  border border-blue-200 rounded text-sm text-blue-700">
          For security reasons, you are required to reset your password after
          your first login. Please create a strong password that meets the
          security requirements below.
        </div>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* OTP */}
          <Input
            label="OTP"
            type="text"
            inputMode="numeric"
            maxLength={6}
            formatter={(value: string) =>
              value.replace(/\D/g, "").slice(0, 6)
            }
            error={!!errors.otp}
            helperText={errors.otp?.message}
            {...register("otp")}
          />

          {/* PASSWORD with strength */}
          <PasswordStrengthInput
            label="New Password"
            value={passwordValue || ""}
            onChange={(e) => setValue("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* CONFIRM PASSWORD */}
          <Input
            label="Confirm Password"
            type="password"
            showPasswordToggle
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;