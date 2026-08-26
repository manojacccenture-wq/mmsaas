import { useState, useMemo, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hook";
import { restoreSessionAsync } from "@/features/auth/authThunk";
import { setActiveTenant, setActiveProduct, setActiveRole } from "@/features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

export const useContextSwitcherLogic = () => {
  const { workspaces, user, activeProductId } = useAppSelector((state) => state.auth);
  
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

  // Compute unique products from workspaces
  const availableProducts = useMemo(() => {
    const productsMap = new Map();

    workspaces?.forEach((w: any) => {
      w.products?.forEach((p: any) => {
        if (!productsMap.has(p.code)) {
          productsMap.set(p.code, {
            code: p.code,
            name: p.name
          });
        }
      });
    });

    const products = Array.from(productsMap.values());
    products.push({
      code: "GENERAL",
      name: "Workspace Dashboard" // Fallback option for general workspace administration
    });
    return products;
  }, [workspaces]);

  // Compute available workspaces for the selected product
  const availableWorkspaces = useMemo(() => {
    if (!selectedProductCode) return [];
    if (selectedProductCode === "GENERAL") {
      return workspaces; // Show all workspaces for general dashboard
    }
    return workspaces?.filter((w: any) => w.products?.some((p: any) => p.code === selectedProductCode));
  }, [workspaces, selectedProductCode]);

  // Reset dropdown step when opened
  useEffect(() => {
    if (isOpen) {
      setDropdownStep('PRODUCT');
      setSelectedProductCode(null);
    }
  }, [isOpen]);

  const { tenantLabel, productLabel } = useMemo(() => {
    const currentWorkspace = workspaces?.find((w: any) => w.tenantId === activeTenantId);
    
    const tenantLabel = isGlobal 
      ? "Global Platform" 
      : currentWorkspace?.tenantName || "Select Workspace";

    let productLabel = null;
    if (!isGlobal && currentWorkspace) {
      const activeProduct = currentWorkspace.products?.find((p: any) => p.code === activeProductId);
      if (activeProduct) {
        productLabel = activeProduct.name;
      } else {
        productLabel = "Workspace Dashboard";
      }
    }

    return { tenantLabel, productLabel };
  }, [isGlobal, workspaces, activeTenantId, activeProductId]);

  const handleProductSelect = useCallback((productCode: string) => {
    setSelectedProductCode(productCode);
    setDropdownStep('WORKSPACE');
  }, []);

  const handleWorkspaceSelect = useCallback((workspace: any) => {
    setIsOpen(false);
    
    
    // 🔥 Explicitly sync Redux state immediately
    if (workspace !== "global") {
      dispatch(setActiveTenant(workspace.tenantId));
      dispatch(setActiveProduct(selectedProductCode !== "GENERAL" ? selectedProductCode : null));
      dispatch(setActiveRole(workspace.roleId)); // Might need adjustment if role changes structure
    } else {
      dispatch(setActiveTenant(null));
      dispatch(setActiveProduct(null));
      dispatch(setActiveRole(null));
    }

    if (workspace === "global") {
      navigate("/superadmin");
    } else if (selectedProductCode && selectedProductCode !== "GENERAL") {
      navigate(`/app/${workspace.tenantId}/${selectedProductCode}`);
    } else {
      navigate(`/app/${workspace.tenantId}/dashboard`);
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