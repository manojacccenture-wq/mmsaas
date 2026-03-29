import React from "react";

const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      value,
      defaultValue = "",
      onChange,
      error,
      helperText,
      variant = "default",
      size = "md",
      disabled = false,
      className = "",
      containerClass = "",
      placeholder = "Select option",
      ...props
    },
    ref
  ) => {
    /* ================= VARIANTS ================= */

    const variants = {
      default: "select-default",
      error: "select-error",
      success: "select-success",
      disabled: "select-disabled",
    };

    const sizes = {
      sm: "select-sm",
      md: "select-md",
      lg: "select-lg",
    };

    return (
      <div className={`select-container ${containerClass}`}>
        {label && <label className="select-label">{label}</label>}

        <div className="relative w-full">
          <select
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            className={`
              select-base
              ${variants[error ? "error" : variant]}
              ${sizes[size]}
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>

            {options.map((option) => (
              <option
                key={option.value || option}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <div className="select-arrow">
            ▼
          </div>
        </div>

        {helperText && (
          <p className={`select-helper ${error ? "select-helper-error" : ""}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;