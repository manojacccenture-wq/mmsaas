import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name is required")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected"),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name is required")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected"),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
