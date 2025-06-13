"use server"

import { Operator } from "@/lib/types";
import { createClient } from "@/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

export const createOperator = async (
  operatorData: Operator, id: string
): Promise<{ data: Operator; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('operators')
    .update([operatorData])
    .eq('id', id)
    .select()
    .single();

  console.log(error);

  return { data, error };
};
