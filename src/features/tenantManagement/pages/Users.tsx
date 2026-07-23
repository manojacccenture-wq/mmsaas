import { useState } from "react";
import { useParams } from "react-router-dom";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Button from "@/shared/components/UI/Button/Button";
import Modal from "@/shared/components/Modal/Modal";
import UserFormModal from "../components/UserFormModal";
import { useUsers } from "../hooks/useUsers";
import type { TenantUserUI } from "../api/tenant.types";
import type { CreateUserFormData, UpdateUserFormData } from "../schema/users.schema";

const Users = () => {
  const { tenantId } = useParams();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TenantUserUI | null>(null);

  const [isResetTotpModalOpen, setIsResetTotpModalOpen] = useState(false);

  const { users, isLoading, isCreating, isUpdating, isDeleting, isResettingTotp, handleCreate, handleUpdate, handleDelete, handleResetTotp } = useUsers(tenantId);

  const handleOpenCreateForm = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (user: TenantUserUI) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteConfirm = (user: TenantUserUI) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleOpenResetTotpConfirm = (user: TenantUserUI) => {
    setSelectedUser(user);
    setIsResetTotpModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    if (selectedUser) {
      await handleUpdate(selectedUser.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await handleDelete(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmResetTotp = async () => {
    if (selectedUser) {
      await handleResetTotp(selectedUser.id);
      setIsResetTotpModalOpen(false);
      setSelectedUser(null);
    }
  };

  const columns: Column<TenantUserUI>[] = [
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span className="px-2 py-1 rounded bg-[var(--color-blue-100)] text-primary text-sm">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1>Users</h1>
        <Button size="sm" variant="primary" onClick={handleOpenCreateForm}>
          + Add User
        </Button>
      </div>

      {/* Table */}
      <Table<TenantUserUI>
        columns={columns}
        data={users}
        loading={isLoading}
        emptyMessage="No users found"
        actions={(user) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlinePrimary"
              onClick={() => handleOpenEditForm(user)}
              disabled={isUpdating || isDeleting || isResettingTotp}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outlineDanger"
              onClick={() => handleOpenDeleteConfirm(user)}
              disabled={isDeleting || isResettingTotp}
            >
              Delete
            </Button>
            <Button
              size="sm"
              variant="outlineSecondary"
              onClick={() => handleOpenResetTotpConfirm(user)}
              disabled={isResettingTotp}
            >
              Reset 2FA
            </Button>
          </div>
        )}
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
        user={selectedUser || undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        header={<h2>Delete User</h2>}
        width="400px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <p className="text-heading font-semibold">{selectedUser?.email}</p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outlineSecondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
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

      {/* Reset 2FA Confirmation Modal */}
      <Modal
        isOpen={isResetTotpModalOpen}
        onClose={() => {
          setIsResetTotpModalOpen(false);
          setSelectedUser(null);
        }}
        header={<h2>Reset User 2FA</h2>}
        width="400px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            Are you sure you want to reset Two-Factor Authentication for this user? They will be prompted to set it up again on their next login.
          </p>
          <p className="text-heading font-semibold">{selectedUser?.email}</p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outlineSecondary"
              onClick={() => {
                setIsResetTotpModalOpen(false);
                setSelectedUser(null);
              }}
              disabled={isResettingTotp}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmResetTotp}
              disabled={isResettingTotp}
            >
              {isResettingTotp ? "Resetting..." : "Reset 2FA"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
