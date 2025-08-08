import { useQuery } from "@tanstack/react-query";
import { getJobsCount } from "../services/apiJobs";

export function useJobsCount() {
  const {
    isLoading,
    data: jobsCount,
    error,
  } = useQuery({
    queryKey: ["jobsCount"],
    queryFn: () => getJobsCount(),
  });

  return { isLoading, jobsCount, error };
}
