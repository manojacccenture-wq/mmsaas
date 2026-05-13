import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";

import TenantList from "@/features/tenantManagement/pages/TenantList";
import CreateTenant from "@/features/tenantManagement/pages/CreateTenant";
import TenantDetailLayout from "@/features/tenantManagement/pages/TenantDetail/TenantDetailLayout";
import TenantOverview from "@/features/tenantManagement/pages/TenantDetail/TenantOverview";
import TenantUsers from "@/features/tenantManagement/pages/TenantDetail/TenantUsers";
import TenantRoles from "@/features/tenantManagement/pages/TenantDetail/TenantRoles";
import TenantSettings from "@/features/tenantManagement/pages/TenantDetail/TenantSettings";
import Logout from "@/features/auth/pages/Logout";
import DemoRequest from "@/features/superadmin/pages/DemoRequest";
import Plans from "@/features/superadmin/pages/Plans";
import CreatePlan from "@/features/superadmin/pages/CreatePlan";
import PlanDetailLayout from "@/features/superadmin/pages/PlanDetail/PlanDetailLayout";
import PlanOverview from "@/features/superadmin/pages/PlanDetail/PlanOverview";
import PlanSubscriptions from "@/features/superadmin/pages/PlanDetail/PlanSubscriptions";
import PlanSettings from "@/features/superadmin/pages/PlanDetail/PlanSettings";
import Dashboard from "@/features/Dashboard/pages/Dashboard";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <RouteGuard requireAuth>
            <DashboardLayout />
          </RouteGuard>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="tenants">
          {/*  Tenant List */}
          <Route index element={<TenantList />} />

          {/*  Create Tenant */}
          <Route path="create" element={<CreateTenant />} />


          {/*  Tenant Detail (CORE PART) */}
          <Route path=":tenantId" element={<TenantDetailLayout />}>
            <Route index element={<TenantOverview />} />
            <Route path="users" element={<TenantUsers />} />
            <Route path="roles" element={<TenantRoles />} />
            <Route path="settings" element={<TenantSettings />} />
          </Route>
        </Route>

        <Route path="/demo-requests" element={<DemoRequest />} />

        <Route path="/plans">
          <Route index element={<Plans />} />
          <Route path="create" element={<CreatePlan />} />
          
          <Route path=":planId" element={<PlanDetailLayout />}>
            <Route index element={<PlanOverview />} />
            <Route path="subscriptions" element={<PlanSubscriptions />} />
            <Route path="settings" element={<PlanSettings />} />
          </Route>
        </Route>

        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;