import { superAdminConfig } from "@/app/config/Super_Admin_Config/superAdminConfig";
import { tenantConfig } from "@/app/config/Tenant_Config/tenantConfig";

export const getRoleConfig = (activeContext: any) => {
  if (!activeContext?.tenantId) {
    return superAdminConfig;
  }


  return tenantConfig;
};