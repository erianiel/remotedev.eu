import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import type { Job } from "../types";

type TableHeaderProps = {
  headerGroup: HeaderGroup<Job>;
};

function TableHeader({ headerGroup }: TableHeaderProps) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          className={`text-sm border-slate-100 px-4 py-2 text-left font-semibold text-gray-700 ${header.column.columnDef.meta?.className}`}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </th>
      ))}
    </tr>
  );
}

export default TableHeader;
