import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import Button from "../ui/Button";
import { useIsMobile } from "../hooks/useIsMobile";

type TableFooterProps = {
  pageSize: number;
  pageCount: number;
  rowCount: number;
  pageIndex: number;
  onClickFirstPage?: () => void;
  shouldDisableFirstPageButton?: boolean;
  onClickPreviousPage?: () => void;
  shouldDisablePreviousPageButton?: boolean;
  onClickNextPage?: () => void;
  shouldDisableNextPageButton?: boolean;
  onClickLastPage?: () => void;
  shouldDisableLastPageButton?: boolean;
};

function TableFooter({
  pageSize,
  pageCount,
  rowCount,
  pageIndex,
  onClickFirstPage,
  shouldDisableFirstPageButton,
  onClickPreviousPage,
  shouldDisablePreviousPageButton,
  onClickNextPage,
  shouldDisableNextPageButton,
  onClickLastPage,
  shouldDisableLastPageButton,
}: TableFooterProps) {
  const navigate = useNavigate({ from: "/" });
  const isMobile = useIsMobile();

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          pageSize: newPageSize,
        }),
      });
    },
    [navigate]
  );

  const renderPaginationIndex = () => (
    <span className="text-amber-300">{pageIndex + 1}</span>
  );

  return (
    <tfoot>
      <tr className="bg-stone-900 border-slate-100 text-xs sm:text-sm text-white">
        <td colSpan={100} className="p-4">
          <div className="flex justify-between items-center w-full">
            <p className="font-normal hidden sm:block">
              <span className="font-bold">{rowCount}</span> jobs found
            </p>

            <div className="flex gap-6 justify-between items-center w-full sm:w-auto">
              <div className="flex gap-2 items-center">
                <p>Show</p>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="block h-6 cursor-pointer rounded-md border border-slate-100 bg-stone-800 px-1 text-zinc-50 hover:border-amber-300 focus:border-amber-300 focus:ring-amber-300 focus:ring-1 focus:outline-none"
                >
                  {[10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onClickFirstPage}
                  disabled={shouldDisableFirstPageButton}
                >
                  {"<<"}
                </Button>
                <Button
                  onClick={onClickPreviousPage}
                  disabled={shouldDisablePreviousPageButton}
                >
                  {"<"}
                </Button>

                <p>
                  {isMobile ? (
                    <>
                      {renderPaginationIndex()} / {pageCount}
                    </>
                  ) : (
                    <>
                      Page {renderPaginationIndex()} of {pageCount}
                    </>
                  )}
                </p>

                <Button
                  onClick={onClickNextPage}
                  disabled={shouldDisableNextPageButton}
                >
                  {">"}
                </Button>
                <Button
                  onClick={onClickLastPage}
                  disabled={shouldDisableLastPageButton}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
}

export default TableFooter;
