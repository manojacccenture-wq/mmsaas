import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";


import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import Checkbox from "@/shared/components/UI/CheckBox/Checkbox";
import PasswordStrengthInput from "@/shared/components/UI/PasswordStrengthInput/PasswordStrengthInput";

import { signUpSchema } from "@/features/auth/schemas/auth.schema";
import { clearError } from "@/features/auth/authSlice";
import { registerAsync } from "@/features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

type SignUpFormData = {
  fullName: string;
  identifier: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  marketingConsent: boolean;
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { status, error, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      identifier: "",
      password: "",
      confirmPassword: "",
      terms: false,
      marketingConsent: false,
    },
  });

  const identifier = watch("identifier");
  const isLoading = status === "loading";

  const detectedType = useMemo<"email" | "phone" | null>(() => {
    if (!identifier) return null;
    if (identifier.includes("@")) return "email";
    if (identifier.startsWith("+") || /^[0-9]+$/.test(identifier))
      return "phone";
    return null;
  }, [identifier]);

  // Handle successful registration
  useEffect(() => {
    if (user && status === "succeeded") {
      navigate("/dashboard");
    }
  }, [user, status, navigate]);

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    dispatch(clearError());

    const normalizedIdentifier = data.identifier.trim().toLowerCase();

    try {
      await dispatch(
        registerAsync({
          fullName: data.fullName.trim(),
          email: normalizedIdentifier,
          password: data.password || null,
          terms: data.terms,
          marketingConsent: data.marketingConsent,
        })
      ).unwrap();
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          {/* FULL NAME */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register("fullName")}
            disabled={isLoading}
          />

          {/* EMAIL OR PHONE */}
          <Input
            label="Email or Mobile Number"
            placeholder="Enter your email or mobile number"
            helperText={
              errors.identifier?.message ||
              "We'll use this to create your account"
            }
            error={!!errors.identifier}
            {...register("identifier")}
            disabled={isLoading}
          />

          {/* PASSWORD (ONLY FOR EMAIL) */}
          {detectedType === "email" && (
            <>
              <PasswordStrengthInput
                label="Password"
                placeholder="Enter password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                disabled={isLoading}
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
            </>
          )}

          {/* TERMS */}
          <Checkbox
            {...register("terms")}
            label={
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  target="_blank"
                  className="text-[#00bfa6] underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  target="_blank"
                  className="text-[#00bfa6] underline"
                >
                  Privacy Policy
                </a>
              </span>
            }
            disabled={isLoading}
          />
          {errors.terms && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.terms.message}
            </p>
          )}

          {/* MARKETING CONSENT */}
          <Checkbox
            {...register("marketingConsent")}
            label="I agree to receive marketing emails"
            disabled={isLoading}
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading
              ? detectedType === "email"
                ? "Creating Account..."
                : "Sending OTP..."
              : detectedType === "email"
              ? "Create Account"
              : "Send OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;