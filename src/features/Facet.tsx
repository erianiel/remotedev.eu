import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FilterMenuType } from "../types";
import { createPortal } from "react-dom";
import SearchBar from "../ui/SearchBar";
import Checkbox from "../ui/Checkbox";

type FacetType = {
  children: React.ReactNode;
};

type OpenType = {
  children: React.ReactNode;
  opens?: string;
};

type Anchor = {
  top: number;
  left: number;
  width: number;
  height: number;
} | null;

type FacetContextType = {
  openName: string;
  anchor: Anchor;
  triggerEl: HTMLElement | null;
  close: () => void;
  toggle: (name: string, anchor: Anchor, trigger?: HTMLElement | null) => void;
};

const FacetContext = createContext<FacetContextType | undefined>(undefined);

function Facet({ children }: FacetType) {
  const [openName, setOpenName] = useState("");
  const [anchor, setAnchor] = useState<Anchor>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const close = () => {
    setOpenName("");
    setAnchor(null);
    setTriggerEl(null);
  };

  const toggle = (
    name: string,
    nextAnchor: Anchor,
    trigger?: HTMLElement | null
  ) => {
    setOpenName((prev) => {
      if (prev === name) {
        setAnchor(null);
        setTriggerEl(null);

        return "";
      }

      setAnchor(nextAnchor);
      setTriggerEl(trigger ?? null);

      return name;
    });
  };

  return (
    <FacetContext.Provider
      value={{ openName, anchor, triggerEl, close, toggle }}
    >
      {children}
    </FacetContext.Provider>
  );
}

function Open({ children, opens: opensMenuName }: OpenType) {
  const ctx = useContext(FacetContext);
  if (!ctx) throw new Error("Facet.Open must be used within <Facet>");
  const { openName, toggle } = ctx;

  const isOpen = openName === (opensMenuName ?? "");

  const handleClick = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const anchor = {
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
      height: r.height,
    } as const;
    toggle(opensMenuName ?? "", anchor, el);
  };

  return cloneElement(children as React.ReactElement, {
    onClick: handleClick,
    isOpenMenu: isOpen,
  });
}

function Menu({ items, name }: FilterMenuType) {
  const ctx = useContext(FacetContext);
  if (!ctx) throw new Error("Facet.Menu must be used within <Facet>");
  const { openName, anchor, close, triggerEl } = ctx;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      const menuEl = ref.current;
      if (!menuEl) return;
      const isInsideMenu = menuEl.contains(target);
      const isOnTrigger = triggerEl ? triggerEl.contains(target) : false;
      if (!isInsideMenu && !isOnTrigger) {
        close();
      }
    }

    // use pointerdown so we capture before focus/blur side effects
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [close, triggerEl]);

  if (name !== openName || !anchor) return null;

  const top = anchor.top + anchor.height + 8; // 8px gap
  const left = anchor.left; // align to button's left edge
  const width = anchor.width; // exact same width as button

  return createPortal(
    <div
      className="fixed z-50 rounded-lg border border-stone-400 bg-stone-50 shadow-md"
      style={{ top, left, width }}
      role="menu"
      ref={ref}
    >
      <div className="p-2 border-b border-b-stone-200">
        <SearchBar className="w-full text-xs" />
      </div>
      <ul className="list-none max-h-64 overflow-auto">
        {items?.map((item) => (
          <li key={item.id} className="bg-stone-50 hover:bg-amber-50">
            <Checkbox label={item.label} />
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}

Facet.Open = Open;
Facet.Menu = Menu;

export default Facet;
