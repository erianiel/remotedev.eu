import {
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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAggregations } from "../hooks/useAggregations";
import SearchBar from "../ui/SearchBar";
import Checkbox from "../ui/Checkbox";
import { FacetContext, useFacetContext } from "./facet-context";

type Position = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
};

export function FacetProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate({ from: "/" });
  const searchParams = useSearch({ from: "/" });

  // Parse initial filters from URL
  const getInitialFilters = useCallback(() => {
    const filters: Record<string, string[]> = {};
    if (searchParams.country) {
      filters.country = searchParams.country.split(",").map((v) => v.trim());
    }
    if (searchParams.company) {
      filters.company = searchParams.company.split(",").map((v) => v.trim());
    }
    return filters;
  }, [searchParams.country, searchParams.company]);

  const [openId, setOpenId] = useState("");
  const [selectedItems, setSelectedItems] =
    useState<Record<string, string[]>>(getInitialFilters);

  // Sync filters to URL when they change
  useEffect(() => {
    navigate({
      search: (prev) => {
        const newSearch = { ...prev };

        // Update or remove country filter
        if (selectedItems.country && selectedItems.country.length > 0) {
          newSearch.country = selectedItems.country.join(",");
        } else {
          delete newSearch.country;
        }

        // Update or remove company filter
        if (selectedItems.company && selectedItems.company.length > 0) {
          newSearch.company = selectedItems.company.join(",");
        } else {
          delete newSearch.company;
        }

        return newSearch;
      },
      replace: true,
    });
  }, [selectedItems, navigate]);

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

  const commitDraft = useCallback((filterId: string, draftItems: string[]) => {
    setSelectedItems((prev) => ({
      ...prev,
      [filterId]: draftItems,
    }));
  }, []);

  const value = useMemo(
    () => ({
      openId,
      setOpenId,
      selectedItems,
      toggleItem,
      clearFilter,
      commitDraft,
    }),
    [openId, selectedItems, toggleItem, clearFilter, commitDraft],
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
  const { selectedItems, commitDraft, setOpenId } = useFacetContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollPositionRef = useRef(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  // Draft state - only commits when dropdown closes
  const [draftItems, setDraftItems] = useState<string[]>(
    selectedItems[filterId] || [],
  );

  // Use ref to track latest draft without triggering effects
  const draftItemsRef = useRef<string[]>(draftItems);
  useEffect(() => {
    draftItemsRef.current = draftItems;
  }, [draftItems]);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { aggregations, isLoading, error } = useAggregations(
    filterId,
    debouncedSearch || undefined,
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

  // Commit draft when menu closes/unmounts
  const handleClose = useCallback(() => {
    commitDraft(filterId, draftItemsRef.current);
    setOpenId("");
  }, [commitDraft, filterId, setOpenId]);

  // Commit draft on unmount only (not on every draftItems change)
  useEffect(() => {
    return () => {
      commitDraft(filterId, draftItemsRef.current);
    };
  }, [commitDraft, filterId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerElement?.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose, triggerElement]);

  const handleItemToggle = useCallback((itemLabel: string) => {
    if (listRef.current) {
      scrollPositionRef.current = listRef.current.scrollTop;
    }
    setDraftItems((prev) => {
      const isSelected = prev.includes(itemLabel);
      return isSelected
        ? prev.filter((label) => label !== itemLabel)
        : [...prev, itemLabel];
    });
  }, []);

  const handleClearDraft = useCallback(() => {
    setDraftItems([]);
  }, []);

  const items = aggregations?.data || [];
  const hasSelection = draftItems.length > 0;

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
                checked={draftItems.includes(item.label)}
                onChange={() => handleItemToggle(item.label)}
              />
            </li>
          ))
        )}
      </ul>

      {hasSelection && (
        <div className="p-2 border-t border-stone-200 bg-gray-50 text-xs font-medium rounded-b-lg flex items-center justify-between">
          <span className="text-stone-700">{draftItems.length} selected</span>
          <button
            onClick={handleClearDraft}
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
