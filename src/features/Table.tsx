import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useJobs } from "./useJobs";
import TableFooter from "./TableFooter";
import type { Job } from "../types";
import { useSearch } from "@tanstack/react-router";

function Table() {
  const { page } = useSearch({ from: "/" });
  const { jobs, error, isLoading } = useJobs(page);
  const columnHelper = createColumnHelper<Job>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: () => <span>Title</span>,
        cell: (info) => {
          const title = info.getValue();
          return (
            <a
              href={info.row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium border-b cursor-pointer"
            >
              {title}
            </a>
          );
        },
      }),
      columnHelper.accessor("company", {
        header: () => <span>Company</span>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("location", {
        header: () => <span>Location</span>,
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable<Job>({
    data: jobs ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg overflow-hidden border border-stone-900 shadow-md">
      {isLoading && <h3>Loading...</h3>}
      {error && <h3>An error has occurred!n</h3>}
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-amber-400">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-sm border-b border-slate-100 px-4 py-2 text-left font-semibold text-gray-700 w-1/3"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="h-14 hover:bg-amber-100">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-gray-200 py-2 px-4 text-gray-800 break-words text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <TableFooter />
      </table>
    </div>
  );
}

export default Table;
