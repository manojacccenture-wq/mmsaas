import React from "react";

type OptionType =
  | string
  | {
      value?: string | number;
      label?: string;
    };

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options?: OptionType[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  error?: boolean;
  helperText?: string;
  variant?: "default" | "error" | "success" | "disabled";
  size?: "sm" | "md" | "lg"; // ✅ your custom size stays unchanged
  disabled?: boolean;
  className?: string;
  containerClass?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
                key={
                  typeof option === "object"
                    ? option.value ?? option.label
                    : option
                }
                value={
                  typeof option === "object"
                    ? option.value ?? option.label
                    : option
                }
              >
                {typeof option === "object"
                  ? option.label ?? option.value
                  : option}
              </option>
            ))}
          </select>

          <div className="select-arrow">▼</div>
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