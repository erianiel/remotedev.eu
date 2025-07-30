import supabase from "./supabase";

export async function getJobs() {
  const { data, error } = await supabase.from("jobs").select().limit(10);

  if (error) {
    console.error("Error fetching job:", error);
    throw error;
  }

  return data;
}
