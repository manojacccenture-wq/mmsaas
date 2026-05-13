import React from "react";
import Card from "@/shared/components/UI/Card/Card";
import Button from "@/shared/components/UI/Button/Button";

export interface QuickAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "outlinePrimary" | "secondaryLight";
}

interface QuickActionsCardProps {
  title?: string;
  actions: QuickAction[];
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  title = "Quick Actions",
  actions,
}) => {
  return (
    <Card padding="p-5" rounded="rounded-2xl" className="border border-[var(--color-neutral-20)]">
      <h3 className="text-sm font-semibold text-[var(--color-text-title)] mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant ?? "outlinePrimary"}
            size="sm"
            onClick={action.onClick}
            className="flex items-center gap-2 rounded-xl"
          >
            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsCard;
