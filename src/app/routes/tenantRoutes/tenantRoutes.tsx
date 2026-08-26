import { Route, Routes } from "react-router-dom";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import DashboardLayout from "@/app/Layout/Dashboard/DashboardLayout";
import Dashboard from "@/features/Dashboard/pages/Dashboard";
import Logout from "@/features/auth/pages/Logout";
import Users from "@/features/tenantManagement/pages/Users";
import Roles from "@/features/tenantManagement/pages/Roles";
import PolicyManagement from "@/features/policyManagement/pages/PolicyManagement";
import BillingOverview from "@/features/billing/pages/BillingOverview";
import BusinessRolesList from "@/features/businessRoles/pages/BusinessRolesList";
import EditBusinessRolePage from "@/features/businessRoles/pages/EditBusinessRolePage";
import CapabilityGuard from "@/shared/components/CapabilityGuard/CapabilityGuard";
import ProductRedirector from "@/app/routes/ProductRedirector";

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
        <Route path="dashboard" element={<CapabilityGuard capability="dashboard.view"><Dashboard /></CapabilityGuard>} />

        {/* matches /app/:tenantId/users */}
        <Route path="users" element={<CapabilityGuard capability="users.view"><Users /></CapabilityGuard>} />

        {/* matches /app/:tenantId/roles */}
        <Route path="roles" element={<CapabilityGuard capability="roles.view"><Roles /></CapabilityGuard>} />

        <Route path="policy" element={<CapabilityGuard capability="policy.view"><PolicyManagement /></CapabilityGuard>} />

        <Route path="billing" element={<CapabilityGuard capability="billing.view"><BillingOverview /></CapabilityGuard>} />

        {/* Business Roles — NEW simplified role system */}
        <Route path="business-roles" element={<CapabilityGuard capability="business-roles.view"><BusinessRolesList /></CapabilityGuard>} />
        <Route path="business-roles/:roleId" element={<CapabilityGuard capabilities={["business-roles.edit", "business-roles.create"]} requireAll={false}><EditBusinessRolePage /></CapabilityGuard>} />

        <Route path="logout" element={<Logout />} />

        {/* Catch-all for Product Launching */}
        <Route path=":productCode" element={<ProductRedirector />} />
      </Route>
    </Routes>
  );
};

export default TenantRoutes;