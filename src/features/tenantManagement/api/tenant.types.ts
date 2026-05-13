// tenant.types.ts

export interface TenantApiResponse {
  _id: string;
  name: string;
  dataMode: string;
  isActive: boolean;
}

export interface TenantUI {
  id: string;
  name: string;
  plan: string;
  users: string;
  status: string;
}

export interface TenantUserApi {
  _id: string;
  userId: { _id: string; email: string; isActive: boolean };
  roleId?: { _id: string; name: string };
  businessRoleId?: { _id: string; name: string };
}

export interface TenantUserUI {
  id: string;
  email: string;
  role: string;
}