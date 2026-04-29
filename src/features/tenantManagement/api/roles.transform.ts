// roles.transform.ts

import { type RoleApiResponse, type RoleUI } from "./roles.types";

export const mapRoleToUI = (role: RoleApiResponse): RoleUI => ({
  id: role._id,
  name: role.name,
  description: role.description,
  permissions: role.permissions,
});
