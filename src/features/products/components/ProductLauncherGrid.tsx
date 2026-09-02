import React from "react";
import { useNavigate } from "react-router-dom";
import ProductLauncherCard from "./ProductLauncherCard";

interface ProductLauncherGridProps {
  products: Array<{
    code: string;
    name: string;
    description?: string;
  }>;
}

const ProductLauncherGrid: React.FC<ProductLauncherGridProps> = ({ products }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center mt-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">No Applications Available</h3>
        <p className="text-sm text-slate-400">Subscribe to a product to see it appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-extrabold text-slate-800 mb-6">Your Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductLauncherCard
            key={product.code}
            product={product}
            onLaunch={(code) => {
              // Force ProductRedirector to remount by changing the route path first.
              // If we are already at `/app/:tenantId/:productCode`, a second
              // navigate(code) produces the same path and React Router reuses the
              // existing component instance, so its useEffect never re-fires.
              // Navigating to dashboard first clears the route, then the product
              // code push mounts a fresh ProductRedirector whose useEffect runs.
              navigate('/dashboard');
              setTimeout(() => navigate(code), 0);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductLauncherGrid;
