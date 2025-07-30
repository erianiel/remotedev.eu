import { useSearch } from "@tanstack/react-router";

function TableFooter() {
  const { page } = useSearch({ from: "/" });

  return (
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
                <span>Page {page} of 10</span>
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
