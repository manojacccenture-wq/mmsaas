import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/app/store/hook";
import AlertBanner from "@/features/Dashboard/components/widgets/AlertBanner";
import Card from "@/shared/components/UI/Card/Card";
import authService from "@/features/auth/api/authApi";

const ProductRedirector: React.FC = () => {
  const { tenantId, productCode } = useParams();
  const { activeContext, workspaces, loading, sessionRestored, user } = useAppSelector((state) => state.auth);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Redux is currently hydrating or fetching session, wait.
    if (loading || !sessionRestored) {
      return; 
    }

    if (!productCode) {
      setError("Invalid product launch request. No product code provided.");
      return;
    }

    // 1. Find if this product is assigned to the current user
    let product = activeContext?.products?.find((p: any) => p.code === productCode);

    // Fallback: search in all workspaces if not found in activeContext
    if (!product) {
      const workspace = workspaces?.find((w: any) => w.tenantId === tenantId);
      product = workspace?.products?.find((p: any) => p.code === productCode);
    }

    if (!product) {
      setError(`You do not have access to product '${productCode}' in this workspace.`);
      return;
    }

    // 2. Read the configuration straight from Redux (populated by MongoDB)
    const url = product.url;

    if (!url) {
      setError(`Product '${productCode}' is not configured with a destination URL in the platform database.`);
      return;
    }

    const performLaunch = async () => {
      const returnUrl = `${window.location.origin}/app/${tenantId}/dashboard`;
      
      try {
        const response = await authService.generateLaunchToken(returnUrl);
        if (response.data && response.data.token) {
          const launchUrl = new URL(url);
          launchUrl.pathname = "/sso";
          launchUrl.searchParams.set("code", response.data.token);
          launchUrl.searchParams.set("returnUrl", returnUrl);
          
          window.location.replace(launchUrl.toString());
        } else {
          setError("Received an invalid launch response from the server.");
        }
      } catch (err) {
        setError("Failed to securely negotiate SSO launch token with the server.");
      }
    };

    performLaunch();
  }, [tenantId, productCode, activeContext, workspaces, loading, sessionRestored]);

  if (error) {
    return (
      <div className="flex justify-center mt-12">
        <div className="max-w-xl w-full">
          <Card padding="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Application Launch Failed</h2>
            <AlertBanner variant="error" message={error} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-slate-500 font-medium">Launching application securely...</p>
    </div>
  );
};

export default ProductRedirector;
