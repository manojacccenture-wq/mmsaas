import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import authService from "@/features/auth/api/authApi";

import {
  totpSetupSchema,
  type TotpSetupSchemaType,
} from "@/features/auth/schemas/auth.schema";

const SetupTotp: React.FC = () => {
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TotpSetupSchemaType>({
    resolver: zodResolver(totpSetupSchema),
    mode: "onTouched",
    defaultValues: {
      otp: "",
    },
  });

  // 🔥 STEP 1: get QR
  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await authService.enableMfa();
        setQrCode(res.data?.qrCode);
      } catch (err: any) {
        setApiError(err.response?.data?.msg || "Failed to load QR");
      }
    };

    fetchQr();
  }, []);

  // 🔥 STEP 2: verify
  const onSubmit: SubmitHandler<TotpSetupSchemaType> = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      await authService.verifyMfaSetup({ token: data.otp });

      // ✅ SUCCESS
      navigate("/dashboard");
    } catch (err: any) {
      setApiError(err.response?.data?.msg || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">
          Setup Authenticator
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Scan this QR code using Google Authenticator
        </p>

        {qrCode && (
          <div className="flex justify-center mb-4">
            <img src={qrCode} alt="QR Code" />
          </div>
        )}

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            maxLength={6}
            formatter={(value: string) =>
              value.replace(/\D/g, "").slice(0, 6)
            }
            error={!!errors.otp}
            helperText={errors.otp?.message}
            {...register("otp")}
          />

          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Enable"}
          </Button>
        </form>

        <Button
          variant="outlinePrimary"
          className="w-full mt-2"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SetupTotp;