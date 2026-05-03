import { useDispatch, useSelector } from "react-redux";
import { setActiveTenant } from "@/features/auth/authSlice";
import Select from "@/shared/components/UI/Select/Select";

const TenantSwitcher = () => {
  const dispatch = useDispatch();
  const { tenants, activeTenantId } = useSelector((state: any) => state.auth);
  
  const handleChange = (e: any) => {
    const newTenantId = e.target.value;
    if (newTenantId) {
      localStorage.setItem("activeTenantId", newTenantId);
      window.location.href = `/app/${newTenantId}/dashboard`;
    } else {
      localStorage.removeItem("activeTenantId");
      window.location.href = "/superadmin";
    }
  };

  if (!tenants || tenants.length === 0) return null;

  const options = (tenants || []).map((t: any) => ({
    value: t.tenantId,
    label: `${t.tenantId} (${t.role})`
  }));

  return (
    <div className="flex items-center gap-2 p-1">
      <Select
        options={options}
        value={activeTenantId || ""}
        size="sm"
        onChange={handleChange}
        placeholder="Global / System"
      />
    </div>
  );
};

export default TenantSwitcher;