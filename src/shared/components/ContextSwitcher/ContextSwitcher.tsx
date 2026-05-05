import { memo } from "react";
import { useContextSwitcherLogic } from "./useContextSwitcherLogic";

// --- Icons (Ideally moved to a separate /components/icons folder) ---
const SwitcherIcon = memo(() => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
));

const BuildingIcon = memo(() => (
  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
));

// --- Sub-components ---

const TriggerButton = memo(({ isOpen, setIsOpen, isGlobal, tenantLabel, productLabel }: any) => (
  <button 
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all shadow-sm focus:outline-none z-50 relative"
  >
    <div className="flex flex-col items-start">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">
        {isGlobal ? "System Context" : "Workspace"}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800 leading-none">
          {tenantLabel}
        </span>
        {/* 👇 Only render the slash and product name if productLabel exists */}
        {productLabel && !isGlobal && (
          <>
            <span className="text-slate-300 leading-none">/</span>
            <span className="text-sm font-medium text-slate-600 leading-none">
              {productLabel}
            </span>
          </>
        )}
      </div>
    </div>
    <SwitcherIcon />
  </button>
));

const TenantItem = memo(({ tenant, isActive, onSelect }: any) => (
  <button
    onClick={() => onSelect(tenant.tenantId)}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 font-bold" : "text-slate-600 font-medium hover:bg-slate-100"
      }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${isActive ? "bg-indigo-100" : "bg-slate-200"}`}>
        <BuildingIcon />
      </div>
      {tenant.tenantId?.substring(0, 4)}...
    </div>
    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
      {tenant.role}
    </span>
  </button>
));

// --- Main Component ---

const ContextSwitcher = () => {
  const {
    isOpen, setIsOpen, isGlobal, tenantLabel, productLabel,
    user, tenants, activeTenantId, handleTenantSelect
  } = useContextSwitcherLogic();

  if (!tenants && !user?.isSuperAdmin) return null;

  return (
    <div className="relative">

      {/* 1. The Trigger */}
      <TriggerButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isGlobal={isGlobal}
        tenantLabel={tenantLabel}
        productLabel={productLabel}
      />

      {/* 2. The BackDrop (Replaces useEffect outside-click detection) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-slate-50/50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Organizations</p>
            <div className="space-y-1">

              {user?.isSuperAdmin && (
                <button
                  onClick={() => handleTenantSelect("global")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isGlobal ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <div className={`p-1.5 rounded-lg ${isGlobal ? "bg-indigo-100" : "bg-slate-200"}`}>
                    <BuildingIcon />
                  </div>
                  Global Platform
                </button>
              )}

              {tenants?.map((t: any) => (
                <TenantItem
                  key={t.tenantId}
                  tenant={t}
                  isActive={t.tenantId === activeTenantId}
                  onSelect={handleTenantSelect}
                />
              ))}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ContextSwitcher);