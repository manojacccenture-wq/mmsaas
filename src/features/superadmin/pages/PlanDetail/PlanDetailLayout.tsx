import React from "react";
import { Link, Outlet } from "react-router-dom";

const PlanDetailLayout: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
        <Link to="" className="text-gray-600 hover:text-indigo-600 font-medium">Overview</Link>
        <Link to="subscriptions" className="text-gray-600 hover:text-indigo-600 font-medium">Subscriptions</Link>
        <Link to="settings" className="text-gray-600 hover:text-indigo-600 font-medium">Settings</Link>
      </div>

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PlanDetailLayout;
