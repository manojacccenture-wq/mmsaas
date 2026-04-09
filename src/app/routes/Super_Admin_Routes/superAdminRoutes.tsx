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
        <Route index element={<div>Super Admin Dashboard</div>} />

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
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;