import { useDispatch, useSelector } from "react-redux";

const TenantSwitcher = () => {
  const dispatch = useDispatch();
  const { contexts, activeTenantId } = useSelector((state: any) => state.auth);
  

  const tenants = contexts.filter(c => c.tenantId);

  const handleChange = (e: any) => {
    dispatch({
      type: "auth/setActiveTenant",
      payload: e.target.value
    });
  };

  return (
    <select value={activeTenantId || ""} onChange={handleChange}>
      {tenants.map((t: any) => (
        <option key={t.tenantId} value={t.tenantId}>
          {t.tenantId}
        </option>
      ))}
    </select>
  );
};

export default TenantSwitcher;