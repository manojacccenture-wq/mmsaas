import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";


import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";

import { signInSchema, type SignInSchemaType } from "@/features/auth/schemas/auth.schema";
import { loginAsync } from "@/features/auth/authThunk";
import { clearError } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";


const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { status, error, mfaPending, isAuthenticated, otpType } = useAppSelector((state) => state.auth);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });



  const isLoading = status === "loading";

  useEffect(() => {
    if (mfaPending) {
      if (otpType === "email") {
        navigate("/verify-email-otp");
      } else if (otpType === "totp") {
        navigate("/verify-totp");
      }
      return;
    }

    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [mfaPending, isAuthenticated, otpType, navigate]);



  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    dispatch(clearError());

    try {
      await dispatch(loginAsync(data)).unwrap();
    } catch { /* empty */ }
  };

  const handleNavigateForgotPassword = (): void => {
    navigate("/forgotPassword");
  };

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xs flex flex-col">
        <div className="flex items-center justify-center gap-1.5 mb-6 sm:mb-8">
          <svg
            className="w-[46px] h-[46px]"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="46"
              height="46"
              fill="#dbc5c517"
              rx="8"
            />
          </svg>
          <p className="font-extrabold text-base text-text-primary">
            MSAAS
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-5 mb-6">
            <Input
              type="email"
              placeholder="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
            />

            <Input
              type="password"
              placeholder="Password"
              error={!!errors.password}
              showPasswordToggle
              {...register("password")}
              helperText={errors.password?.message}

            />

            {/* <div className="flex gap-3 items-center">
              <Checkbox
                checked={rememberMe}
                label="Remember me"
                onChange={(checked: boolean) =>
                  setValue("rememberMe", checked)
                }
                {...register("rememberMe")}
                disabled={isLoading}
              />
            </div> */}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="font-normal text-[#3a3f51] text-center text-sm sm:text-base">
              <a
                href="#"
                className="text-text-primary hover:underline"
                onClick={handleNavigateForgotPassword}
              >
                Forgot password?
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;