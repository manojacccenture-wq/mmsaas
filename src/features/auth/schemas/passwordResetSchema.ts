// schemas/passwordResetSchema.ts
import { z } from "zod";

const COMMON_PASSWORDS = [
  "password",
  "123456",
  "12345678",
  "qwerty",
  "admin",
];

export const passwordResetSchema = z
  .object({
    otp: z
      .string()
      .regex(/^[0-9]{6}$/, "OTP must be 6 digits"),

    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .refine(
        (val) => !COMMON_PASSWORDS.includes(val.toLowerCase()),
        "This password is too common"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;