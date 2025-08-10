import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import TableFooter from "./TableFooter";
import type { Job } from "../types";
import { useJobsCount } from "../hooks/useJobsCount";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useIsMobile } from "../hooks/useIsMobile";
import { ChevronDown, ChevronUp } from "lucide-react";

function Table() {
  const { pageSize, sort } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  });
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (!sort) {
      return [{ id: "created_at", desc: true }];
    }

    const [sortBy, sortDir] = sort.split(".");
    return [{ id: sortBy, desc: sortDir === "desc" }];
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
    }));
  }, [pageSize]);

  const { jobs, error, isLoading } = useJobs(pagination, sorting);
  const { jobsCount } = useJobsCount();
  const isMobile = useIsMobile(768);
  const columnHelper = createColumnHelper<Job>();

  const toggleSort = useCallback(() => {
    setSorting((prev) => {
      const current = prev.find((s) => s.id === "created_at");
      const newDir = current?.desc === false ? true : false;

      navigate({
        search: (prevSearch) => ({
          ...prevSearch,
          sort: newDir ? "created_at.desc" : "created_at.asc",
        }),
      });

      return [{ id: "created_at", desc: newDir }];
    });
  }, [navigate]);

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
              className={`font-medium border-b cursor-pointer`}
            >
              {title}
            </a>
          );
        },
        meta: {
          className: isMobile && "truncate whitespace-nowrap",
        },
      }),
      ...(!isMobile
        ? [
            columnHelper.accessor("company", {
              header: () => <span>Company</span>,
              cell: (info) => info.getValue(),
            }),
          ]
        : []),
      columnHelper.accessor("location", {
        header: () => <span>Location</span>,
        cell: (info) => info.getValue(),
      }),
      ...(!isMobile
        ? [
            columnHelper.accessor("created_at", {
              header: ({ column }) => {
                const isSorted = column.getIsSorted();
                console.log(isSorted);
                return (
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <button
                      onClick={toggleSort}
                      className="flex items-center gap-1"
                    >
                      {isSorted === "asc" ? (
                        <ChevronUp className="h-3 w-3 font-bold" />
                      ) : (
                        <ChevronDown className="h-3 w-3 font-bold" />
                      )}
                    </button>
                  </div>
                );
              },
              cell: (info) => {
                return new Date(info.getValue() || "")
                  .toLocaleDateString()
                  .split("T")[0];
              },
            }),
          ]
        : []),
    ],
    [columnHelper, isMobile, toggleSort]
  );

  const table = useReactTable<Job>({
    data: jobs ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: jobsCount ?? 0,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="rounded-lg overflow-hidden border border-stone-900 shadow-md">
      {isLoading && <h3>Loading...</h3>}
      {error && <h3>An error has occurred!</h3>}
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-amber-400">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-sm border-b border-slate-100 px-4 py-2 text-left font-semibold text-gray-700 ${
                      isMobile ? "w-1/2" : "w-1/4"
                    }`}
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
                  className={`border-b border-gray-200 py-2 px-4 text-gray-800 break-words text-xs sm:text-sm ${
                    cell.column.columnDef.meta?.className || ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <TableFooter
          pageSize={table.getState().pagination.pageSize}
          pageCount={table.getPageCount()}
          rowCount={table.getRowCount()}
          pageIndex={table.getState().pagination.pageIndex}
          onClickFirstPage={() => table.firstPage()}
          shouldDisableFirstPageButton={!table.getCanPreviousPage()}
          onClickPreviousPage={() => table.previousPage()}
          shouldDisablePreviousPageButton={!table.getCanPreviousPage()}
          onClickNextPage={() => table.nextPage()}
          shouldDisableNextPageButton={!table.getCanNextPage()}
          onClickLastPage={() => table.lastPage()}
          shouldDisableLastPageButton={!table.getCanNextPage()}
        />
      </table>
    </div>
  );
}

export default Table;
