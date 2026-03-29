import React, { useState, useCallback } from "react";

const Input = React.forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      variant = "default",
      size = "md",
      icon: Icon,
      className = "",
      containerClass = "",
      disabled = false,
      value: controlledValue,
      defaultValue,
      formatter,
      onChange,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue || ""
    );

    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleChange = useCallback(
      (e) => {
        let newValue = e.target.value;

        if (formatter) newValue = formatter(newValue);

        if (!isControlled) setUncontrolledValue(newValue);

        if (onChange) {
          e.target.value = newValue;
          onChange(e);
        }
      },
      [formatter, isControlled, onChange]
    );

    /* ================= VARIANTS ================= */

    const variants = {
      default: "input-default",
      success: "input-success",
      error: "input-error",
      disabled: "input-disabled",
    };

    const sizes = {
      sm: "input-sm",
      md: "input-md",
      lg: "input-lg",
    };

    return (
      <div className={`input-container ${containerClass}`}>
        {label && <label className="input-label">{label}</label>}

        <div className="relative w-full">
          {Icon && (
            <div className="input-icon">
              <Icon className="size-[18px]" />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`
              input-base
              ${variants[error ? "error" : variant]}
              ${sizes[size]}
              ${Icon ? "pl-icon" : ""}
              ${className}
            `}
            {...props}
          />
        </div>

        {helperText && (
          <p className={`input-helper ${error ? "input-helper-error" : ""}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;