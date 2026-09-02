import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z
    .string()
    .min(1, "Role is required"),
  productIds: z.array(z.string()).optional(),
  appRoles: z.array(z.string().nullable()).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z
    .string()
    .min(1, "Role is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  productIds: z.array(z.string()).optional(),
  appRoles: z.array(z.string().nullable()).optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
