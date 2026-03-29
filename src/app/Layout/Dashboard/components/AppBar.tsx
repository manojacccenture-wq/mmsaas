import { useLocation } from "react-router-dom";
import { ROUTE_TITLES } from "@/app/config/Dashboard/routeTitles";
import { useAppSelector } from "@/app/store/hook";

export default function AppBar() {
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);

  const title = ROUTE_TITLES[location.pathname] || "Dashboard";

  return (
    <div className="border-b flex items-center p-3 justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-gray-800">
          {title}
        </h2>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right">
            <p className="text-sm font-semibold">{user.Name}</p>
            <p className="text-xs text-gray-500">{user.Email}</p>
            <p className="text-xs text-blue-500">{user.Role}</p>
          </div>
        )}

        {/* profile icon */}
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
          {user?.Name?.charAt(0)}
        </div>
      </div>
    </div>
  );
}