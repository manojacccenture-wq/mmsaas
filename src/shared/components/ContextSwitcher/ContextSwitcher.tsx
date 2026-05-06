import { memo } from "react";
import { useContextSwitcherLogic } from "./useContextSwitcherLogic";

// --- Icons ---
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

const ProductIcon = memo(() => (
  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
));

const BackIcon = memo(() => (
  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
          {productLabel || "Select Product"}
        </span>
        {tenantLabel && !isGlobal && (
          <>
            <span className="text-slate-300 leading-none">/</span>
            <span className="text-sm font-medium text-slate-600 leading-none">
              {tenantLabel}
            </span>
          </>
        )}
      </div>
    </div>
    <SwitcherIcon />
  </button>
));

const ProductItem = memo(({ product, isActive, onSelect }: any) => (
  <button
    onClick={() => onSelect(product.code)}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 font-bold" : "text-slate-600 font-medium hover:bg-slate-100"
      }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${isActive ? "bg-emerald-100" : "bg-slate-200"}`}>
        <ProductIcon />
      </div>
      {product.name}
    </div>
    <SwitcherIcon />
  </button>
));

const WorkspaceItem = memo(({ membership, onSelect }: any) => (
  <button
    onClick={() => onSelect(membership)}
    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-slate-600 font-medium hover:bg-slate-100"
  >
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-lg bg-slate-200">
        <BuildingIcon />
      </div>
      <div className="flex flex-col items-start">
        <span>{membership.tenantName || membership.tenantId?.substring(0, 8)}</span>
      </div>
    </div>
    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
      {membership.roleName || membership.role}
    </span>
  </button>
));

// --- Main Component ---

const ContextSwitcher = () => {
  const {
    isOpen, setIsOpen, isGlobal, tenantLabel, productLabel,
    user, availableProducts, availableWorkspaces, dropdownStep,
    selectedProductCode, handleProductSelect, handleWorkspaceSelect, handleBack
  } = useContextSwitcherLogic();
  
  
  
  
  if (availableProducts.length === 0 && !user?.isSuperAdmin) return null;

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

      {/* 2. The BackDrop */}
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
            
            {dropdownStep === 'PRODUCT' ? (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Your Products</p>
                <div className="space-y-1">

                  {user?.isSuperAdmin && (
                    <button
                      onClick={() => handleWorkspaceSelect("global")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isGlobal ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isGlobal ? "bg-indigo-100" : "bg-slate-200"}`}>
                        <BuildingIcon />
                      </div>
                      Global Platform
                    </button>
                  )}

                  {availableProducts.map((p: any) => (
                    <ProductItem
                      key={p.code}
                      product={p}
                      isActive={p.code === selectedProductCode}
                      onSelect={handleProductSelect}
                    />
                  ))}

                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3 px-2 border-b border-slate-200 pb-2">
                  <button onClick={handleBack} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                    <BackIcon />
                  </button>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Workspace</p>
                </div>
                <div className="space-y-1">
                  {availableWorkspaces.map((w: any) => (
                    <WorkspaceItem
                      key={w.membershipId}
                      membership={w}
                      onSelect={handleWorkspaceSelect}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ContextSwitcher);