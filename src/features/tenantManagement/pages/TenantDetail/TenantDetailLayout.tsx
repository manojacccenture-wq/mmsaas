import { Link, Outlet, useLocation } from "react-router-dom";

const TenantDetailLayout = () => {
  const location = useLocation();
  const basePath = location.pathname.split('/').slice(0, -1).join('/') || location.pathname;

  const tabs = [
    { label: "Overview", path: "" },
    { label: "Users", path: "users" },
    { label: "Settings", path: "settings" },
  ];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.path === ""
            ? location.pathname.endsWith("/") || !location.pathname.includes("users") && !location.pathname.includes("settings")
            : location.pathname.includes(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  )
};

export default TenantDetailLayout;