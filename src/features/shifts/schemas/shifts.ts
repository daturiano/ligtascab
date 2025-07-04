import { z } from "zod";

export const ShiftSchema = z.object({
  driver_name: z.string(),
  plate_number: z.string(),
  shift_type: z.string(),
  operator_id: z.string(),
  driver_id: z.string(),
  tricycle_id: z.string(),
  revenue_collected: z.string().optional(),
  shift_description: z.string().optional(),
});
