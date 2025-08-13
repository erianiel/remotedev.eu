import type { PaginationState, SortingState } from "@tanstack/react-table";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

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

  const baseUrl = new URL(`${SUPABASE_URL}/functions/v1/jobs`);
  baseUrl.searchParams.set("page", String(page));
  baseUrl.searchParams.set("pageSize", String(pageSize));
  baseUrl.searchParams.set("sort", sort);

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}
