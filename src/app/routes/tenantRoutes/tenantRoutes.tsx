import { Route, Routes } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";
import Dashboard from "@/features/Dashboard/pages/Dashboard";
import Logout from "@/features/auth/pages/Logout";

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
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default TenantRoutes;