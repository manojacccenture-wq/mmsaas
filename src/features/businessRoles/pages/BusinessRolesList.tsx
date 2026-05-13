import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Button from "@/shared/components/UI/Button/Button";
import Card from "@/shared/components/UI/Card/Card";
import Modal from "@/shared/components/Modal/Modal";
import CreateBusinessRoleModal from "@/features/businessRoles/components/CreateBusinessRoleModal";
import {
  useGetBusinessRolesQuery,
  useCreateBusinessRoleMutation,
  useDeleteBusinessRoleMutation,
} from "@/features/businessRoles/api/businessRoleApi";
import type { BusinessRole } from "@/features/businessRoles/types/businessRole.types";

// ─── Badges ───────────────────────────────────────────────────────────────────
const PresetBadge = ({ isPreset }: { isPreset: boolean }) =>
  isPreset ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
      🔒 Preset
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
      ✏️ Custom
    </span>
  );

// ─── Summary Stats ────────────────────────────────────────────────────────────
const StatsRow = ({ roles }: { roles: BusinessRole[] }) => {
  const total   = roles.length;
  const presets = roles.filter((r) => r.isPreset).length;
  const custom  = total - presets;
  const assigned = roles.reduce((s, r) => s + (r.memberCount ?? 0), 0);

  const stats = [
    { label: "Total Roles",       value: total,    icon: "🎭", color: "from-indigo-500 to-violet-500"  },
    { label: "Preset Roles",      value: presets,  icon: "🔒", color: "from-blue-500 to-cyan-500"      },
    { label: "Custom Roles",      value: custom,   icon: "✏️", color: "from-amber-500 to-orange-500"   },
    { label: "Members Assigned",  value: assigned, icon: "👥", color: "from-emerald-500 to-teal-500"   },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-md`}>
            {s.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const BusinessRolesList: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useGetBusinessRolesQuery();
  const [createRole, { isLoading: isCreating }] = useCreateBusinessRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteBusinessRoleMutation();

  const roles: BusinessRole[] = data?.data ?? [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BusinessRole | null>(null);

  const handleCreate = async (payload: { name: string; description: string; capabilities: string[] }) => {
    await createRole(payload);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteRole(deleteTarget._id);
    setDeleteTarget(null);
  };

  const columns: Column<BusinessRole & { id: string }>[] = [
    {
      key: "name",
      label: "Role Name",
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">{val}</p>
          {row.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{row.description}</p>}
        </div>
      ),
    },
    {
      key: "isPreset",
      label: "Type",
      render: (val) => <PresetBadge isPreset={val as boolean} />,
    },
    {
      key: "capabilityCount",
      label: "Permissions",
      render: (val) => (
        <span className="text-sm font-semibold text-indigo-600">{(val as number) ?? 0}</span>
      ),
    },
    {
      key: "memberCount",
      label: "Members",
      render: (val) => (
        <span className="text-sm font-medium text-gray-700">{(val as number) ?? 0}</span>
      ),
    },
    {
      key: "_id",
      label: "",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outlinePrimary"
            onClick={() => navigate(`/app/${tenantId}/business-roles/${row._id}`)}
            className="rounded-xl text-xs"
          >
            Edit
          </Button>
          {!row.isPreset && (
            <Button
              size="sm"
              variant="outlineDanger"
              onClick={() => setDeleteTarget(row)}
              disabled={isDeleting}
              className="rounded-xl text-xs"
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-title)] flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Business Roles
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage simplified team roles with checkbox-based permissions. Separate from the enterprise IAM engine.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Role
        </Button>
      </div>

      {/* Stats */}
      {!isLoading && <StatsRow roles={roles} />}

      {/* Table */}
      <Card className="p-0 overflow-hidden shadow-sm border border-slate-100 rounded-2xl">
        <Table<BusinessRole & { id: string }>
          columns={columns}
          data={roles.map((r) => ({ ...r, id: r._id }))}
          loading={isLoading || isFetching}
          emptyMessage="No business roles found. Create your first role to get started."
        />
      </Card>

      {/* Create Modal */}
      <CreateBusinessRoleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        width="420px"
        header={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-800">Delete Role</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteTarget?.name}"</span>?
            Members assigned to this role will have their business role unset.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outlineSecondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-xl">
              {isDeleting ? "Deleting..." : "Delete Role"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessRolesList;
