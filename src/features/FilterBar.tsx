import { FacetTrigger } from "./Facet";
import FilterButton from "./FilterButton";

const FILTERS = [
  { key: "country", label: "Country" },
  { key: "company", label: "Company" },
] as const;

export default function FilterBar() {
  return (
    <div className="w-full flex flex-col gap-2 md:w-auto md:flex-row md:self-end">
      {FILTERS.map(({ key, label }) => (
        <FacetTrigger key={key} filterId={key}>
          <FilterButton>{label}</FilterButton>
        </FacetTrigger>
      ))}
    </div>
  );
}
