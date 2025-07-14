import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, {
      message: "password must be at least 6 characters",
    })
    .max(30),
  confirm_password: z
    .string()
    .min(6, {
      message: "password must be at least 6 characters",
    })
    .max(30),
});

export const PersonalDetailsSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  birth_date: z.date({ message: "Birth date is required" }),
  phone_number: z.string().min(10, "Phone number is required").max(
    10,
    "Phone number is required",
  ),
  dial_code: z.string().min(2, "required"),
});

export type PersonalDetails = z.infer<typeof PersonalDetailsSchema>;

export const AddressSchema = z.object({
  province: z.string().min(2, "Province is required"),
  municipality: z.string().min(2, "Municipality is required"),
  address: z.string().min(2, "Address is required"),
  postal_code: z
    .string()
    .min(4, "Postal code must be exactly 4 digits")
    .max(4, "Postal code must be exactly 4 digits")
    .regex(/^\d{4}$/, "Postal code must contain only numbers"),
});

export type AddressDetails = z.infer<typeof AddressSchema>;

export const CredentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, {
    message: "password must be at least 6 characters",
  }),
});

export const CreateOperatorSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  birth_date: z.date(),
  address: AddressSchema,
});

export type CreateOperator = z.infer<typeof CreateOperatorSchema>;
