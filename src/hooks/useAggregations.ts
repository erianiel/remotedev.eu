import { useQuery } from "@tanstack/react-query";
import { getAggregations } from "../services/apiJobs";

export function useAggregations(filter: string, q?: string) {
  const {
    isLoading,
    data: aggregations,
    error,
    refetch,
  } = useQuery({
    queryKey: ["aggregations", filter, q],
    queryFn: () => getAggregations({ filter, q }),
    enabled: false,
  });

  return { isLoading, aggregations, error, refetch };
}
