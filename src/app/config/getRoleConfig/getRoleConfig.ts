import { superAdminConfig } from "@/app/config/Super_Admin_Config/superAdminConfig";
import { tenantConfig } from "@/app/config/Tenant_Config/tenantConfig";
import { tenantUserConfig } from "@/app/config/Tenant_User_Config/tenantUserConfig";

export const getRoleConfig = (activeContext: any) => {
  if (!activeContext?.tenantId) {
    return superAdminConfig;
  }

  const roleCode = activeContext?.roleId?.code;
  if (roleCode === "TENANT_ADMIN" || roleCode === "OWNER") {
    return tenantConfig;
  }

  return tenantUserConfig;
};