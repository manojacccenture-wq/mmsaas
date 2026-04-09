
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { useNavigate } from "react-router-dom";
import Select from "@/shared/components/UI/Select/Select"; // adjust path if needed
import { setActiveContext } from "@/features/auth/authSlice";

type ContextType = {
  tenantId?: string;
  role?: string;
};

const ContextSwitcher = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { contexts } = useAppSelector((state) => state.auth);

  const handleSelect = (value: string) => {
    
    const ctx = contexts.find((c: ContextType) => {
      const key = c.tenantId ? `${c.tenantId}-${c.role}` : "superadmin";
      return key === value;
    });
    

    if (!ctx) return;

    // dispatch({
    //   type: "auth/setActiveContext",
    //   payload: ctx,
    // });
    dispatch(setActiveContext(ctx));

    // 🔥 ROUTE BASED ON ROLE
    if (!ctx.tenantId) {
      navigate("/superadmin");
    } else {
      navigate(`/app/${ctx.tenantId}/dashboard`);
    }
  };

  const options = contexts.map((ctx: ContextType) => {
    const value = ctx.tenantId
      ? `${ctx.tenantId}-${ctx.role}`
      : "superadmin";

    const label = ctx.tenantId
      ? `Tenant: ${ctx.tenantId} (${ctx.role})`
      : "Super Admin (Platform Access)";

    return { value, label };
  });

  return (
    <div className="p-2">
      <Select
        // label="Switch Context"
        options={options}

        size="sm"
        onChange={(e) => handleSelect(e.target.value)}
        placeholder="Select context"
      />
    </div>
  );
};

export default ContextSwitcher;