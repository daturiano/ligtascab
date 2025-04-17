import { z } from 'zod';

export const TricycleInfoSchema = z.object({
  plate_number: z.string(),
  registration_number: z.string(),
  registration_expiry: z.date(),
  model: z.string(),
  year: z.string(),
  body_number: z.string().optional(),
  seating_capacity: z.string().optional(),
  fuel_type: z.string().optional(),
});
