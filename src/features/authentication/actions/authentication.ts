"use server";

import { createLog, uploadDocument } from "@/db/db";
import {
  CredentialsSchema,
  UserSchema,
} from "@/features/authentication/schemas/authentication";
import { AttachmentDetails, Operator } from "@/lib/types";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { AccountSetupFormData } from "../components/create-operator-provider";
import { createOperator } from "../db/authentication";
import { getErrorMessage } from "@/lib/utils";

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
) => {
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error || !data) {
    throw new Error(error?.message || "Unable to sign in to account");
  }

  return { data };
};

export const registerWithCredentials = async (
  User: unknown,
) => {
  const result = UserSchema.safeParse(User);
  if (!result.success) {
    let errorMessage = "";
    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });
    throw new Error(errorMessage);
  }

  if (result.data.password !== result.data.confirm_password) {
    throw new Error("Password does not match.");
  }

  const supabase = await createClient();
  const { data, error: signUpError } = await supabase.auth.signUp({
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
    throw new Error(signUpError.message);
  }

  return { data };
};

export async function createNewOperator(
  operatorFormData: AccountSetupFormData,
): Promise<{ data: Operator }> {
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
      coop_name: personalDetails.coop_name,
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
      throw new Error(error?.message || "Unable to create new operator");
    }

    const logData = {
      data: operatorData,
      operator_id: user.id,
      log_event: "create_operator_account",
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      throw new Error(logError.message || "Unable to log create operator");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { is_new_user: false },
    });

    if (updateError) {
      throw new Error(
        updateError.message || "Unable to update operator metadata",
      );
    }

    return { data: operator };
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export const uploadOperatorDocument = async (
  attachmentDetails: AttachmentDetails,
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const results = await uploadDocument(
    attachmentDetails,
    "documents",
    "documents",
  );

  const logData = {
    data: { results },
    operator_id: user.id,
    log_event: "operator_documents",
  };

  const { error: logError } = await createLog(logData);
  if (logError) {
    throw new Error(
      logError.message || "unable to create log for update document",
    );
  }
};
