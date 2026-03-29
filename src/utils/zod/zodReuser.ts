import { z } from "zod";

export const noHtml = (field: string, min?: number) =>
  z
    .string()
    .min(min ?? 1, `${field} must be at least ${min ?? 1} characters`)
    .refine((val) => /^[a-zA-Z0-9 ]+$/.test(val), {
      message: `${field} contains invalid characters`
    });