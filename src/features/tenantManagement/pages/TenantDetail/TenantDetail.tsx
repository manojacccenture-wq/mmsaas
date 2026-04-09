import { useParams } from "react-router-dom";
import { useGetTenantUsersQuery } from "@/features/tenantManagement/api/tenantApi";

const TenantDetail = () => {
  const { tenantId } = useParams();

  const { data, isLoading } = useGetTenantUsersQuery(tenantId!, {
    skip: !tenantId, // ✅ important
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Tenant Users
      </h1>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default TenantDetail;