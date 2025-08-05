"use server";

import { createClient } from "@/supabase/server";

export const fetchRecentLogs = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 5);

  if (error) {
    console.error("Error searching logs:", error);
    return [];
  }

  return data || [];
};
