import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

type TableFooterProps = {
  pageSize: number;
  pageCount: number;
  rowCount: number;
};

function TableFooter({ pageSize, pageCount, rowCount }: TableFooterProps) {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          pageSize: newPageSize,
          page: 1,
        }),
      });
    },
    [navigate]
  );

  return (
    <tfoot>
      <tr className="bg-stone-900 border-slate-100 text-sm text-white">
        <td colSpan={100} className="p-4">
          <div className="flex justify-between items-center w-full">
            <p className="font-normal">
              <span className="font-bold">{rowCount}</span> jobs found
            </p>

            <div className="flex gap-6">
              <div className="flex gap-2 items-center">
                <p>Lines per page</p>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  {[10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="cursor-pointer">Previous</button>
                <span>
                  Page {page} of {pageCount}
                </span>
                <button>Next</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
}

export default TableFooter;
