import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FilterMenuType } from "../types";
import { useAggregations } from "../hooks/useAggregations";
import SearchBar from "../ui/SearchBar";
import Checkbox from "../ui/Checkbox";

type FacetType = {
  children: React.ReactNode;
};

type OpenType = {
  children: React.ReactElement<{
    onClick?: () => void;
    isOpenMenu?: boolean;
  }>;
  opens?: string;
};

type FacetContextType = {
  openName: string;
  toggle: (name: string) => void;
  close: () => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
};

const FacetContext = createContext<FacetContextType | undefined>(undefined);

function Facet({ children }: FacetType) {
  const [openName, setOpenName] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpenName("");
  const toggle = (name: string) => {
    if (openName === name) {
      close();
    } else {
      setOpenName(name);
    }
  };

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(t)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openName]);

  return (
    <FacetContext.Provider value={{ openName, toggle, close, wrapperRef }}>
      <div ref={wrapperRef} className="relative">
        {children}
      </div>
    </FacetContext.Provider>
  );
}

function Open({ children, opens: opensMenuName }: OpenType) {
  const ctx = useContext(FacetContext);
  if (!ctx) throw new Error("Facet.Open must be used within <Facet>");
  const { openName, toggle } = ctx;

  const isOpen = openName === (opensMenuName ?? "");
  const originalOnClick = children.props.onClick;

  const handleClick = () => {
    if (originalOnClick) originalOnClick();
    toggle(opensMenuName ?? "");
  };

  return cloneElement(children, {
    onClick: handleClick,
    isOpenMenu: isOpen,
  });
}

function Menu({ filter }: FilterMenuType) {
  const ctx = useContext(FacetContext);
  if (!ctx) throw new Error("Facet.Menu must be used within <Facet>");
  const { openName } = ctx;

  const isOpen = filter === openName;
  const [search, setSearch] = useState("");
  const { aggregations, isLoading } = useAggregations(
    filter,
    search || undefined,
    isOpen,
  );

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full mt-2 z-50 w-full rounded-lg overflow-hidden border border-stone-400 bg-stone-50 shadow-md"
      role="menu"
    >
      <div className="p-2 border-b border-b-stone-200">
        <SearchBar onChange={setSearch} className="w-full text-xs" />
      </div>
      <ul className="list-none max-h-64 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {!isLoading &&
          aggregations?.data?.map((item: { id: string; label: string }) => (
            <li key={item.id} className="bg-stone-50 hover:bg-amber-50">
              <Checkbox label={item.label} />
            </li>
          ))}
      </ul>
    </div>
  );
}

Facet.Open = Open;
Facet.Menu = Menu;

export default Facet;
