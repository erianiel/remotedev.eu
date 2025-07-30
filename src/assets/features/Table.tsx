import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useJobs } from "./useJobs";

//Tdata
type Job = {
  title: string;
  url: string;
  company?: string;
  location?: string;
};

function Table() {
  const { jobs, error, isLoading } = useJobs();
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
        <tfoot>
          <tr className="bg-stone-900 border-slate-100 text-sm text-white">
            <td colSpan={100} className="p-4">
              <div className="flex justify-between items-center w-full">
                <p>
                  Total <span className="font-bold">10</span>
                </p>

                <div className="flex gap-6">
                  <div className="flex gap-2 items-center">
                    <p>Lines per page</p>
                    <select>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="cursor-pointer">Previous</button>
                    <span>Page 1 of 10</span>
                    <button>Next</button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
