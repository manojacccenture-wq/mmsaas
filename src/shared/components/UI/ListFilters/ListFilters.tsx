import React from "react";

interface Props {
  title: string;
  totalCount?: number;
  children?: React.ReactNode;
}

const ListFilters: React.FC<Props> = ({
  title,
  totalCount,
  children,
}) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 bg-white p-4 rounded-xl ">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <h5 className="font-semibold">
          {title}
        </h5>

        {totalCount !== undefined && (
          <span className="text-muted text-sm">
            ({totalCount})
          </span>
        )}
      </div>

      {/* RIGHT SECTION (Filters) */}
      <div className="flex items-center gap-4 flex-wrap">
        {children}
      </div>

    </div>
  );
};

export default ListFilters;