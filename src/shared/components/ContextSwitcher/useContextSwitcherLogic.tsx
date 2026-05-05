import { useState, useMemo, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hook";
import { restoreSessionAsync } from "@/features/auth/authThunk";
import { useNavigate, useLocation } from "react-router-dom";

export const useContextSwitcherLogic = () => {
  const { tenants, user, activeContext } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const { activeTenantId, activeProductId, isGlobal } = useMemo(() => {
    const match = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})(?:\/([a-zA-Z0-9_-]+))?/);
    return {
      activeTenantId: match ? match[1] : "",
      activeProductId: match && match[2] ? match[2] : "",
      isGlobal: !match && location.pathname.startsWith("/superadmin"),
    };
  }, [location.pathname]);

  const products = activeContext?.products || [];

  const { tenantLabel, productLabel } = useMemo(() => {
    const currentTenant = tenants?.find((t: any) => t.tenantId === activeTenantId);
    
    // 👇 Use tenantName from the updated backend response
    const tenantLabel = isGlobal 
      ? "Global Platform" 
      : currentTenant?.tenantName 
        ? currentTenant.tenantName 
        : "Select Workspace";

    const currentProduct = products?.find((p: any) => p.code === activeProductId);
    
    // 👇 Set to null if there is no specific product, removing "Main Dashboard"
    const productLabel = activeProductId && activeProductId !== "dashboard" && currentProduct
      ? currentProduct.name
      : null; 

    return { tenantLabel, productLabel };
  }, [isGlobal, tenants, activeTenantId, products, activeProductId]);

  const handleTenantSelect = useCallback((tenantId: string) => {
    setIsOpen(false);
    navigate(tenantId === "global" ? "/superadmin" : `/app/${tenantId}/dashboard`);
    setTimeout(() => {
      dispatch(restoreSessionAsync());
    }, 0);
  }, [navigate, dispatch]);

  return {
    isOpen,
    setIsOpen,
    isGlobal,
    tenantLabel,
    productLabel,
    user,
    tenants,
    activeTenantId,
    handleTenantSelect
  };
};