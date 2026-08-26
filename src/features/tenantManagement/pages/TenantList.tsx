import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/UI/Button/Button";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Modal from "@/shared/components/Modal/Modal";
import { useTenants } from "@/features/tenantManagement/hooks/useTenants";


const TenantList = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const { tenants, isLoading, isDeleting, handleDelete } = useTenants();

  const handleCreateTenant = () => {
    navigate("/superadmin/tenants/create");
  };

  const handleRowClick = (tenant: any) => {
    navigate(`/superadmin/tenants/${tenant.id}`);
  };

  const handleOpenDeleteConfirm = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTenant) {
      try {
        await handleDelete(selectedTenant.id);
        setIsDeleteModalOpen(false);
        setSelectedTenant(null);
      } catch (err: any) {
        console.error("Failed to delete tenant:", err);
      }
    }
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
        <h1></h1>

        <Button size="sm" onClick={handleCreateTenant}>
          + Create Tenant
        </Button>
      </div>

      <Table
        columns={columns}
        data={tenants}
        loading={isLoading}
        onRowClick={handleRowClick}
        actions={(tenant) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlineDanger"
              onClick={(e) => { e.stopPropagation(); handleOpenDeleteConfirm(tenant); }}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        )}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTenant(null);
        }}
        header={<h2>Delete Tenant</h2>}
        width="400px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            Are you sure you want to delete this tenant? This action will permanently remove all tenant data including users, roles, and subscriptions. This cannot be undone.
          </p>
          <p className="text-heading font-semibold">{selectedTenant?.name}</p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outlineSecondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTenant(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TenantList;