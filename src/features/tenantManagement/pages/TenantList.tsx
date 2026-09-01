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
  const [confirmName, setConfirmName] = useState("");
  const isDeleteConfirmed = confirmName.trim() === selectedTenant?.name;

  const { tenants, isLoading, isDeleting, handleDelete } = useTenants();

  const handleCreateTenant = () => {
    navigate("/superadmin/tenants/create");
  };

  const handleRowClick = (tenant: any) => {
    navigate(`/superadmin/tenants/${tenant.id}`);
  };

  const handleOpenDeleteConfirm = (tenant: any) => {
    setSelectedTenant(tenant);
    setConfirmName("");
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTenant && isDeleteConfirmed) {
      try {
        await handleDelete(selectedTenant.id);
        setIsDeleteModalOpen(false);
        setSelectedTenant(null);
        setConfirmName("");
      } catch (err: any) {
        console.error("Failed to delete tenant:", err);
      }
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      render: (_, row) => {
        const isDemo = row.name?.toLowerCase().includes("demo");
        return (
          <div className="flex items-center gap-2">
            <span>{row.name}</span>
            {isDemo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Demo
              </span>
            )}
          </div>
        );
      },
    },
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
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Delete {selectedTenant?.name}?</p>
              <p className="text-sm text-gray-500 mt-1">
                This will permanently remove all tenant data including users, roles, subscriptions, and business roles. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Type-to-confirm input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-bold text-gray-900">{selectedTenant?.name}</span> to confirm deletion
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={selectedTenant?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={isDeleting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
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
              disabled={isDeleting || !isDeleteConfirmed}
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