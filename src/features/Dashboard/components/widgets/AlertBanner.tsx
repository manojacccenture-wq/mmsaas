import React from "react";

interface AlertBannerProps {
  message: string;
  variant?: "warning" | "info" | "error" | "success";
  action?: { label: string; onClick: () => void };
}

const variantStyles = {
  warning: "bg-amber-50 border-amber-300 text-amber-800",
  info:    "bg-indigo-50 border-indigo-300 text-indigo-800",
  error:   "bg-red-50 border-red-300 text-red-700",
  success: "bg-green-50 border-green-300 text-green-700",
};

const variantIcons = {
  warning: "⚠️",
  info: "ℹ️",
  error: "🚨",
  success: "✅",
};

const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  variant = "warning",
  action,
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-sm font-medium ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2">
        <span>{variantIcons[variant]}</span>
        <span>{message}</span>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="underline underline-offset-2 text-xs font-semibold hover:opacity-70 transition-opacity shrink-0"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
