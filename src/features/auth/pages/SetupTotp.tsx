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
import BackupCodesModal from "../components/BackupCodesModal";

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

  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // 🔥 STEP 2: verify
  const onSubmit: SubmitHandler<TotpSetupSchemaType> = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await authService.verifyMfaSetup({ token: data.otp });

      // ✅ SUCCESS
      if (res.data?.backupCodes) {
        setBackupCodes(res.data.backupCodes);
        setShowBackupModal(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setApiError(err.response?.data?.msg || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowBackupModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-center mb-4">
          Setup Authenticator
        </h2>

        <p className="text-sm text-muted text-center mb-4">
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
            <p className="text-danger text-sm text-center">{apiError}</p>
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

      <BackupCodesModal
        isOpen={showBackupModal}
        onClose={handleModalClose}
        backupCodes={backupCodes}
      />
    </div>
  );
};

export default SetupTotp;