import { Link, Outlet, useParams } from "react-router-dom";

const TenantDetailLayout = () => {
  const { tenantId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Tenant</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <Link to="">Overview</Link>
        <Link to="users">Users</Link>
        <Link to="roles">Roles</Link>
        <Link to="settings">Settings</Link>
      </div>

      <Outlet />
    </div>
  )
};

export default TenantDetailLayout;