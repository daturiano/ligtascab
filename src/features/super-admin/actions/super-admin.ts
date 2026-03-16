"use server";

import supabaseAdmin from "@/supabase/admin";
import { createClient } from "@/supabase/server";
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
} from "../db/super-admin";
import {
  UpdateOperatorSchema,
  UpdateDriverSchema,
  UpdateTricycleSchema,
} from "../schemas/super-admin";

async function verifySuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "super_admin") {
    throw new Error("Unauthorized: Super admin access required");
  }

  return user;
}

export async function getDashboardStatsAction() {
  await verifySuperAdmin();
  return getDashboardStats();
}

export async function getAllOperatorsAction() {
  await verifySuperAdmin();
  return getAllOperators();
}

export async function getAllDriversAction() {
  await verifySuperAdmin();
  return getAllDrivers();
}

export async function getAllTricyclesAction() {
  await verifySuperAdmin();
  return getAllTricycles();
}

export async function getSystemLogsAction(limit: number = 100) {
  await verifySuperAdmin();
  return getSystemLogs(limit);
}

export async function getAuthorityUsersAction() {
  await verifySuperAdmin();

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return { data: null, error };
  }

  const authorityUsers = data.users.filter(
    (user) => user.user_metadata?.role === "authority"
  );

  return { data: authorityUsers, error: null };
}

export async function getOperatorByIdAction(id: string) {
  await verifySuperAdmin();
  return getOperatorById(id);
}

export async function getDriverByIdAction(id: string) {
  await verifySuperAdmin();
  return getDriverById(id);
}

export async function getTricycleByIdAction(id: string) {
  await verifySuperAdmin();
  return getTricycleById(id);
}

export async function updateOperatorAction(data: unknown) {
  await verifySuperAdmin();

  const result = UpdateOperatorSchema.safeParse(data);
  if (!result.success) {
    return { data: null, error: { message: result.error.message } };
  }

  const { id, ...updateData } = result.data;

  const { data: operator, error } = await supabaseAdmin
    .from("operators")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (!error) {
    revalidatePath("/super-admin/dashboard");
    revalidatePath(`/super-admin/operators/${id}`);
  }

  return { data: operator, error };
}

export async function updateDriverAction(data: unknown) {
  await verifySuperAdmin();

  const result = UpdateDriverSchema.safeParse(data);
  if (!result.success) {
    return { data: null, error: { message: result.error.message } };
  }

  const { id, ...updateData } = result.data;

  const { data: driver, error } = await supabaseAdmin
    .from("drivers")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (!error) {
    revalidatePath("/super-admin/dashboard");
    revalidatePath(`/super-admin/drivers/${id}`);
  }

  return { data: driver, error };
}

export async function updateTricycleAction(data: unknown) {
  await verifySuperAdmin();

  const result = UpdateTricycleSchema.safeParse(data);
  if (!result.success) {
    return { data: null, error: { message: result.error.message } };
  }

  const { id, ...updateData } = result.data;

  const { data: tricycle, error } = await supabaseAdmin
    .from("tricycles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (!error) {
    revalidatePath("/super-admin/dashboard");
    revalidatePath(`/super-admin/tricycles/${id}`);
  }

  return { data: tricycle, error };
}

export async function deleteOperatorAction(id: string) {
  await verifySuperAdmin();

  // Delete from operators table
  const { error: operatorError } = await supabaseAdmin
    .from("operators")
    .delete()
    .eq("id", id);

  if (operatorError) {
    return { error: operatorError };
  }

  // Delete auth user
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    return { error: authError };
  }

  revalidatePath("/super-admin/dashboard");
  return { error: null };
}

export async function deleteDriverAction(id: string, userId?: string) {
  await verifySuperAdmin();

  // Delete from drivers table
  const { error: driverError } = await supabaseAdmin
    .from("drivers")
    .delete()
    .eq("id", id);

  if (driverError) {
    return { error: driverError };
  }

  // Delete auth user if user_id exists
  if (userId) {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );
    if (authError) {
      return { error: authError };
    }
  }

  revalidatePath("/super-admin/dashboard");
  return { error: null };
}

export async function deleteTricycleAction(id: string) {
  await verifySuperAdmin();

  const { error } = await supabaseAdmin
    .from("tricycles")
    .delete()
    .eq("id", id);

  if (!error) {
    revalidatePath("/super-admin/dashboard");
  }

  return { error };
}
