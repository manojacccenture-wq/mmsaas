import React, { type ForwardedRef } from "react";

type ButtonVariant =
  | "primary"
  | "primaryLight"
  | "primaryDark"
  | "secondary"
  | "secondaryLight"
  | "secondaryDark"
  | "success"
  | "successLight"
  | "successDark"
  | "info"
  | "infoDark"
  | "infoLight"
  | "warning"
  | "warningLight"
  | "warningDark"
  | "danger"
  | "dangerLight"
  | "dangerDark"
  | "outlinePrimary"
  | "outlineSecondary"
  | "outlineSuccess"
  | "outlineInfo"
  | "outlineWarning"
  | "outlineDanger"
  | "icon";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      disabled = false,
      className = "",
      onClick,
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClasses =
      "btn inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
      primary: "btn-primary",
      primaryLight: "btn-primary-light",
      primaryDark: "btn-primary-dark",

      secondary: "btn-secondary",
      secondaryLight: "btn-secondary-light",
      secondaryDark: "btn-secondary-dark",

      success: "btn-success",
      successLight: "btn-success-light",
      successDark: "btn-success-dark",

      info: "btn-info",
      infoDark: "btn-info-dark",
      infoLight: "btn-info-light",

      warning: "btn-warning",
      warningLight: "btn-warning-light",
      warningDark: "btn-warning-dark",

      danger: "btn-danger",
      dangerLight: "btn-danger-light",
      dangerDark: "btn-danger-dark",

      outlinePrimary: "btn-outline-primary",
      outlineSecondary: "btn-outline-secondary",
      outlineSuccess: "btn-outline-success",
      outlineInfo: "btn-outline-info",
      outlineWarning: "btn-outline-warning",
      outlineDanger: "btn-outline-danger",

      icon: "btn-icon",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      icon: "w-10 h-10 p-0",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
          ${baseClasses}
          ${variants[variant] || "btn-primary"}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;