import supabase from "./supabase";

const JOBS_PER_PAGE = 10;

export async function getJobs(page: number = 1) {
  const from = (page - 1) * JOBS_PER_PAGE;
  const to = from + JOBS_PER_PAGE - 1;

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
