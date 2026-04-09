import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(2, "Tenant name is required"),

  dataMode: z.enum(["shared", "isolated"], {
    message: "Select data mode",
  }),

  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  // roleId: z.string().min(1, "Role is required"),
});

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;