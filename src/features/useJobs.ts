import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/apiJobs";

export function useJobs(page: number = 1) {
  const {
    isLoading,
    data: jobs,
    error,
  } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => getJobs(page),
  });

  return { isLoading, jobs, error };
}
