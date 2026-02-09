import { ChevronDown, ChevronUp } from "lucide-react";

type FilterButtonProps = {
  children: React.ReactNode;
  isOpenMenu?: boolean;
  onClick?: () => void;
  count?: number;
  onClear?: (e: React.MouseEvent) => void;
};

function FilterButton({
  children,
  isOpenMenu = false,
  onClick,
  count,
  onClear,
}: FilterButtonProps) {
  const hasActiveFilter = count !== undefined && count > 0;

  return (
    <button
      className={`${
        hasActiveFilter
          ? "border-amber-500 bg-amber-50"
          : isOpenMenu
            ? "border-stone-400"
            : "border-stone-900"
      } rounded-lg py-1 px-2 w-full md:w-52 border shadow-sm text-sm cursor-pointer active:shadow-md transition-colors`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center gap-2">
        <span className="truncate max-w- flex items-center gap-1">
          {children}
          {hasActiveFilter && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold rounded-full bg-amber-500 text-white">
              {count}
            </span>
          )}
        </span>
        <div className="flex items-center gap-1">
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center justify-center w-5 h-5 rounded text-current hover:bg-rose-100 hover:text-rose-600 transition-colors"
              title="Clear filter"
              type="button"
              aria-label="Clear filter"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          )}
          {isOpenMenu ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
    </button>
  );
}

export default FilterButton;
