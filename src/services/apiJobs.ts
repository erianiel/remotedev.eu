import type { PaginationState, SortingState } from "@tanstack/react-table";
import supabase from "./supabase";

export async function getJobs(options: {
  pagination: PaginationState;
  sorting: SortingState;
}) {
  const from = options.pagination.pageIndex * options.pagination.pageSize;
  const to = from + options.pagination.pageSize - 1;

  const { data, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .order("created_at", {
      ascending: options.sorting[0]?.desc === false,
    })
    .range(from, to);

  if (error) {
    console.error("Error fetching job:", error);
    throw error;
  }

  return data;
}

export async function getJobsCount() {
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching job count:", error);
    throw error;
  }

  return count;
}
