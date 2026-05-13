// tenant.transform.ts

import { type TenantApiResponse,type TenantUI,type TenantUserUI } from "@/features/tenantManagement/api/tenant.types";

export const mapTenantToUI = (t: TenantApiResponse): TenantUI => ({
  id: t._id,
  name: t.name,
  plan: t.dataMode,
  users: "-",
  status: t.isActive ? "Active" : "Inactive",
});



export const mapTenantUserToUI = (u: any): TenantUserUI => ({
  id: u.userId?._id || u._id,
  email: u.userId?.email || u.email,
  role: u.businessRoleId?.name || u.roleId?.name || "No Role",
});