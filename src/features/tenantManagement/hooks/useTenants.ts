// hooks/useTenants.ts

import { useCallback } from "react";
import { useGetTenantsQuery, useDeleteTenantMutation } from "@/features/tenantManagement/api/tenantApi";
import { mapTenantToUI } from "@/features/tenantManagement/api/tenant.transform";

export const useTenants = (page = 1, limit = 10) => {
  const { data, isLoading, error } = useGetTenantsQuery({ page, limit });
  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation();

  const tenants =
    data?.data?.map(mapTenantToUI) || [];

  const handleDelete = useCallback(
    async (tenantId: string) => {
      await deleteTenant(tenantId).unwrap();
    },
    [deleteTenant]
  );

  return {
    tenants,
    isLoading,
    isDeleting,
    error,
    pagination: data?.pagination,
    handleDelete,
  };
};