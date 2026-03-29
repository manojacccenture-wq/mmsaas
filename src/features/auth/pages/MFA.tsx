import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";

import { mfaSchema, type MfaSchemaType } from "@/features/auth/schemas/auth.schema";


import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";

import { clearError } from "@/features/auth/authSlice";
import { verifyMfaAsync } from "@/features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

// import { maskEmail } from "@/shared/lib/helpers";



const MFA: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { status, error, mfaPending, user, otpType } = useAppSelector((state) => state.auth);


  const [timer, setTimer] = useState<number>(60);

const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
  setValue,
} = useForm<MfaSchemaType>({
  resolver: zodResolver(mfaSchema),
  mode: "onTouched",
  defaultValues: {
    otp: "",
  },
});

const otpValue = watch("otp");

  const isLoading = status === "loading";

  // Handle successful MFA verification
  useEffect(() => {
    if (!mfaPending && status === "succeeded") {
      if (user?.IsFirstTimeLogin) {
        navigate("/reset_Flow");
      } else {
        navigate("/dashboard");
      }
    }
  }, [mfaPending, status, navigate, user?.IsFirstTimeLogin]);

  const startTimer = (): void => {
    let count = 60;
    setTimer(count);

    const interval = setInterval(() => {
      count -= 1;
      setTimer(count);

      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => {
      // cleanup
      setTimer(0);
    };
  }, []);
  const onSubmit: SubmitHandler<MfaSchemaType> = async (data) => {
    dispatch(clearError());



    try {
      await dispatch(
        verifyMfaAsync({
          token: data.otp,
        })
      ).unwrap();
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const otpMessage =
    otpType === "email"
      ? "Enter the 6-digit code sent to your email"
      : otpType === "totp"
        ? "Enter the 6-digit code from your authenticator app"
        : "Enter the verification code";
  const title =
    otpType === "email"
      ? "Verify Email Code"
      : otpType === "totp"
        ? "Verify Authenticator Code"
        : "Verify Code";


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6">
          {title}
        </h2>


        <p className="text-center text-xs sm:text-sm text-gray-500 mb-2">
          {/* OTP sent to <span>{maskEmail(email ?? "")}</span> */}
        </p>

        <p className="text-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
          {otpMessage}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            formatter={(value: string) =>
              value.replace(/\D/g, "").slice(0, 6)
            }
            error={!!errors.otp}
            helperText={errors.otp?.message}
            {...register("otp")}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          {otpType === "totp" && (
            <p className="text-center text-xs text-gray-500">
              Code refreshes every 30 seconds in your authenticator app
            </p>
          )}

          {otpType === "email" && (
            <Button
              disabled={timer > 0}
              variant="outlinePrimary"
              onClick={() => {
                startTimer();
                // dispatch resend action
              }}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MFA;