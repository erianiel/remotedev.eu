import { useAggregations } from "../hooks/useAggregations";
import Facet from "./Facet";
import FilterButton from "./FilterButton";

function FilterBar() {
  const {
    aggregations: countryData,
    isLoading: countryLoading,
    refetch: refetchCountry,
  } = useAggregations("country");
  const {
    aggregations: companyData,
    isLoading: companyLoading,
    refetch: refetchCompany,
  } = useAggregations("company");

  return (
    <div className="self-end flex gap-2">
      <Facet>
        <Facet.Open opens="country-filter">
          <FilterButton onClick={() => refetchCountry()}>Country</FilterButton>
        </Facet.Open>
        <Facet.Menu
          isLoading={countryLoading}
          items={countryData?.data}
          name="country-filter"
        />
      </Facet>

      <Facet>
        <Facet.Open opens="company-filter">
          <FilterButton onClick={() => refetchCompany()}>Company</FilterButton>
        </Facet.Open>
        <Facet.Menu
          isLoading={companyLoading}
          items={companyData?.data}
          name="company-filter"
        />
      </Facet>
    </div>
  );
}

export default FilterBar;
