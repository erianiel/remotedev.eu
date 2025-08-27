import Facet from "./Facet";
import FilterButton from "./FilterButton";

function FilterBar() {
  return (
    <div className="self-end flex gap-2">
      <Facet>
        <Facet.Open opens="country-filter">
          <FilterButton>Country</FilterButton>
        </Facet.Open>
        <Facet.Menu name="country-filter" />

        <Facet.Open opens="company-filter">
          <FilterButton>Company</FilterButton>
        </Facet.Open>
        <Facet.Menu name="company-filter" />

        <Facet.Open opens="title-filter">
          <FilterButton>Title</FilterButton>
        </Facet.Open>
        <Facet.Menu name="title-filter" />
      </Facet>
    </div>
  );
}

export default FilterBar;
