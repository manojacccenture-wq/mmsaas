import { Outlet } from "react-router-dom";
import Sidebar from "@/app/Layout/Dashboard/components/Sidebar";
import Header from "@/app/Layout/Dashboard/components/AppBar";
import { useState } from "react";
// import { useLayout } from "../context/LayoutContext";

const DashboardLayout = () => {
  // const { layout } = useLayout();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen ">

      {/* Sidebar */}
      {/* layout.sidebar && */ <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

      {/* Right Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        {/* layout.header && */ <Header />}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
