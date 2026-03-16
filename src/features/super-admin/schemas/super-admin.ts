import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be at most 30 characters"),
  role: z.enum(["operator", "driver", "authority"], {
    required_error: "Role is required",
  }),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const SuspendUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  reason: z.string().min(1, "Reason is required").optional(),
});

export type SuspendUser = z.infer<typeof SuspendUserSchema>;

export const UpdateOperatorSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  phone_number: z.string().optional(),
  coop_name: z.string().optional(),
  status: z.enum(["active", "pending", "suspended", "rejected"]).optional(),
});

export type UpdateOperator = z.infer<typeof UpdateOperatorSchema>;

export const UpdateDriverSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  phone_number: z.string().optional(),
  license_number: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type UpdateDriver = z.infer<typeof UpdateDriverSchema>;

export const UpdateTricycleSchema = z.object({
  id: z.string().uuid(),
  plate_number: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type UpdateTricycle = z.infer<typeof UpdateTricycleSchema>;
