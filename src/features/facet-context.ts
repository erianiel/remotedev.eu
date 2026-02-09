import { createContext, useContext } from "react";

export type FacetContextValue = {
  openId: string;
  setOpenId: (id: string) => void;
  selectedItems: Record<string, string[]>;
  toggleItem: (filterId: string, itemId: string) => void;
  clearFilter: (filterId: string) => void;
  commitDraft: (filterId: string, draftItems: string[]) => void;
};

export const FacetContext = createContext<FacetContextValue | undefined>(
  undefined,
);

export const useFacetContext = () => {
  const context = useContext(FacetContext);
  if (!context) {
    throw new Error("Facet components must be used within FacetProvider");
  }
  return context;
};
