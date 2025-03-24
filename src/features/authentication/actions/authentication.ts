"use server";

import {
  CredentialsSchema,
  UserSchema,
} from "@/features/authentication/schemas/authentication";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

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
};

export const signInWithCredentials = async (
  User: unknown
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
  User: unknown
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

  console.log("Attempting to register with email:", result.data.email);

  const supabase = await createClient();
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        is_new_user: true,
      },
    },
  });

  console.log("Supabase signUp response:", data);
  if (signUpError) {
    console.error("Supabase signUp error:", signUpError);
    return { error: signUpError.message };
  }

  return { message: "Sign up successful" };
};
