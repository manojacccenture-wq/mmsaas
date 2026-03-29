import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";



import PasswordStrengthInput from "@/shared/components/UI/PasswordStrengthInput/PasswordStrengthInput";
import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";

import { clearError } from "@/features/auth/authSlice";
import { resetPasswordAsync } from "@/features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

// Validation
// const resetSchema = z
//   .object({
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });


const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


type ResetPasswordFormData = z.infer<typeof resetSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { status, error, resetPasswordEmail } = useAppSelector((state) => state.auth);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetSchema),
  });

  const isLoading = status === "loading";

  // Handle successful password reset
  useEffect(() => {
    if (status === "succeeded") {
      navigate("/");
    }
  }, [status, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    dispatch(clearError());

    if (!resetPasswordEmail) {
      return;
    }

    try {
      await dispatch(
        resetPasswordAsync({
          username: resetPasswordEmail,
          password: data.password,
          confirmPassword: data.confirmPassword,
          code: data.otp,
        })
      ).unwrap();
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordStrengthInput
            label="New Password"
            placeholder="Enter new password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
            disabled={isLoading}
            hideOnBlur={true}
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            disabled={isLoading}
          />

          <Input
            type="text"
            label="OTP Code"
            placeholder="Enter OTP"
            error={!!errors.otp}
            helperText={errors.otp?.message}
            {...register("otp")}
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;