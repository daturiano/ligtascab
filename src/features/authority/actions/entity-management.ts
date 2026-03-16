"use server";

import supabaseAdmin from "@/supabase/admin";
import { createClient } from "@/supabase/server";
import { createLog } from "@/db/db";
import { revalidatePath } from "next/cache";
import {
  getDashboardStats,
  getAllOperators,
  getAllDrivers,
  getAllTricycles,
  getSystemLogs,
  getOperatorById,
  getDriverById,
  getTricycleById,
} from "@/features/super-admin/db/super-admin";

async function verifyAuthority() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "authority") {
    throw new Error("Unauthorized: Authority access required");
  }

  return user;
}

// Read actions - authority can view all data
export async function getDashboardStatsAction() {
  await verifyAuthority();
  return getDashboardStats();
}

export async function getAllOperatorsAction() {
  await verifyAuthority();
  return getAllOperators();
}

export async function getAllDriversAction() {
  await verifyAuthority();
  return getAllDrivers();
}

export async function getAllTricyclesAction() {
  await verifyAuthority();
  return getAllTricycles();
}

export async function getSystemLogsAction(limit: number = 100) {
  await verifyAuthority();
  return getSystemLogs(limit);
}

export async function getOperatorByIdAction(id: string) {
  await verifyAuthority();
  return getOperatorById(id);
}

export async function getDriverByIdAction(id: string) {
  await verifyAuthority();
  return getDriverById(id);
}

export async function getTricycleByIdAction(id: string) {
  await verifyAuthority();
  return getTricycleById(id);
}

// Suspend/unsuspend actions - authority can suspend but NOT delete
export async function suspendUserAction(data: { userId: string; reason?: string }) {
  const authorityUser = await verifyAuthority();

  const { userId, reason } = data;

  // Ban user in auth (100 years = effectively permanent)
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      ban_duration: "876600h",
    }
  );

  if (authError) {
    return { error: authError };
  }

  // Try to update operators table
  const { error: operatorError } = await supabaseAdmin
    .from("operators")
    .update({ status: "suspended" })
    .eq("id", userId);

  // If not an operator, try drivers table (using user_id)
  if (operatorError) {
    await supabaseAdmin
      .from("drivers")
      .update({ status: "suspended" })
      .eq("user_id", userId);
  }

  await createLog({
    data: { user_id: userId, reason, action: "suspend", suspended_by: "authority" },
    operator_id: authorityUser.id,
    log_event: "authority_suspend_user",
  });

  revalidatePath("/authority/dashboard");
  return { error: null };
}

export async function unsuspendUserAction(userId: string) {
  const authorityUser = await verifyAuthority();

  // Remove ban
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      ban_duration: "none",
    }
  );

  if (authError) {
    return { error: authError };
  }

  // Try to update operators table
  const { error: operatorError } = await supabaseAdmin
    .from("operators")
    .update({ status: "active" })
    .eq("id", userId);

  // If not an operator, try drivers table
  if (operatorError) {
    await supabaseAdmin
      .from("drivers")
      .update({ status: "active" })
      .eq("user_id", userId);
  }

  await createLog({
    data: { user_id: userId, action: "unsuspend", unsuspended_by: "authority" },
    operator_id: authorityUser.id,
    log_event: "authority_unsuspend_user",
  });

  revalidatePath("/authority/dashboard");
  return { error: null };
}

// Tricycle status change action
export async function updateTricycleStatusAction(tricycleId: string, status: string) {
  const authorityUser = await verifyAuthority();

  const { data: tricycle, error } = await supabaseAdmin
    .from("tricycles")
    .update({ status })
    .eq("id", tricycleId)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  await createLog({
    data: { tricycle_id: tricycleId, status, updated_by: "authority" },
    operator_id: authorityUser.id,
    log_event: "authority_update_tricycle_status",
  });

  revalidatePath("/authority/dashboard");
  revalidatePath(`/authority/tricycles/${tricycleId}`);
  return { data: tricycle, error: null };
}
