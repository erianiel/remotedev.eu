import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import { useIsMobile } from "../hooks/useIsMobile";
import type { Job } from "../types";

type TableHeaderProps = {
  headerGroup: HeaderGroup<Job>;
};

function TableHeader({ headerGroup }: TableHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          className={`text-sm border-b border-slate-100 px-4 py-2 text-left font-semibold text-gray-700 ${
            isMobile ? "w-1/2" : "w-1/4"
          }`}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </th>
      ))}
    </tr>
  );
}

export default TableHeader;
