import type { RoleCategory } from "../schema/globalRoles.schema";

// ─── Category metadata — mirrors backend CATEGORY_LEVEL_MAP ──────────────────

export interface CategoryMeta {
  label: string;
  description: string;
  defaultLevel: number;
  color: string;       // Tailwind text color
  bg: string;          // Tailwind bg color
  border: string;      // Tailwind border color
  badge: string;       // Tailwind badge classes
}

export const CATEGORY_CONFIG: Record<RoleCategory, CategoryMeta> = {
  ADMIN: {
    label:        "Admin",
    description:  "Full control — can manage all resources, users, roles, and policies",
    defaultLevel: 1,
    color:        "text-violet-700",
    bg:           "bg-violet-50",
    border:       "border-violet-200",
    badge:        "bg-violet-100 text-violet-700 border border-violet-200",
  },
  MANAGER: {
    label:        "Manager",
    description:  "Operational authority — manages orders, CRM, users. Cannot mutate roles or policies",
    defaultLevel: 10,
    color:        "text-blue-700",
    bg:           "bg-blue-50",
    border:       "border-blue-200",
    badge:        "bg-blue-100 text-blue-700 border border-blue-200",
  },
  STAFF: {
    label:        "Staff",
    description:  "Day-to-day operations — handles orders and tables only",
    defaultLevel: 50,
    color:        "text-emerald-700",
    bg:           "bg-emerald-50",
    border:       "border-emerald-200",
    badge:        "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  VIEWER: {
    label:        "Viewer",
    description:  "Read-only access — cannot create, update, or delete anything",
    defaultLevel: 90,
    color:        "text-slate-600",
    bg:           "bg-slate-50",
    border:       "border-slate-200",
    badge:        "bg-slate-100 text-slate-600 border border-slate-200",
  },
  CUSTOM: {
    label:        "Custom",
    description:  "No template assigned — you manually attach policies to this role",
    defaultLevel: 100,
    color:        "text-amber-700",
    bg:           "bg-amber-50",
    border:       "border-amber-200",
    badge:        "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_CONFIG).map(([value, meta]) => ({
  value: value as RoleCategory,
  label: meta.label,
  description: meta.description,
  defaultLevel: meta.defaultLevel,
}));
