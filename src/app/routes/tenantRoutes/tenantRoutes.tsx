import { useAppSelector } from "@/app/store/hook";
import TenantAdminRoutes from "./TenantAdminRoutes";
import TenantUserRoutes from "./TenantUserRoutes";

const TenantRoutes = () => {
  const { activeContext } = useAppSelector((state) => state.auth);
  const roleCode = activeContext?.roleId?.code;
  const isAdmin = roleCode === "TENANT_ADMIN" || roleCode === "OWNER";

  return isAdmin ? <TenantAdminRoutes /> : <TenantUserRoutes />;
};

export default TenantRoutes;