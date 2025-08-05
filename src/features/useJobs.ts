import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/apiJobs";
import type { PaginationState } from "@tanstack/react-table";

export function useJobs(pagination: PaginationState) {
  const {
    isLoading,
    data: jobs,
    error,
  } = useQuery({
    queryKey: ["jobs", pagination],
    queryFn: () => getJobs(pagination),
    placeholderData: keepPreviousData,
  });

  return { isLoading, jobs, error };
}
