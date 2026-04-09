import { useGetTenantUsersQuery } from "../api/tenantApi";
import { mapTenantUserToUI } from "../api/tenant.transform";

export const useTenantUsers = (tenantId?: string) => {
  const { data, isLoading, error } = useGetTenantUsersQuery(tenantId!, {
    skip: !tenantId,
  });

  const users =
    data?.data?.map(mapTenantUserToUI) || [];

  return {
    users,
    isLoading,
    error,
    pagination: data?.pagination,
  };
};