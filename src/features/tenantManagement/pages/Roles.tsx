import { useState, useMemo } from "react";
import Card from "@/shared/components/UI/Card/Card";
import Table, { type Column } from "@/shared/components/UI/Table/Table";
import Button from "@/shared/components/UI/Button/Button";
import Input from "@/shared/components/UI/Input/Input";
import Modal from "@/shared/components/Modal/Modal";
import { useGlobalRoles } from "@/features/policyManagement/hooks/useGlobalRoles";
import CreateRoleModal from "@/features/policyManagement/components/CreateRoleModal";
import { CATEGORY_CONFIG } from "@/features/policyManagement/config/categoryConfig";
import type { RoleCategory } from "@/features/policyManagement/schema/globalRoles.schema";

// ─── Local Types ──────────────────────────────────────────────────────────────
interface RoleRow {
  _id: string;
  name: string;
  code: string;
  category: RoleCategory;
  level: number;
  isSystem: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CategoryBadge = ({ category }: { category: RoleCategory }) => {
  const meta = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.CUSTOM;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.badge}`}>
      {meta.label}
    </span>
  );
};

const LevelBadge = ({ level }: { level: number }) => {
  const getColor = () => {
    if (level <= 5)  return "bg-violet-100 text-violet-700 border-violet-200";
    if (level <= 15) return "bg-blue-100 text-blue-700 border-blue-200";
    if (level <= 65) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getColor()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {level}
    </span>
  );
};

const SystemTag = ({ isSystem }: { isSystem: boolean }) =>
  isSystem ? (
    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold">
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      System
    </span>
  ) : (
    <span className="text-xs text-amber-600 font-semibold">Custom</span>
  );

// ─── Summary Cards ────────────────────────────────────────────────────────────
const SummaryCards = ({ roles }: { roles: RoleRow[] }) => {
  const stats = useMemo(() => {
    const byCategory = roles.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: "Total Roles",  value: roles.length,             icon: "🎭", color: "from-indigo-500 to-violet-500" },
      { label: "System Roles", value: roles.filter(r => r.isSystem).length, icon: "🔒", color: "from-blue-500 to-cyan-500" },
      { label: "Custom Roles", value: roles.filter(r => !r.isSystem).length, icon: "⚙️", color: "from-amber-500 to-orange-500" },
      { label: "Categories",   value: Object.keys(byCategory).length, icon: "📂", color: "from-emerald-500 to-teal-500" },
    ];
  }, [roles]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
interface DeleteModalProps {
  role: RoleRow | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({ role, isDeleting, onConfirm, onCancel }: DeleteModalProps) => (
  <Modal
    isOpen={!!role}
    onClose={onCancel}
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
        Are you sure you want to delete{" "}
        <span className="font-bold text-slate-800">"{role?.name}"</span>?
        This will remove all policy attachments for this role. This action cannot be undone.
      </p>
      {role?.isSystem && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">
            This is a system role. Deleting it may affect existing memberships.
          </p>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outlineSecondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          {isDeleting ? "Deleting..." : "Delete Role"}
        </Button>
      </div>
    </div>
  </Modal>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Roles = () => {
  const { roles, isLoading, isFetching, isCreating, isDeleting, handleCreate, handleDelete } = useGlobalRoles();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RoleRow | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // ─── Filtered + sorted roles ───────────────────────────────────────────────
  const filteredRoles = useMemo(() => {
    return (roles as RoleRow[])
      .filter((r) => {
        const matchSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.code.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === "ALL" || r.category === categoryFilter;
        return matchSearch && matchCategory;
      })
      .sort((a, b) => (a.level ?? 999) - (b.level ?? 999));
  }, [roles, search, categoryFilter]);

  // ─── Table columns ─────────────────────────────────────────────────────────
  const columns: Column<RoleRow>[] = [
    {
      key: "level",
      label: "Level",
      render: (val) => <LevelBadge level={val} />,
    },
    {
      key: "name",
      label: "Role Name",
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">{val}</p>
          <code className="text-[11px] text-slate-400 font-mono mt-0.5">{row.code}</code>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (val) => <CategoryBadge category={val as RoleCategory} />,
    },
    {
      key: "isSystem",
      label: "Type",
      render: (val) => <SystemTag isSystem={val} />,
    },
    {
      key: "_id",
      label: "",
      render: (_, row) =>
        !row.isSystem ? (
          <button
            onClick={() => setDeleteTarget(row)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Delete role"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        ) : null,
    },
  ];

  const categoryFilterOptions = ["ALL", "ADMIN", "MANAGER", "STAFF", "VIEWER", "CUSTOM"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Role Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Manage global system roles and custom tenant roles. Each role's authority is enforced by its level and category.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Role
        </Button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <SummaryCards roles={roles as RoleRow[]} />

      {/* ── Table Card ──────────────────────────────────────────────────────── */}
      <Card className="p-0 overflow-hidden shadow-sm border border-slate-100 rounded-2xl">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              containerClass="!gap-0"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {categoryFilterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                  categoryFilter === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat === "ALL" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredRoles}
          loading={isLoading || isFetching}
          emptyMessage="No roles found. Create your first role to get started."
        />
      </Card>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <CreateRoleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <DeleteConfirmModal
        role={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!deleteTarget) return;
          const ok = await handleDelete(deleteTarget._id, deleteTarget.name);
          if (ok) setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Roles;


