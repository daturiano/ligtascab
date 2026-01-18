"use server";

import supabaseAdmin from "@/supabase/admin";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getPendingRequestById,
  getPendingRequests,
} from "../db/authority";

export const getReportsAction = async () => {
  const { data, error } = await supabaseAdmin
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

  if (error) throw new Error(error.message);
  return data;
};

export const updateReportStatusAction = async (id: string, status: string) => {
  const { error } = await supabaseAdmin
    .from("reports")
    .update({ report_status: status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/authority/dashboard");
};

export const getPendingRequestsAction = async () => {
  const { data, error } = await getPendingRequests();
  if (error) throw new Error(error.message);
  return data;
};

export const getPendingRequestByIdAction = async (id: string) => {
  const { data, error } = await getPendingRequestById(id);
  return { data, error };
};

export const approveRequestAction = async (
  requestId: string,
  operatorId: string,
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Use supabaseAdmin to bypass RLS for updates
  const { error: requestError } = await supabaseAdmin
    .from("pending_requests")
    .update({
      status: "approved",
      admin_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (requestError) throw new Error(requestError.message);

  const { error: operatorError } = await supabaseAdmin
    .from("operators")
    .update({ status: "active" })
    .eq("id", operatorId);

  if (operatorError) throw new Error(operatorError.message);

  revalidatePath("/authority/dashboard");
};

export const rejectRequestAction = async (
  requestId: string,
  operatorId: string,
  reason: string,
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Use supabaseAdmin to bypass RLS for updates
  const { error: requestError } = await supabaseAdmin
    .from("pending_requests")
    .update({
      status: "rejected",
      admin_id: user.id,
      reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (requestError) throw new Error(requestError.message);

  const { error: operatorError } = await supabaseAdmin
    .from("operators")
    .update({ status: "rejected" })
    .eq("id", operatorId);

  if (operatorError) throw new Error(operatorError.message);

  revalidatePath("/authority/dashboard");
};
