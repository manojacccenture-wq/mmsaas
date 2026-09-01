import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import Button from "@/shared/components/UI/Button/Button";
import authService from "../api/authApi";
import { useAppDispatch } from "@/app/store/hook";
import { showToast } from "@/shared/components/Toast/api/toastSlice";

// ----------------------------------------------------------------------
// 1. Zod Validation Schema
// ----------------------------------------------------------------------
const demoRequestSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  workEmail: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) =>
        !email.endsWith("@gmail.com") && !email.endsWith("@yahoo.com"),
      { message: "Please use your official work email" }
    ),
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(1, "Please select an industry"),
  expectedUsers: z.coerce
    .number()
    .min(1, "Must have at least 1 user"),
  useCase: z.string().min(3, "Please briefly describe your use case"),
  phoneNumber: z.string().optional(),
});

export type DemoRequestSchemaType = z.infer<typeof demoRequestSchema>;

// Industry options
const INDUSTRY_OPTIONS = [
  { label: "Select industry", value: "" },
  { label: "Restaurant / Food Service", value: "restaurant" },
  { label: "Retail", value: "retail" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Other", value: "other" },
];

// ----------------------------------------------------------------------
// 2. Main Component
// ----------------------------------------------------------------------
const DemoRequest = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof demoRequestSchema>, any, DemoRequestSchemaType>({
    resolver: zodResolver(demoRequestSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      workEmail: "",
      companyName: "",
      industry: "",
      expectedUsers: undefined as unknown as number,
      useCase: "",
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<DemoRequestSchemaType> = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.submitDemoRequest({
        fullName: data.fullName.trim(),
        workEmail: data.workEmail,
        companyName: data.companyName,
        phoneNumber: data.phoneNumber,
        useCase: `${data.useCase} | Industry: ${data.industry} | Expected Users: ${data.expectedUsers}`,
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit demo request";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success State UI ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] grid place-items-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">Request Received!</h2>
          <p className="text-gray-600 mb-8 font-['Outfit']">
            Thank you for your interest! Our team will review your request and get back to you within 24 hours with your demo access details.
          </p>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // --- Form UI ---
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Outfit']">
            Request a Free Demo
          </h2>
          <p className="text-gray-500 font-['Outfit']">
            Experience the full power of MSaaS. Fill out the form below to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              disabled={isSubmitting}
              {...register("fullName")}
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="john@company.com"
              error={!!errors.workEmail}
              helperText={errors.workEmail?.message}
              disabled={isSubmitting}
              {...register("workEmail")}
            />

            <Input
              label="Company Name"
              type="text"
              placeholder="Acme Corp"
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              disabled={isSubmitting}
              {...register("companyName")}
            />

            <Select
              label="Industry"
              options={INDUSTRY_OPTIONS}
              error={!!errors.industry}
              helperText={errors.industry?.message}
              disabled={isSubmitting}
              {...register("industry")}
            />

            <Input
              label="Expected User Count"
              type="number"
              placeholder="e.g. 50"
              error={!!errors.expectedUsers}
              helperText={errors.expectedUsers?.message}
              disabled={isSubmitting}
              {...register("expectedUsers")}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              disabled={isSubmitting}
              {...register("phoneNumber")}
            />

            <div className="md:col-span-2">
              <Input
                label="Primary Use Case"
                type="text"
                placeholder="e.g. Operations Management, Order Tracking, Inventory Control"
                error={!!errors.useCase}
                helperText={errors.useCase?.message}
                disabled={isSubmitting}
                {...register("useCase")}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Request Access"}
            </Button>

            <button
              type="button"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors font-['Outfit']"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              ← Back to Sign In
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default memo(DemoRequest);