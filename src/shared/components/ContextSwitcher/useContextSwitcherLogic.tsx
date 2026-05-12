import { useState, useMemo, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hook";
import { restoreSessionAsync } from "@/features/auth/authThunk";
import { setActiveTenant, setActiveProduct, setActiveRole } from "@/features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

export const useContextSwitcherLogic = () => {
  const { tenants, user,  activeProductId } = useAppSelector((state) => state.auth);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStep, setDropdownStep] = useState<'PRODUCT' | 'WORKSPACE'>('PRODUCT');
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);

  const { activeTenantId, isGlobal } = useMemo(() => {
    const match = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})(?:\/([a-zA-Z0-9_-]+))?/);
    return {
      activeTenantId: match ? match[1] : "",
      isGlobal: !match && location.pathname.startsWith("/superadmin"),
    };
  }, [location.pathname]);

  // Compute unique products from memberships
  const availableProducts = useMemo(() => {
    const productsMap = new Map();
    let hasGeneralWorkspaces = false;

    tenants?.forEach((m: any) => {
      if (m.productCode) {
        if (!productsMap.has(m.productCode)) {
          productsMap.set(m.productCode, {
            code: m.productCode,
            name: m.productName
          });
        }
      } else if (m.tenantId) {
        hasGeneralWorkspaces = true;
      }
    });

    const products = Array.from(productsMap.values());
    if (hasGeneralWorkspaces) {
      products.push({
        code: "GENERAL",
        name: "General Workspace"
      });
    }
    return products;
  }, [tenants]);

  // Compute available workspaces for the selected product
  const availableWorkspaces = useMemo(() => {
    if (!selectedProductCode) return [];
    if (selectedProductCode === "GENERAL") {
      return tenants?.filter((m: any) => !m.productCode && m.tenantId);
    }
    return tenants?.filter((m: any) => m.productCode === selectedProductCode);
  }, [tenants, selectedProductCode]);

  // Reset dropdown step when opened
  useEffect(() => {
    if (isOpen) {
      setDropdownStep('PRODUCT');
      setSelectedProductCode(null);
    }
  }, [isOpen]);

  const { tenantLabel, productLabel } = useMemo(() => {
    const currentMembership = tenants?.find((t: any) => t.tenantId === activeTenantId && t.productCode === activeProductId);
    const fallbackTenant = tenants?.find((t: any) => t.tenantId === activeTenantId);
    
    const tenantLabel = isGlobal 
      ? "Global Platform" 
      : currentMembership?.tenantName || fallbackTenant?.tenantName || "Select Workspace";

    let productLabel = null;
    if (!isGlobal) {
      if (currentMembership?.productName) {
        productLabel = currentMembership.productName;
      } else if (fallbackTenant?.productName) {
        productLabel = fallbackTenant.productName;
      } else if (fallbackTenant) {
        productLabel = "General Workspace";
      }
    }

    return { tenantLabel, productLabel };
  }, [isGlobal, tenants, activeTenantId, activeProductId]);

  const handleProductSelect = useCallback((productCode: string) => {
    setSelectedProductCode(productCode);
    setDropdownStep('WORKSPACE');
  }, []);

  const handleWorkspaceSelect = useCallback((membership: any) => {
    setIsOpen(false);
    
    
    // 🔥 Explicitly sync Redux state immediately
    if (membership !== "global") {
      dispatch(setActiveTenant(membership.tenantId));
      dispatch(setActiveProduct(membership.productCode || null));
      dispatch(setActiveRole(membership.role));
    } else {
      dispatch(setActiveTenant(null));
      dispatch(setActiveProduct(null));
      dispatch(setActiveRole(null));
    }

    if (membership === "global") {
      navigate("/superadmin");
    } else if (membership.productCode) {
      navigate(`/app/${membership.tenantId}/${membership.productCode}`);
    } else {
      navigate(`/app/${membership.tenantId}/dashboard`);
    }
    setTimeout(() => {
      dispatch(restoreSessionAsync());
    }, 0);
  }, [navigate, dispatch]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownStep('PRODUCT');
    setSelectedProductCode(null);
  }, []);

  return {
    isOpen,
    setIsOpen,
    isGlobal,
    tenantLabel,
    productLabel,
    user,
    availableProducts,
    availableWorkspaces,
    dropdownStep,
    selectedProductCode,
    handleProductSelect,
    handleWorkspaceSelect,
    handleBack
  };
};