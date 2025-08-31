import Facet from "./Facet";
import FilterButton from "./FilterButton";

const countryItems = Array.from({ length: 100 }).map((_, i) => ({
  id: `${i}`,
  label: `Item ${i}`,
  value: `${i}`,
}));

function FilterBar() {
  return (
    <div className="self-end flex gap-2">
      <Facet>
        <Facet.Open opens="country-filter">
          <FilterButton>Country</FilterButton>
        </Facet.Open>
        <Facet.Menu items={countryItems} name="country-filter" />
      </Facet>

      <Facet>
        <Facet.Open opens="company-filter">
          <FilterButton>Company</FilterButton>
        </Facet.Open>
        <Facet.Menu name="company-filter" />
      </Facet>
    </div>
  );
}

export default FilterBar;
