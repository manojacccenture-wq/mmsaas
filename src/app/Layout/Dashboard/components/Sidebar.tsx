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
  const {  activeContext } = useAppSelector((state) => state.auth);



  const roleConfig = getRoleConfig(activeContext);



  const basePath =
    roleConfig.basePath === "/superadmin"
      ? "/superadmin"
      : `/app/${activeContext?.tenantId}`;

  //  Build menu
  const menuWithPath = roleConfig.menu?.map((item) => ({
    ...item,
    fullPath:
      item.path === "/logout"
        ? item.path
        : `${basePath}${item.path}`,
  }));



  
  // 🔥 Permission filter
  const filteredMenu = menuWithPath.filter((/* item */) =>

    true
    // hasPermission(user?.Role, item.permission)
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
        {/* {filteredMenu.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.fullPath)}
            title={collapsed ? item.label : ""}
            className={`flex items-center h-10 rounded-lg cursor-pointer text-sm
    transition-all duration-300 ease-in-out
    ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}
    ${location.pathname === item.fullPath
                ? "bg-[#00BFA6]/10 text-[#00BFA6]"
                : "text-gray-700 hover:bg-[#00BFA6]/10 hover:text-[#00BFA6]"
              }`}
          >

            <div className={`${collapsed ? "w-full flex justify-center" : ""}`}>
              <img
                src={SIDEBAR_ICONS[item.id as keyof typeof SIDEBAR_ICONS]}
                alt={item.label}
                className="w-5 h-5 object-contain"
              />
            </div>

            {!collapsed && (
              <span className="whitespace-nowrap">
                {item.label}
              </span>
            )}
          </div>
        ))} */}

        {filteredMenu.map((item) => {
          const isOpen = openMenu === item.id;

          // 🔥 CASE 1: Parent with children
          if (item.children) {
            return (
              <div key={item.id}>
                {/* Parent */}
                <div
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.id)
                  }
                  className="flex items-center h-10 px-3 cursor-pointer hover:bg-gray-100 rounded"
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
                    {item.children.map((child) => {
                      const fullPath = `${basePath}${child.path}`;

                      return (
                        <div
                          key={child.id}
                          onClick={() => navigate(fullPath)}
                          className={`text-sm cursor-pointer px-2 py-1 rounded
                    ${location.pathname === fullPath
                              ? "text-[#00BFA6]"
                              : "text-gray-600 hover:text-[#00BFA6]"
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
              ? item.path
              : `${basePath}${item.path}`;

          return (
            <div
              key={item.id}
              onClick={() => navigate(fullPath)}
              className={`flex items-center h-10 px-3 cursor-pointer rounded
        ${location.pathname === fullPath
                  ? "bg-[#00BFA6]/10 text-[#00BFA6]"
                  : "text-gray-700 hover:bg-[#00BFA6]/10"
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