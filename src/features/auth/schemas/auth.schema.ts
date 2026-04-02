import { z } from "zod";

/* ================= SIGN IN ================= */

export const signInSchema = z.object({
email: z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;

/* ================= SIGN UP ================= */

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  identifier: z.string().min(5, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms",
  }),
  marketingConsent: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;


export const mfaSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type MfaSchemaType = z.infer<typeof mfaSchema>;


export const totpSetupSchema = z.object({
  otp: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

export type TotpSetupSchemaType = z.infer<typeof totpSetupSchema>;