import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/apiJobs";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export function useJobs(
  pagination: PaginationState,
  sorting: SortingState,
  filters: Record<string, string[]>,
) {
  const {
    isLoading,
    data: jobs,
    error,
  } = useQuery({
    queryKey: ["jobs", pagination, sorting, filters],
    queryFn: ({ signal }) => getJobs({ pagination, sorting, filters, signal }),
    placeholderData: keepPreviousData,
  });

  return { isLoading, jobs, error };
}
