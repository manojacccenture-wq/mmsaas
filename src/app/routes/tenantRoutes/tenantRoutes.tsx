import { Route, Routes } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";
import Dashboard from "@/features/Dashboard/pages/Dashboard";

const TenantRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/app/:tenantId"
          element={
            <RouteGuard requireAuth>
              <DashboardLayout />
            </RouteGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default TenantRoutes;