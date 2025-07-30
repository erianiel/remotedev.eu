import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/apiJobs";

export function useJobs() {
  const {
    isLoading,
    data: jobs,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
    retry: false,
  });

  return { isLoading, jobs, error };
}
