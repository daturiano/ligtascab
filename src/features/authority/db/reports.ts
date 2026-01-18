import { createClient } from "@/supabase/server";

export const getReports = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(`
      *,
      commuters (
        first_name,
        last_name,
        email,
        phone_number
      )
    `)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const updateReportStatus = async (id: string, status: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .update({ report_status: status })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};
