import React from "react";
import Card from "@/shared/components/UI/Card/Card";

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = "var(--color-primary)",
  valueColor = "var(--color-neutral-100)",
  className = "",
}) => {
  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>

      <div>
        <p className="text-xs text-[var(--color-neutral-60)]">
          {label}
        </p>

        <p
          className="text-lg font-semibold"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </Card>
  );
};

export default StatCard;
