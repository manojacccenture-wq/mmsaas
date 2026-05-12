import { useState } from "react";
import { SIDEBAR_ICONS } from "@/app/config/Dashboard/sidebarIcons/SidebarIcons";

import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hook";

import sidebarToggle from "@/assets/Images/Icons/common/sidebar.png";
import { getRoleConfig } from "@/app/config/getRoleConfig/getRoleConfig";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { activeContext } = useAppSelector((state) => state.auth);

  const roleConfig = getRoleConfig(activeContext);

  const basePath =
    roleConfig.basePath === "/superadmin"
      ? "/superadmin"
      : `/app/${activeContext?.tenantId}`;

  

  // Grab the static menu directly from the config instead of fetching from backend
  const sidebarMenu = roleConfig.menu || [];

  //  Build menu paths
  const menuWithPath = sidebarMenu.map((item: any) => ({
    ...item,
    fullPath:
      item.path === "/logout"
        ? item.path
        : `${basePath}${item.path}`,
  }));

  // No client-side filter needed for now based on your static configs
  const filteredMenu = menuWithPath || [];

  return (
    <aside
      className={`h-screen border-r border-[var(--color-neutral-20)] p-2 
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
          <h1 className="text-primary font-bold text-lg whitespace-nowrap">
            MSAAS
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
        {filteredMenu.map((item) => {
          const isOpen = openMenu === item.id;

          // 🔥 CASE 1: Parent with children
          if ("children" in item && item.children) {
            return (
              <div key={item.id}>
                {/* Parent */}
                <div
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.id)
                  }
                  className="flex items-center h-10 px-3 cursor-pointer hover:bg-[var(--color-neutral-10)] rounded"
                >
                  <img
                    src={SIDEBAR_ICONS[item.id as keyof typeof SIDEBAR_ICONS]}
                    className="w-5 h-5"
                  />
                  {!collapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </div>

                {/* Children */}
                {isOpen && !collapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child: any) => {
                      const fullPath = `${basePath}${child.path}`;

                      return (
                        <div
                          key={child.id}
                          onClick={() => navigate(fullPath)}
                          className={`text-sm cursor-pointer px-2 py-1 rounded
                    ${location.pathname === fullPath
                              ? "text-primary"
                              : "text-muted hover:text-primary"
                            }`}
                        >
                          {child.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // 🔥 CASE 2: Normal item
          const fullPath =
            item.path === "/logout"
              ? `${basePath}${item.path}`
              : `${basePath}${item.path}`;

          return (
            <div
              key={item.id}
              onClick={() => navigate(fullPath)}
              className={`flex items-center h-10 px-3 cursor-pointer rounded
        ${location.pathname === fullPath
                  ? "bg-[rgba(var(--color-primary-light),0.1)] text-primary"
                  : "text-muted hover:bg-[rgba(var(--color-primary-light),0.1)]"
                }`}
            >
              <img
                src={SIDEBAR_ICONS[item.id as keyof typeof SIDEBAR_ICONS]}
                className="w-5 h-5"
              />

              {!collapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}