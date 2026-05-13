import { Route, Routes } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";
import Dashboard from "@/features/Dashboard/pages/Dashboard";
import Logout from "@/features/auth/pages/Logout";
import Users from "@/features/tenantManagement/pages/Users";
import Roles from "@/features/tenantManagement/pages/Roles";
import PolicyManagement from "@/features/policyManagement/pages/PolicyManagement";
import BillingOverview from "@/features/billing/pages/BillingOverview";

const TenantRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <RouteGuard requireAuth>
            <DashboardLayout />
          </RouteGuard>
        }
      >
        {/* matches /app/:tenantId */}
        <Route index element={<Dashboard />} />

        {/* matches /app/:tenantId/dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* matches /app/:tenantId/users */}
        <Route path="users" element={<Users />} />

        {/* matches /app/:tenantId/roles */}
        <Route path="roles" element={<Roles />} />

        <Route path="policy" element={<PolicyManagement />} />

        <Route path="billing" element={<BillingOverview />} />

        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default TenantRoutes;