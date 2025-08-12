import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/apiJobs";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export function useJobs(pagination: PaginationState, sorting: SortingState) {
  const {
    isLoading,
    data: jobs,
    error,
  } = useQuery({
    queryKey: ["jobs", pagination, sorting],
    queryFn: ({ signal }) => getJobs({ pagination, sorting, signal }),
    placeholderData: keepPreviousData,
  });

  return { isLoading, jobs, error };
}
