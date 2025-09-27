import { createClient } from "@/supabase/server";
import { CreateOperator } from "../schemas/authentication";

export const createOperator = async (
  operatorData: CreateOperator,
  id: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("operators")
    .update([operatorData])
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};
