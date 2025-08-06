import type { PaginationState } from "@tanstack/react-table";
import supabase from "./supabase";

export async function getJobs(options: PaginationState) {
  const from = options.pageIndex * options.pageSize;
  const to = from + options.pageSize;

  const { data, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
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
