import type { Column } from "@tanstack/react-table";
import type { Job } from "../types";

type TableSkeletonRowsProps = {
  columns: Column<Job, unknown>[];
  rowCount: number;
};

const skeletonWidthByColumn: Record<string, string> = {
  title: "w-3/4",
  company: "w-2/3",
  country: "w-1/2",
  created_at: "w-1/3",
};

function TableSkeletonRows({ columns, rowCount }: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rowCount }, (_, index) => (
        <tr key={`skeleton-row-${index}`} className="h-14">
          {columns.map((column) => (
            <td
              key={`skeleton-cell-${column.id}-${index}`}
              className={`border-b border-gray-200 py-2 px-4 text-gray-800 break-words text-xs sm:text-sm ${
                column.columnDef.meta?.className || ""
              }`}
            >
              <div
                className={`h-3 ${
                  skeletonWidthByColumn[column.id] || "w-2/3"
                } rounded bg-stone-200 animate-pulse`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default TableSkeletonRows;
