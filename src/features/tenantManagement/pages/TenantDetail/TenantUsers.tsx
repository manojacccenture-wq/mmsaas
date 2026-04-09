import { useParams } from "react-router-dom";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Button from "@/shared/components/UI/Button/Button";
import { useTenantUsers } from "../../hooks/useTenantUsers";

interface TenantUser {
  id: string;
  email: string;
  role: string;
}

const TenantUsers = () => {
  const { tenantId } = useParams();

  const { users, isLoading } = useTenantUsers(tenantId);

  const columns: Column<TenantUser>[] = [
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Tenant Users</h1>

        <Button size="sm" variant="primary">
          + Add User
        </Button>
      </div>

      {/* 🔥 Table */}
      <Table<TenantUser>
        columns={columns}
        data={users}
        loading={isLoading}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default TenantUsers;