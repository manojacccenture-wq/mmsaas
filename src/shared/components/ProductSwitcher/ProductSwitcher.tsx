import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "@/shared/components/UI/Select/Select";

const ProductSwitcher = () => {
  const { activeContext } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure products array exists
  const products = activeContext?.products || [];

  // Extract active tenant and product from URL
  const match = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})(?:\/([a-zA-Z0-9_-]+))?/);
  const activeTenantId = match ? match[1] : "";
  const activeProductId = match && match[2] ? match[2] : "";

  // Only show if we are within a tenant scope
  if (!activeTenantId || products.length === 0) return null;

  const handleChange = (e: any) => {
    const newProductCode = e.target.value;
    if (newProductCode) {
      // Navigate to the product's main dashboard
      navigate(`/app/${activeTenantId}/${newProductCode}`);
    } else {
      // Fallback to tenant dashboard
      navigate(`/app/${activeTenantId}/dashboard`);
    }
  };

  const options = products.map((p: any) => ({
    value: p.code,
    label: `📦 ${p.name}`
  }));

  // Add default tenant dashboard option
  options.unshift({
    value: "dashboard",
    label: "🏢 Tenant Dashboard",
  });

  // Default to dashboard if no specific product matched
  const currentValue = options.some(o => o.value === activeProductId) 
    ? activeProductId 
    : "dashboard";

  return (
    <div className="flex items-center gap-2 p-1 border-l pl-4 border-gray-200 ml-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product:</span>
      <Select
        options={options}
        value={currentValue}
        size="sm"
        onChange={handleChange}
        placeholder="Select Product"
      />
    </div>
  );
};

export default ProductSwitcher;
