import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { useAggregations } from "../hooks/useAggregations";
import SearchBar from "../ui/SearchBar";
import Checkbox from "../ui/Checkbox";

type FacetContextValue = {
  openId: string;
  setOpenId: (id: string) => void;
  selectedItems: Record<string, string[]>;
  toggleItem: (filterId: string, itemId: string) => void;
  clearFilter: (filterId: string) => void;
};

type Position = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
};

const FacetContext = createContext<FacetContextValue | undefined>(undefined);

const useFacetContext = () => {
  const context = useContext(FacetContext);
  if (!context) {
    throw new Error("Facet components must be used within FacetProvider");
  }
  return context;
};

export function FacetProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>(
    {},
  );

  const toggleItem = useCallback((filterId: string, itemId: string) => {
    setSelectedItems((prev) => {
      const currentItems = prev[filterId] || [];
      const isSelected = currentItems.includes(itemId);

      return {
        ...prev,
        [filterId]: isSelected
          ? currentItems.filter((id) => id !== itemId)
          : [...currentItems, itemId],
      };
    });
  }, []);

  const clearFilter = useCallback((filterId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [filterId]: [],
    }));
  }, []);

  const value = useMemo(
    () => ({ openId, setOpenId, selectedItems, toggleItem, clearFilter }),
    [openId, selectedItems, toggleItem, clearFilter],
  );

  return (
    <FacetContext.Provider value={value}>{children}</FacetContext.Provider>
  );
}

export function FacetTrigger({
  filterId,
  children,
}: {
  filterId: string;
  children: ReactNode;
}) {
  const { openId, setOpenId, selectedItems, clearFilter } = useFacetContext();
  const triggerRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === filterId;
  const selectedCount = selectedItems[filterId]?.length || 0;
  const hasSelection = selectedCount > 0;

  const toggleMenu = () => setOpenId(isOpen ? "" : filterId);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFilter(filterId);
  };

  return (
    <>
      <div ref={triggerRef} className="relative">
        <div onClick={toggleMenu}>
          {isValidElement(children)
            ? cloneElement(
                children as ReactElement<{
                  isOpenMenu?: boolean;
                  count?: number;
                  onClear?: (e: React.MouseEvent) => void;
                }>,
                {
                  isOpenMenu: isOpen,
                  count: hasSelection ? selectedCount : undefined,
                  onClear: hasSelection ? handleClear : undefined,
                },
              )
            : children}
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenId("")}
            aria-hidden="true"
          />
          <FacetMenu
            filterId={filterId}
            filterLabel={filterId}
            triggerElement={triggerRef.current}
          />
        </>
      )}
    </>
  );
}

function FacetMenu({
  filterId,
  filterLabel,
  triggerElement,
}: {
  filterId: string;
  filterLabel: string;
  triggerElement: HTMLElement | null;
}) {
  const { selectedItems, toggleItem, clearFilter, setOpenId } =
    useFacetContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollPositionRef = useRef(0);

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const { aggregations, isLoading, error } = useAggregations(
    filterId,
    search || undefined,
    true,
  );

  useEffect(() => {
    if (!triggerElement) return;

    const calculatePosition = () => {
      const rect = triggerElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 8;
      const menuWidth = rect.width;
      const maxMenuHeight = 356;

      // Vertical positioning
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldPlaceAbove =
        spaceBelow < maxMenuHeight && spaceAbove > spaceBelow;
      const availableSpace = shouldPlaceAbove ? spaceAbove : spaceBelow;
      const maxHeight = Math.min(availableSpace - gap, 256);

      // Horizontal positioning - prevent right overflow
      let left = rect.left;
      const menuRight = left + menuWidth;

      if (menuRight > viewportWidth - gap) {
        // Align dropdown to right edge of trigger
        left = rect.right - menuWidth;
        // Ensure it doesn't overflow left edge
        left = Math.max(gap, left);
      }

      setPosition({
        top: shouldPlaceAbove
          ? rect.top - maxHeight - gap - 100
          : rect.bottom + gap,
        left,
        width: rect.width,
        maxHeight,
        placement: shouldPlaceAbove ? "top" : "bottom",
      });
    };

    calculatePosition();
    window.addEventListener("scroll", calculatePosition, { passive: true });
    window.addEventListener("resize", calculatePosition);

    return () => {
      window.removeEventListener("scroll", calculatePosition);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [triggerElement]);

  useEffect(() => {
    if (listRef.current && scrollPositionRef.current) {
      listRef.current.scrollTop = scrollPositionRef.current;
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerElement?.contains(target)
      ) {
        setOpenId("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenId, triggerElement]);

  const handleItemToggle = useCallback(
    (itemId: string) => {
      if (listRef.current) {
        scrollPositionRef.current = listRef.current.scrollTop;
      }
      toggleItem(filterId, itemId);
    },
    [filterId, toggleItem],
  );

  const items = aggregations?.data || [];
  const selectedItemIds = selectedItems[filterId] || [];
  const hasSelection = selectedItemIds.length > 0;

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] rounded-lg border border-stone-400 bg-white shadow-2xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      role="menu"
      aria-label={`${filterLabel} filter menu`}
    >
      <div className="p-2 border-b border-stone-200 bg-white rounded-t-lg">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={`Search ${filterLabel.toLowerCase()}...`}
          className="w-full text-xs"
        />
      </div>

      <ul
        ref={listRef}
        onScroll={() => {
          if (listRef.current) {
            scrollPositionRef.current = listRef.current.scrollTop;
          }
        }}
        className={`list-none overflow-y-auto bg-white ${!hasSelection ? "rounded-b-lg" : ""}`}
        style={{ maxHeight: `${position.maxHeight}px` }}
      >
        {isLoading ? (
          <li className="p-4 text-center text-stone-600 text-sm">Loading...</li>
        ) : error ? (
          <li className="p-4 text-center text-red-600 text-sm">
            Error loading options
          </li>
        ) : items.length === 0 ? (
          <li className="p-4 text-center text-stone-600 text-sm">
            No results found
          </li>
        ) : (
          items.map((item: { id: string; label: string }) => (
            <li
              key={item.id}
              className="bg-white hover:bg-amber-50 border-b border-stone-100 last:border-b-0"
            >
              <Checkbox
                label={item.label}
                checked={selectedItemIds.includes(item.id)}
                onChange={() => handleItemToggle(item.id)}
              />
            </li>
          ))
        )}
      </ul>

      {hasSelection && (
        <div className="p-2 border-t border-stone-200 bg-gray-50 text-xs font-medium rounded-b-lg flex items-center justify-between">
          <span className="text-stone-700">
            {selectedItemIds.length} selected
          </span>
          <button
            onClick={() => clearFilter(filterId)}
            className="text-amber-600 hover:text-amber-700 hover:underline transition-colors"
            type="button"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

const Facet = {
  Provider: FacetProvider,
  Trigger: FacetTrigger,
};

export default Facet;
