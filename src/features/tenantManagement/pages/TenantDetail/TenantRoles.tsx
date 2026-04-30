import { useState } from "react";
import { useParams } from "react-router-dom";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Button from "@/shared/components/UI/Button/Button";
import Modal from "@/shared/components/Modal/Modal";
import RoleFormModal from "../../components/RoleFormModal";
import { useRoles } from "../../hooks/useRoles";
import { getPermissionLabel } from "../../config/permissionsConfig";
import type { RoleUI } from "../../api/roles.types";
import type { CreateRoleFormData, UpdateRoleFormData } from "../../schema/roles.schema";

const TenantRoles = () => {
  const { tenantId } = useParams();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleUI | null>(null);

  const { roles, isLoading, isCreating, isUpdating, isDeleting, handleCreate, handleUpdate, handleDelete } = useRoles(tenantId);

  const handleOpenCreateForm = () => {
    setSelectedRole(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (role: RoleUI) => {
    setSelectedRole(role);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteConfirm = (role: RoleUI) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateRoleFormData | UpdateRoleFormData) => {
    if (selectedRole) {
      await handleUpdate(selectedRole.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRole) {
      await handleDelete(selectedRole.id);
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const columns: Column<RoleUI>[] = [
    {
      key: "name",
      label: "Role Name",
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="text-muted">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((perm) => (
            <span
              key={perm}
              className="px-2 py-1 rounded bg-[var(--color-green-100)] text-success text-xs"
            >
              {getPermissionLabel(perm)}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-2 py-1 text-xs text-muted">
              +{value.length - 2} more
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1>Roles</h1>
        <Button size="sm" variant="primary" onClick={handleOpenCreateForm}>
          + Create Role
        </Button>
      </div>

      {/* Table */}
      <Table<RoleUI>
        columns={columns}
        data={roles}
        loading={isLoading}
        emptyMessage="No roles found"
        actions={(role) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlinePrimary"
              onClick={() => handleOpenEditForm(role)}
              disabled={isUpdating || isDeleting}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outlineDanger"
              onClick={() => handleOpenDeleteConfirm(role)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        )}
      />

      {/* Role Form Modal */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
        role={selectedRole || undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        header={<h2>Delete Role</h2>}
        width="400px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            Are you sure you want to delete this role? This action cannot be undone.
          </p>
          <p className="text-heading font-semibold">{selectedRole?.name}</p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outlineSecondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedRole(null);
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

export default TenantRoles;
