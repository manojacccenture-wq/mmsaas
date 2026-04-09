// tenant.transform.ts

import { type TenantApiResponse,type TenantUI, type TenantUserApi, type TenantUserUI } from "@/features/tenantManagement/api/tenant.types";

export const mapTenantToUI = (t: TenantApiResponse): TenantUI => ({
  id: t._id,
  name: t.name,
  plan: t.dataMode,
  users: "-",
  status: t.isActive ? "Active" : "Inactive",
});



export const mapTenantUserToUI = (u: TenantUserApi): TenantUserUI => ({
  id: u._id,
  email: u.email,
  role: u.role,
});