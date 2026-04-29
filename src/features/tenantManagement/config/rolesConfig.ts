// Role configuration for user management
// Aligned with system's ROLE_PERMISSIONS from rolePermissions.ts

export const USER_ROLES = {
  ADMIN: "Admin",
  USER: "user",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const AVAILABLE_ROLES: { label: string; value: UserRole }[] = [
  { label: "Admin", value: USER_ROLES.ADMIN },
  { label: "User", value: USER_ROLES.USER },
];

export const getRoleLabel = (roleValue: UserRole | string): string => {
  const role = AVAILABLE_ROLES.find((r) => r.value === roleValue);
  return role?.label || roleValue;
};
