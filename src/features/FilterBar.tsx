import { FacetProvider, FacetTrigger } from "./Facet";
import FilterButton from "./FilterButton";

const FILTERS = [
  { key: "country", label: "Country" },
  { key: "company", label: "Company" },
] as const;

export default function FilterBar() {
  return (
    <FacetProvider>
      <div className="self-end flex gap-2">
        {FILTERS.map(({ key, label }) => (
          <FacetTrigger key={key} filterId={key}>
            <FilterButton>{label}</FilterButton>
          </FacetTrigger>
        ))}
      </div>
    </FacetProvider>
  );
}
