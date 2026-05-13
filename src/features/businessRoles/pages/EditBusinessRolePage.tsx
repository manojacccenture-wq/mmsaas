import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/shared/components/UI/Button/Button";
import Input from "@/shared/components/UI/Input/Input";
import Card from "@/shared/components/UI/Card/Card";
import CapabilityMatrix from "@/features/businessRoles/components/CapabilityMatrix";
import {
  useGetBusinessRoleQuery,
  useGetCapabilitiesQuery,
  useUpdateBusinessRoleMutation,
} from "@/features/businessRoles/api/businessRoleApi";
import type { Capability } from "@/features/businessRoles/types/businessRole.types";

const EditBusinessRolePage: React.FC = () => {
  const { tenantId, roleId } = useParams<{ tenantId: string; roleId: string }>();
  const navigate = useNavigate();

  const { data: roleRes, isLoading: roleLoading } = useGetBusinessRoleQuery(roleId!);
  const { data: capsRes, isLoading: capsLoading } = useGetCapabilitiesQuery();
  const [updateRole, { isLoading: isSaving }] = useUpdateBusinessRoleMutation();

  const role = roleRes?.data;
  const capabilities: Capability[] = capsRes?.data ?? [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // Hydrate form when role loads
  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setSelected(role.capabilities ?? []);
    }
  }, [role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !name.trim()) return;
    await updateRole({ id: role._id, name: name.trim(), description: description.trim(), capabilities: selected });
    navigate(`/app/${tenantId}/business-roles`);
  };

  const isLoading = roleLoading || capsLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6 text-sm text-gray-500">Business role not found.</div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(`/app/${tenantId}/business-roles`)}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-title)]">Edit Role: {role.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {role.isPreset ? "System preset — name is locked" : "Custom role — fully editable"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <Card padding="p-5" rounded="rounded-2xl" className="border border-[var(--color-neutral-20)]">
          <div className="flex flex-col gap-4">
            <Input
              label="Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={role.isPreset}
              required
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Card>

        {/* Capability Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--color-text-title)]">Permissions</h2>
            <span className="text-sm text-gray-400">{selected.length} of {capabilities.length} selected</span>
          </div>
          <CapabilityMatrix
            capabilities={capabilities}
            selected={selected}
            onChange={setSelected}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="outlineSecondary"
            onClick={() => navigate(`/app/${tenantId}/business-roles`)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving || !name.trim()}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBusinessRolePage;
