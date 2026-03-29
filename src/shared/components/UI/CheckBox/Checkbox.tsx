import React, { type ForwardedRef } from "react";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  className?: string;
}

const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
  (
    { label, className = "", ...props },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <label
        className={`flex items-center gap-3 cursor-pointer text-sm text-gray-700 ${className}`}
      >
        <input
          type="checkbox"
          ref={ref}
          className="h-5 w-5 rounded border-2 cursor-pointer"
          {...props}
        />

        <span>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;