import { z } from "zod";

// ─── Role Categories (mirrors backend ROLE_CATEGORIES) ────────────────────────
export const ROLE_CATEGORIES = ["ADMIN", "MANAGER", "STAFF", "VIEWER", "CUSTOM"] as const;
export type RoleCategory = typeof ROLE_CATEGORIES[number];

// ─── Create Role Schema ───────────────────────────────────────────────────────
export const createGlobalRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters")
    .max(60, "Role name must be less than 60 characters"),
  code: z
    .string()
    .min(2, "System code must be at least 2 characters")
    .max(40, "System code must be less than 40 characters")
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase letters, numbers, or underscores only"),
  category: z.enum(ROLE_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  level: z
    .number({ invalid_type_error: "Level must be a number" })
    .min(1, "Level must be at least 1")
    .max(999, "Level must be at most 999")
    .optional(),
});

export type CreateGlobalRoleFormData = z.infer<typeof createGlobalRoleSchema>;
