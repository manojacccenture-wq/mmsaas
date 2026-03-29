import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";



import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";

import { clearError } from "@/features/auth/authSlice";
import { requestPasswordResetAsync } from "@/features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

//  Username validation (ADM-001 format)
// const forgotPasswordSchema = z.object({
//   identifier: z
//     .string()
//     .min(1, "Username, email or phone is required")
//     .refine(
//       (value) => {
//         const usernameRegex = /^[A-Z]{3}-\d{3}$/;
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

//         return (
//           usernameRegex.test(value) ||
//           emailRegex.test(value) ||
//           phoneRegex.test(value)
//         );
//       },
//       {
//         message:
//           "Enter valid Username (ADM-001), Email or Phone number",
//       }
//     ),
// });

// const forgotPasswordSchema = z.object({
//   identifier: z
//     .string()
//     .trim()
//     .toLowerCase()
//     .min(1, { message: "Email is required" })
//     .pipe(z.email({ message: "Enter a valid email address" })),
// });

const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 5 characters" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { status, error, resetPasswordEmail } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
    },
  });

  const isLoading = status === "loading";

  // If password reset was successful, navigate to reset password page
  useEffect(() => {
    if (resetPasswordEmail && status === "pending") {
      navigate("/reset-password", {
        state: { identifier: resetPasswordEmail },
      });
    }
  }, [resetPasswordEmail, status, navigate]);

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    dispatch(clearError());

    const value = data.identifier?.trim();

    try {
      dispatch(requestPasswordResetAsync({ identifier: value })).unwrap();
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md rounded-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your username to reset your password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter the username"
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            {...register("identifier")}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;