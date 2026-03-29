import { SIDEBAR_ICONS } from "@/app/config/Dashboard/sidebarIcons/SidebarIcons";
import { hasPermission } from "@/utils/permissionUtils/permissionUtils";
import { menuConfig } from "@/app/config/Dashboard/menuConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hook";

import sidebarToggle from "@/assets/Images/Icons/common/sidebar.png";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);



  const filteredMenu = menuConfig.filter((item) =>
    hasPermission(user?.Role, item.permission)
  );

  return (
    <aside
      className={`h-screen border-r border-gray-100 p-2 
      transition-all duration-500 ease-in-out
      ${collapsed ? "w-[80px]" : "w-[250px]"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center mb-8 mt-3
    ${collapsed ? "justify-center" : "justify-between"}
  `}
      >
        {!collapsed && (
          <h1 className="text-[#00BFA6] font-bold text-lg whitespace-nowrap">
            Survey Management
          </h1>
        )}

        {/* Toggle */}
        <img
          src={sidebarToggle}
          alt="toggle"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-6 h-6 cursor-pointer 
    transition-all duration-500 ease-in-out
    hover:scale-110
    ${collapsed ? "rotate-0 mx-auto" : "rotate-180"}
  `}
        />
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ""}
            className={`flex items-center h-10 rounded-lg cursor-pointer text-sm
    transition-all duration-300 ease-in-out
    ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}
    ${location.pathname === item.path
                ? "bg-[#00BFA6]/10 text-[#00BFA6]"
                : "text-gray-700 hover:bg-[#00BFA6]/10 hover:text-[#00BFA6]"
              }`}
          >
            {/* Icon */}
            <div className={`${collapsed ? "w-full flex justify-center" : ""}`}>
              <img
                src={SIDEBAR_ICONS[item.id as keyof typeof SIDEBAR_ICONS]}
                alt={item.label}
                className="w-5 h-5 object-contain"
              />
            </div>

            {/* Text */}
            {!collapsed && (
              <span className="whitespace-nowrap">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}