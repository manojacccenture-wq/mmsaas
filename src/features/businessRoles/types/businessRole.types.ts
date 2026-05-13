export interface Capability {
  _id: string;
  key: string;
  label: string;
  group: string;
  description: string;
  isDefault: boolean;
}

export interface BusinessRole {
  _id: string;
  tenantId: string;
  name: string;
  description: string;
  isPreset: boolean;
  capabilities: string[];
  memberCount?: number;
  capabilityCount?: number;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CapabilityGroup = Record<string, Capability[]>;

export interface AssignBusinessRolePayload {
  businessRoleId: string | null;
}
