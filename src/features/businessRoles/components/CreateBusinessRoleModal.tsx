import React, { useState } from "react";
import Modal from "@/shared/components/Modal/Modal";
import Button from "@/shared/components/UI/Button/Button";
import Input from "@/shared/components/UI/Input/Input";
import CapabilityMatrix from "./CapabilityMatrix";
import { useGetCapabilitiesQuery } from "@/features/businessRoles/api/businessRoleApi";
import type { Capability } from "@/features/businessRoles/types/businessRole.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; capabilities: string[] }) => Promise<void>;
  isLoading?: boolean;
}

const CreateBusinessRoleModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const { data: capsRes, isLoading: capLoading } = useGetCapabilitiesQuery();
  const capabilities: Capability[] = capsRes?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), description: description.trim(), capabilities: selected });
    setName(""); setDescription(""); setSelected([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="680px"
      header={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Create Business Role</h2>
            <p className="text-xs text-gray-500">Define a new role with specific permissions</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        <div className="flex flex-col gap-4">
          <Input
            label="Role Name"
            placeholder="e.g. Kitchen Staff, Cashier, Inventory Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description of this role's responsibilities"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Permissions</p>
            <span className="text-xs text-gray-400">{selected.length} selected</span>
          </div>
          {capLoading ? (
            <div className="h-40 bg-gray-50 rounded-2xl animate-pulse" />
          ) : (
            <CapabilityMatrix capabilities={capabilities} selected={selected} onChange={setSelected} />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="outlineSecondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading || !name.trim()}>
            {isLoading ? "Creating..." : "Create Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBusinessRoleModal;
