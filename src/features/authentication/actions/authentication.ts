"use server";

import { UserSchema } from "@/features/authentication/schemas/authentication";
import { createClient } from "@/supabase/server";

export async function registerUser(User: unknown) {
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

  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    phone: result.data.phone_number,
    password: result.data.password,
    options: {
      data: {
        is_verified: false,
        is_new_user: true,
      },
    },
  });
  if (signUpError) {
    console.log(signUpError);
    return { error: signUpError.message };
  }

  return { message: "Account created sucessfully" };
}
