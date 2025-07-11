"use server";

import { createLog, uploadDocument } from "@/db/db";
import {
  CredentialsSchema,
  UserSchema,
} from "@/features/authentication/schemas/authentication";
import { AttachmentDetails } from "@/lib/types";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { AccountSetupFormData } from "../components/create-operator-provider";
import { createOperator } from "../db/authentication";

type AuthResponse = { error?: string; message?: string };

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};

export const signInWithCredentials = async (
  User: unknown,
): Promise<AuthResponse> => {
  const result = CredentialsSchema.safeParse(User);

  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMessage,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    console.error("Authentication Error:", error.message);
    return { error: error.message };
  }

  return { message: "Log in successful" };
};

export const registerWithCredentials = async (
  User: unknown,
): Promise<AuthResponse> => {
  const result = UserSchema.safeParse(User);
  if (!result.success) {
    let errorMessage = "";
    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });
    return {
      error: errorMessage,
    };
  }

  if (result.data.password !== result.data.confirm_password) {
    return { error: "Password does not match." };
  }

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        is_new_user: true,
        role: "operator",
      },
    },
  });

  if (signUpError) {
    console.error("Supabase signUp error:", signUpError);
    return { error: signUpError.message };
  }

  return { message: "Sign up successful" };
};

export async function createNewOperator(
  operatorFormData: AccountSetupFormData,
) {
  try {
    const { personalDetails, addressDetails } = operatorFormData as {
      personalDetails: NonNullable<typeof operatorFormData.personalDetails>;
      addressDetails: NonNullable<typeof operatorFormData.addressDetails>;
    };

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const operatorData = {
      first_name: personalDetails.first_name,
      last_name: personalDetails.last_name,
      phone_number: personalDetails.dial_code + personalDetails.phone_number,
      birth_date: personalDetails.birth_date,
      address: {
        address: addressDetails.address,
        province: addressDetails.province,
        postal_code: addressDetails.postal_code,
        municipality: addressDetails.municipality,
      },
    };

    const { data: operator, error } = await createOperator(
      operatorData,
      user.id,
    );

    if (error || !operator) {
      return { success: false, error: error };
    }

    const logData = {
      data: operatorData,
      operator_id: user.id,
      log_event: "create_operator_account",
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      return { success: false, error: "Failed to log event." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { is_new_user: false },
    });

    if (updateError) {
      return { success: false, error: "Failed to update user metadata." };
    }

    return { success: true, data: operator };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Creating new operator error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred.",
    };
  }
}

export const uploadOperatorDocument = async (
  operator_id: string,
  attachmentDetails: AttachmentDetails,
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  console.log("Starting document upload for operator:", operator_id);
  console.log("Attachment details:", attachmentDetails);

  try {
    const results = await uploadDocument(
      attachmentDetails,
      "documents",
      "documents",
    );

    console.log("Upload results:", results);

    const logData = {
      data: { results },
      operator_id: user.id,
      log_event: "operator_documents",
    };

    const { error: logError } = await createLog(logData);
    if (logError) {
      console.error("Failed to create audit log:", logError);
      return { success: false, error: "Failed to create audit log." };
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, error: "Failed to upload documents." };
  }
};
