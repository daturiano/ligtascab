import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z
    .string()
    .startsWith("+63", { message: "phone number must start with +63" })
    .min(13)
    .max(13),
  password: z
    .string()
    .min(6, {
      message: "password must be at least 6 characters",
    })
    .max(30),
  // confirm_password: z
  //   .string()
  //   .min(6, {
  //     message: "password must be at least 6 characters",
  //   })
  //   .max(30),
});
