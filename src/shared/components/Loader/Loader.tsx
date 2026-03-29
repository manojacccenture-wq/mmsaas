import React from "react";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "primary" | "success" | "danger" | "dark";

interface LoaderProps {
  size?: LoaderSize;
  fullScreen?: boolean;
  text?: string;
  variant?: LoaderVariant;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  fullScreen = true,
  text = "Loading...",
  variant = "primary",
}) => {
  const sizeClasses: Record<LoaderSize, string> = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-[6px]",
  };

  const colorClasses: Record<LoaderVariant, string> = {
    primary: "border-blue-500",
    success: "border-green-500",
    danger: "border-red-500",
    dark: "border-gray-800",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : ""
      }`}
    >
      <div
        className={`rounded-full animate-spin border-t-transparent ${
          sizeClasses[size]
        } ${colorClasses[variant]}`}
      />
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export default Loader;