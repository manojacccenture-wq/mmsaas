// hooks/useTenants.ts

import { useGetTenantsQuery } from "@/features/tenantManagement/api/tenantApi";
import { mapTenantToUI } from "@/features/tenantManagement/api/tenant.transform";

export const useTenants = (page = 1, limit = 10) => {
  const { data, isLoading, error } = useGetTenantsQuery({ page, limit });

  const tenants =
    data?.data?.map(mapTenantToUI) || [];

  return {
    tenants,
    isLoading,
    error,
    pagination: data?.pagination,
  };
};