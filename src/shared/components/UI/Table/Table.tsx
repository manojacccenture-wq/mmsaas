import React from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T, rowIndex: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  actions?: (row: T, rowIndex: number) => React.ReactNode;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyMessage?: string;
  className?: string;
}

function Table<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  actions,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
}: TableProps<T>) {
  if (!columns.length) return null;

  return (
    <div
      className={`w-full bg-white border border-[var(--color-neutral-20)] rounded-2xl overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* ================= HEADER ================= */}
          <thead>
            <tr className="border-b-2 border-[var(--color-neutral-20)]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-5 py-6 text-left font-semibold text-base text-[var(--color-text-title)] border-r border-[var(--color-neutral-20)] last:border-r-0"
                >
                  {column.label}
                </th>
              ))}

              {actions && (
                <th className="px-5 py-6 text-left font-semibold text-base text-[var(--color-text-title)]">
                  Action
                </th>
              )}
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-10 text-center text-[var(--color-neutral-40)]"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-10 text-center text-[var(--color-neutral-40)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={`border-b border-[var(--color-neutral-20)] 
                    hover:bg-[var(--color-neutral-10)] 
                    transition-colors duration-150 
                    last:border-b-0 
                    ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${String(column.key)}`}
                      className="px-5 py-6 text-base text-[var(--color-text-paragraph)] border-r border-[var(--color-neutral-20)] last:border-r-0"
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : (row[column.key] as React.ReactNode)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-5 py-6">
                      {actions(row, rowIndex)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;