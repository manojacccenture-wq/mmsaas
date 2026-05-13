import React from "react";
import Card from "@/shared/components/UI/Card/Card";

const accentStyles: Record<string, { bg: string; text: string; ring: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-200" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  ring: "ring-green-200"  },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  ring: "ring-amber-200"  },
  red:    { bg: "bg-red-50",    text: "text-red-600",    ring: "ring-red-200"    },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-200" },
  gray:   { bg: "bg-gray-50",   text: "text-gray-500",   ring: "ring-gray-200"   },
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "indigo" | "green" | "amber" | "red" | "violet" | "gray";
  isLoading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accent = "indigo",
  isLoading = false,
  onClick,
}) => {
  const styles = accentStyles[accent];

  return (
    <Card
      padding="p-5"
      rounded="rounded-2xl"
      className={`border border-[var(--color-neutral-20)] flex flex-col gap-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <div className={`w-9 h-9 flex items-center justify-center rounded-xl ring-1 ${styles.bg} ${styles.text} ${styles.ring}`}>
            {icon}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <p className={`text-3xl font-bold tracking-tight ${styles.text}`}>
          {value}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
