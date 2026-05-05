import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "@/shared/components/UI/Select/Select";

const TenantSwitcher = () => {
  const { tenants } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active tenant from URL instead of state/localStorage
  const match = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})/);
  const activeTenantId = match ? match[1] : "";

  const handleChange = (e: any) => {
    const newTenantId = e.target.value;
    if (newTenantId) {
      navigate(`/app/${newTenantId}/dashboard`);
    } else {
      navigate("/superadmin");
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
        value={activeTenantId}
        size="sm"
        onChange={handleChange}
        placeholder="Global / System"
      />
    </div>
  );
};

export default TenantSwitcher;