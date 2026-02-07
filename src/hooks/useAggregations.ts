import { useQuery } from "@tanstack/react-query";
import { getAggregations } from "../services/apiJobs";

export function useAggregations(
  filter: string,
  q?: string,
  enabled = false,
) {
  const {
    isLoading,
    data: aggregations,
    error,
  } = useQuery({
    queryKey: ["aggregations", filter, q],
    queryFn: () => getAggregations({ filter, q }),
    enabled,
  });

  return { isLoading, aggregations, error };
}
