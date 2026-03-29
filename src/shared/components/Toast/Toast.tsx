import React, { useEffect } from "react";

import type { ToastType } from "@/shared/components/Toast/api/toastSlice";


interface ToastProps {
  message?: string | null;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

const bgColor =
  type === "success"
    ? "bg-green-500"
    : type === "error"
    ? "bg-red-500"
    : type === "warning"
    ? "bg-yellow-500"
    : "bg-blue-500";

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;