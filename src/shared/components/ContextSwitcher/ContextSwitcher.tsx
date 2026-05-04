
import {  useAppSelector } from "@/app/store/hook";

import Select from "@/shared/components/UI/Select/Select"; 


const ContextSwitcher = () => {

  

  // 🔥 Updated to use the new 'tenants' and 'user' structure
  const { tenants, user, activeTenantId } = useAppSelector((state) => state.auth);

  const handleSelect = (value: string) => {
    if (value === "global") {
      localStorage.removeItem("activeTenantId");
      window.location.href = "/superadmin";
      return;
    }

    const tenant = tenants.find((t: any) => t.tenantId === value);
    if (!tenant) return;

    localStorage.setItem("activeTenantId", tenant.tenantId);
    window.location.href = `/app/${tenant.tenantId}/dashboard`;
  };

  // 🛠️ Build options dynamically from tenants and superadmin status
  const options = [
    ...(user?.isSuperAdmin ? [{ value: "global", label: "Super Admin (Platform Access)" }] : []),
    ...(tenants || []).map((t: any) => ({
      value: t.tenantId,
      label: `Tenant: ${t.tenantId} (${t.role})`
    }))
  ];

  if (options.length === 0) return null;

  return (
    <div className="p-2">
      <Select
        options={options}
        value={activeTenantId || (user?.isSuperAdmin ? "global" : "")}
        size="sm"
        onChange={(e) => handleSelect(e.target.value)}
        placeholder="Switch context"
      />
    </div>
  );
};

export default ContextSwitcher;