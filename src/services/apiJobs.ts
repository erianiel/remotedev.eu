import type { PaginationState, SortingState } from "@tanstack/react-table";

export async function getJobs(options: {
  pagination: PaginationState;
  sorting: SortingState;
  signal: AbortSignal;
}) {
  const page = options.pagination.pageIndex + 1;
  const pageSize = options.pagination.pageSize;
  const sort = options.sorting.length
    ? `${options.sorting[0].id}.${options.sorting[0].desc ? "desc" : "asc"}`
    : "created_at.desc"; // Default sort

  const response = await fetch(
    `https://lsonohvayyootvjagxvw.supabase.co/functions/v1/jobs?page=${page}&pageSize=${pageSize}&sort=${sort}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: options.signal,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}
