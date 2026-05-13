import { Route, Routes } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";
import TenantUserDashboard from "@/features/Dashboard/pages/TenantUserDashboard";
import Logout from "@/features/auth/pages/Logout";

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-full items-center justify-center p-8">
    <h1 className="text-2xl font-bold text-neutral-80">{title} - Coming Soon</h1>
  </div>
);

const TenantUserRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <RouteGuard requireAuth>
            <DashboardLayout />
          </RouteGuard>
        }
      >
        <Route index element={<TenantUserDashboard />} />
        <Route path="shift-summary" element={<Placeholder title="Shift Summary" />} />
        <Route path="item-on-off" element={<Placeholder title="Item On/Off" />} />
        <Route path="money-management" element={<Placeholder title="Money Management" />} />
        <Route path="order-history" element={<Placeholder title="Order History" />} />
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default TenantUserRoutes;
