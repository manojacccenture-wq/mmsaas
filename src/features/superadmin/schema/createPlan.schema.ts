import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  billingCycle: z.enum(["monthly", "yearly", "lifetime"], {
    message: "Select a valid billing cycle",
  }),
  maxUsers: z.coerce.number().min(0, "Max users cannot be negative"),
  maxProducts: z.coerce.number().min(0, "Max products cannot be negative"),
});

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
