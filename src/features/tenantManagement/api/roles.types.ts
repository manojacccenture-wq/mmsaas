// roles.types.ts

export interface RoleApiResponse {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleUI {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}
