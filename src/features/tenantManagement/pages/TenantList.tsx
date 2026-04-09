import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/UI/Button/Button";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import { useTenants } from "@/features/tenantManagement/hooks/useTenants";


const TenantList = () => {
  const navigate = useNavigate();

  const { tenants, isLoading } = useTenants();

  const handleCreateTenant = () => {
    navigate("/superadmin/tenants/create");
  };

  const handleRowClick = (tenant: any) => {
    navigate(`/superadmin/tenants/${tenant.id}`);
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Name" },
    { key: "plan", label: "Plan" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1>Tenants</h1>

        <Button size="sm" onClick={handleCreateTenant}>
          + Create Tenant
        </Button>
      </div>

      <Table
        columns={columns}
        data={tenants}
        loading={isLoading}
        onRowClick={handleRowClick}
      />


    </div>
  );
};

export default TenantList;