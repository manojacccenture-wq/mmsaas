import React, { useMemo } from "react";
import type { Capability, CapabilityGroup } from "@/features/businessRoles/types/businessRole.types";

interface CapabilityMatrixProps {
  capabilities: Capability[];
  selected: string[];
  onChange: (selected: string[]) => void;
  readOnly?: boolean;
}

const groupCapabilities = (capabilities: Capability[]): CapabilityGroup => {
  return capabilities.reduce<CapabilityGroup>((acc, cap) => {
    if (!acc[cap.group]) acc[cap.group] = [];
    acc[cap.group].push(cap);
    return acc;
  }, {});
};

const CapabilityMatrix: React.FC<CapabilityMatrixProps> = ({
  capabilities,
  selected,
  onChange,
  readOnly = false,
}) => {
  const grouped = useMemo(() => groupCapabilities(capabilities), [capabilities]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (key: string) => {
    if (readOnly) return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(Array.from(next));
  };

  const toggleGroup = (caps: Capability[]) => {
    if (readOnly) return;
    const groupKeys = caps.map((c) => c.key);
    const allSelected = groupKeys.every((k) => selectedSet.has(k));
    const next = new Set(selectedSet);
    groupKeys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
    onChange(Array.from(next));
  };

  const groupEntries = Object.entries(grouped);

  return (
    <div className="flex flex-col gap-5">
      {groupEntries.map(([group, caps]) => {
        const groupKeys = caps.map((c) => c.key);
        const allChecked = groupKeys.every((k) => selectedSet.has(k));
        const someChecked = groupKeys.some((k) => selectedSet.has(k));

        return (
          <div key={group} className="border border-[var(--color-neutral-20)] rounded-2xl overflow-hidden">
            {/* Group header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-[var(--color-neutral-20)]">
              <span className="text-sm font-semibold text-gray-700">{group}</span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => toggleGroup(caps)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all
                    ${allChecked
                      ? "bg-[var(--color-primary-main)] text-white border-[var(--color-primary-main)]"
                      : someChecked
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                >
                  {allChecked ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {/* Capability rows */}
            <div className="divide-y divide-[var(--color-neutral-20)]">
              {caps.map((cap) => {
                const isChecked = selectedSet.has(cap.key);
                return (
                  <label
                    key={cap.key}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors
                      ${readOnly ? "cursor-default" : "cursor-pointer hover:bg-indigo-50/40"}
                      ${isChecked ? "bg-indigo-50/30" : "bg-white"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(cap.key)}
                      disabled={readOnly}
                      className="w-4 h-4 accent-[var(--color-primary-main)] rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isChecked ? "text-indigo-700" : "text-gray-700"}`}>
                        {cap.label}
                      </p>
                      {cap.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{cap.description}</p>
                      )}
                    </div>
                    {isChecked && (
                      <span className="shrink-0 text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CapabilityMatrix;
