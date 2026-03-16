"use server";

import supabaseAdmin from "@/supabase/admin";
import { createClient } from "@/supabase/server";
import { createLog } from "@/db/db";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, SuspendUserSchema } from "../schemas/super-admin";
import { generateTempPassword } from "@/features/batch-upload/utils/password-generator";

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

export async function createUserAction(data: unknown) {
  const adminUser = await verifySuperAdmin();

  const result = CreateUserSchema.safeParse(data);
  if (!result.success) {
    return { data: null, error: { message: result.error.message } };
  }

  const { email, password, role, first_name, last_name } = result.data;

  // Create auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        is_new_user: false,
        role,
      },
    });

  if (authError) {
    return { data: null, error: authError };
  }

  // Create record in appropriate table based on role
  if (role === "operator") {
    const { error: operatorError } = await supabaseAdmin
      .from("operators")
      .insert({
        id: authData.user.id,
        first_name,
        last_name,
        email,
        status: "active",
        address: {
          address: "",
          province: "",
          municipality: "",
          postal_code: "",
        },
        birth_date: new Date().toISOString(),
        phone_number: "",
      });

    if (operatorError) {
      // Rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { data: null, error: operatorError };
    }
  }

  // Create audit log
  await createLog({
    data: { email, role, first_name, last_name, created_by: "super_admin" },
    operator_id: adminUser.id,
    log_event: "super_admin_create_user",
  });

  revalidatePath("/super-admin/dashboard");
  return { data: authData.user, error: null };
}

export async function createAuthorityUserAction(data: {
  email: string;
  password?: string;
}) {
  const adminUser = await verifySuperAdmin();

  const password = data.password || generateTempPassword();

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: {
        is_new_user: false,
        role: "authority",
      },
    });

  if (authError) {
    return { data: null, error: authError, tempPassword: null };
  }

  await createLog({
    data: { email: data.email, role: "authority", created_by: "super_admin" },
    operator_id: adminUser.id,
    log_event: "super_admin_create_authority",
  });

  revalidatePath("/super-admin/dashboard");
  return {
    data: authData.user,
    error: null,
    tempPassword: data.password ? null : password,
  };
}

export async function suspendUserAction(data: unknown) {
  const adminUser = await verifySuperAdmin();

  const result = SuspendUserSchema.safeParse(data);
  if (!result.success) {
    return { error: { message: result.error.message } };
  }

  const { userId, reason } = result.data;

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
    data: { user_id: userId, reason, action: "suspend" },
    operator_id: adminUser.id,
    log_event: "super_admin_suspend_user",
  });

  revalidatePath("/super-admin/dashboard");
  return { error: null };
}

export async function unsuspendUserAction(userId: string) {
  const adminUser = await verifySuperAdmin();

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
    data: { user_id: userId, action: "unsuspend" },
    operator_id: adminUser.id,
    log_event: "super_admin_unsuspend_user",
  });

  revalidatePath("/super-admin/dashboard");
  return { error: null };
}

export async function deleteAuthorityUserAction(userId: string) {
  const adminUser = await verifySuperAdmin();

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );

  if (authError) {
    return { error: authError };
  }

  await createLog({
    data: { user_id: userId, action: "delete_authority" },
    operator_id: adminUser.id,
    log_event: "super_admin_delete_authority",
  });

  revalidatePath("/super-admin/dashboard");
  return { error: null };
}

export async function resetUserPasswordAction(userId: string) {
  await verifySuperAdmin();

  const newPassword = generateTempPassword();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return { error, tempPassword: null };
  }

  revalidatePath("/super-admin/dashboard");
  return { error: null, tempPassword: newPassword };
}
