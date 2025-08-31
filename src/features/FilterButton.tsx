import { ChevronDown, ChevronUp } from "lucide-react";

type FilterButtonProps = {
  children: React.ReactNode;
  isOpenMenu?: boolean;
  onClick?: () => void;
};

function FilterButton({
  children,
  isOpenMenu = false,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      className={`${isOpenMenu ? "border-stone-400" : "border-stone-900"} rounded-lg py-1 px-2 w-52 border shadow-sm text-sm cursor-pointer active:shadow-md`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center gap-2">
        <span className="truncate max-w-">{children}</span>{" "}
        {isOpenMenu ? <ChevronUp /> : <ChevronDown />}
      </div>
    </button>
  );
}

export default FilterButton;
