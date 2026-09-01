import React from "react";
import Card from "@/shared/components/UI/Card/Card";

interface ProductLauncherCardProps {
  product: {
    code: string;
    name: string;
    description?: string;
  };
  onLaunch: (code: string) => void;
}

const ProductLauncherCard: React.FC<ProductLauncherCardProps> = ({ product, onLaunch }) => {
  return (
    <Card padding="p-5" className="flex flex-col h-full hover:shadow-lg transition-shadow border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-50 text-emerald-600">
            Active
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">
          {product.description || "Launch the application"}
        </p>
      </div>

      <button
        onClick={() => onLaunch(product.code)}
        className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
      >
        Launch Application
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </Card>
  );
};

export default ProductLauncherCard;
