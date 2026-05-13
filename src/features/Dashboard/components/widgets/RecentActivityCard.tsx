import React from "react";
import Card from "@/shared/components/UI/Card/Card";
import Button from "@/shared/components/UI/Button/Button";

export interface ActivityRow {
  primary: string;
  secondary?: string;
  badge?: { label: string; color: string };
  meta?: string;
}

interface RecentActivityCardProps {
  title: string;
  rows: ActivityRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

const statusBadgeBase = "px-2 py-0.5 text-xs font-semibold rounded-full capitalize";

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  title,
  rows,
  isLoading = false,
  emptyMessage = "No recent activity.",
  viewAllLabel = "View All",
  onViewAll,
}) => {
  return (
    <Card padding="p-5" rounded="rounded-2xl" className="border border-[var(--color-neutral-20)] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-[var(--color-text-title)]">{title}</h3>
        {onViewAll && (
          <Button variant="outlinePrimary" size="sm" onClick={onViewAll} className="rounded-lg text-xs">
            {viewAllLabel}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">{emptyMessage}</p>
      ) : (
        <div className="divide-y divide-[var(--color-neutral-20)]">
          {rows.map((row, i) => (
            <div key={i} className="py-3 flex justify-between items-center gap-4">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-800 truncate">{row.primary}</span>
                {row.secondary && (
                  <span className="text-xs text-gray-400 truncate mt-0.5">{row.secondary}</span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {row.badge && (
                  <span className={`${statusBadgeBase} ${row.badge.color}`}>
                    {row.badge.label}
                  </span>
                )}
                {row.meta && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">{row.meta}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivityCard;
