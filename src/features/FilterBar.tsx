import Facet from "./Facet";
import FilterButton from "./FilterButton";

const filters = [
  { key: "country", label: "Country" },
  { key: "company", label: "Company" },
];

function FilterBar() {
  return (
    <div className="self-end flex gap-2">
      {filters.map(({ key, label }) => (
        <Facet key={key}>
          <Facet.Open opens={key}>
            <FilterButton>{label}</FilterButton>
          </Facet.Open>
          <Facet.Menu filter={key} />
        </Facet>
      ))}
    </div>
  );
}

export default FilterBar;
