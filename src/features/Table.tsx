import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import TableFooter from "./TableFooter";
import type { Job } from "../types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useIsMobile } from "../hooks/useIsMobile";
import { ChevronDown, ChevronUp } from "lucide-react";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

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
      pageIndex: 0,
      pageSize,
    }));
  }, [pageSize]);

  const { jobs, error, isLoading } = useJobs(pagination, sorting);
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
          className: isMobile ? "w-[70%] truncate whitespace-nowrap" : "w-2/4",
        },
      }),
      ...(!isMobile
        ? [
            columnHelper.accessor("company", {
              header: () => <span>Company</span>,
              cell: (info) => info.getValue(),
              meta: {
                className: "w-[25%]",
              },
            }),
          ]
        : []),
      columnHelper.accessor("country", {
        header: () => <span>Country</span>,
        cell: (info) => {
          const country = info.getValue();
          const location = info.row.original.location;

          return (
            <div className="relative group inline-block">
              <p className="cursor-help">{country}</p>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                {location}
              </div>
            </div>
          );
        },
        meta: {
          className: `${isMobile ? "w-[30%]" : "w-[22%]"}`,
        },
      }),
      ...(!isMobile
        ? [
            columnHelper.accessor("created_at", {
              header: ({ column }) => {
                const isSorted = column.getIsSorted();

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
              meta: {
                className: "md:w-[8rem] lg:w-[9rem]",
              },
            }),
          ]
        : []),
    ],
    [columnHelper, isMobile, toggleSort]
  );

  const table = useReactTable<Job>({
    data: jobs?.data ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: jobs?.meta.total ?? 0,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="rounded-lg overflow-hidden border border-stone-900 shadow-md">
      {isLoading && <h3 className="p-6">Loading...</h3>}
      {error && (
        <h3 className="p-6 text-rose-500 font-medium">
          An error has occurred!
        </h3>
      )}
      {!isLoading && !error && (
        <table className="table-fixed w-full border-collapse">
          <thead className="bg-amber-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeader headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} row={row} />
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
      )}
    </div>
  );
}

export default Table;
