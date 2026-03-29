import React, { useState, useCallback } from "react";
import type { ForwardedRef } from "react";
import eyeOpen from "@/assets/Images/Icons/common/eye.png"
import eyeClose from "@/assets/Images/Icons/common/eye-off.png"

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: React.ReactNode;
  labelClassName?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  formatter?: (value: string) => string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  containerClass?: string;
  icon?: React.ElementType;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      labelClassName = "",
      error,
      helperText,
      formatter,
      onChange,
      className = "",
      containerClass = "",
      placeholder = "",
      disabled = false,
      value: controlledValue,
      defaultValue,
      icon: Icon,
      showPasswordToggle,
      ...props
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [showPassword, setShowPassword] = useState(false);

 const isPassword = type === "password" && showPasswordToggle;



    const isControlled = controlledValue !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState<string>(
      (defaultValue as string) || ""
    );

    const value = isControlled
      ? (controlledValue as string)
      : uncontrolledValue;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (formatter) {
          newValue = formatter(newValue);
        }

        if (!isControlled) {
          setUncontrolledValue(newValue);
        }

        // Always update event value BEFORE calling RHF
        e.target.value = newValue;

        // Call RHF or parent onChange if exists
        if (onChange) {
          onChange(e);
        }
      },
      [formatter, isControlled, onChange]
    );
    const baseInputClasses = `
      w-full
      px-[20px]
      py-[12px]
      text-[16px]
      font-normal
      leading-[20px]
      font-['Outfit',sans-serif]
      bg-white
      rounded-[8px]
      border-[1.5px]
      border-solid
      transition-all
      duration-200
      placeholder:text-[#a9afbd]
      placeholder:font-normal
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-[#00bfa6]
      ${error
        ? "border-[#f44444] focus-visible:ring-[#f44444]"
        : "border-[#cbced6] focus:border-[#00bfa6]"
      }
      ${disabled
        ? "bg-[#f5f5f5] text-[#999999] border-[#e0e0e0] cursor-not-allowed"
        : "text-[#333333]"
      }
      ${Icon ? "pl-[58px]" : "pl-[20px]"}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    const containerClasses = `
      relative
      w-full
      flex
      flex-col
      gap-[4px]
      ${containerClass}
    `
      .replace(/\s+/g, " ")
      .trim();

    const labelClasses = `
      text-[14px]
      font-medium
      leading-[18px]
      font-['Outfit',sans-serif]
      text-[#333333]
      ${labelClassName}
    `
      .replace(/\s+/g, " ")
      .trim();

    const helperClasses = `
      text-[12px]
      font-normal
      leading-[16px]
      font-['Outfit',sans-serif]
      ${error ? "text-[#f44444]" : "text-[#666666]"}
    `
      .replace(/\s+/g, " ")
      .trim();


    return (
      <div className={containerClasses}>
        {label && <label className={labelClasses}>{label}</label>}

        <div className="relative w-full">
          {Icon && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center px-[20px] py-[13px] size-[44px] pointer-events-none">
              <Icon className="size-[18px]" />
            </div>
          )}

          <input
            autoComplete="off"
            ref={ref}
         type={isPassword ? (showPassword ? "text" : "password") : type}
            value={value}
            // onChange={isRHF ? onChange : handleChange}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />

          {isPassword && (
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <img
                src={showPassword ? eyeOpen : eyeClose}
                className="h-4 w-auto"
                alt="toggle password"
              />
            </div>
          )}
        </div>

        {helperText && <p className={helperClasses}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;