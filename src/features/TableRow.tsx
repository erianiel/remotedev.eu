import { flexRender } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { Job } from "../types";

type TableRowProps = { row: Row<Job> };

function TableRow({ row }: TableRowProps) {
  return (
    <tr className="h-14 hover:bg-amber-100">
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className={`border-b border-gray-200 py-2 px-4 text-gray-800 break-words text-xs sm:text-sm ${
            cell.column.columnDef.meta?.className || ""
          }`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
