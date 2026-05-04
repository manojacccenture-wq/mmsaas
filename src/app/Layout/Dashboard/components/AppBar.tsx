import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/store/hook";
import ContextSwitcher from "@/shared/components/ContextSwitcher/ContextSwitcher";
import { getRoleConfig } from "@/app/config/getRoleConfig/getRoleConfig";

export default function AppBar() {
  const location = useLocation();

  const { user, activeContext } = useAppSelector((state) => state.auth);

  const roleConfig = getRoleConfig(activeContext);

  const cleanPath = location.pathname
    .replace(/^\/superadmin/, "")
    .replace(/^\/app\/[^/]+/, "");

  const title =
    roleConfig.titles[cleanPath as keyof typeof roleConfig.titles] ||
    "Dashboard";

  return (
    <div className="border-b flex items-center p-3 justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-heading">
          {title}
        </h2>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right">
            <p className="text-sm font-semibold text-heading">{user.Name}</p>
            <p className="text-xs text-muted">{user.Email}</p>
            <p className="text-xs text-primary">{user.Role}</p>
          </div>
        )}

        <ContextSwitcher />

        {/* profile icon */}
        <div className="w-9 h-9 rounded-full bg-[var(--color-neutral-30)] flex items-center justify-center text-heading font-semibold">
          {user?.Name?.charAt(0)}
        </div>
      </div>
    </div>
  );
}