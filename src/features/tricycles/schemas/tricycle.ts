import { z } from 'zod';

export const TricycleInfoSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Year is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  registration_expiry: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Registration expiry is required',
    }),
  body_number: z.string().min(1, 'Body number is required'),
  seating_capacity: z
    .string({ invalid_type_error: 'Seating capacity is required' })
    .min(1, 'Must be at least 1'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
});

export type TricycleDetails = z.infer<typeof TricycleInfoSchema>;

export const OperationalInfoSchema = z.object({
  operational_area: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']),
  status_updated_at: z.date().optional(),
  added_by_user_id: z.string().optional(),
});

export const ComplianceSchema = z.object({
  or_number: z.string().min(1, 'Official Receipt is required'),
  cr_number: z.string().min(1, 'Certificate of Registration is required'),
  franchise_number: z.string().min(1, 'Franchise Number is required'),
  franchise_expiry: z.date(),
});

export type ComplianceDetails = z.infer<typeof ComplianceSchema>;

export const MaintenanceSchema = z.object({
  last_maintenance_date: z.date().optional(),
  maintenance_status: z.enum(['ok', 'due', 'critical']).optional(),
  mileage: z.number().optional(),
  accident_history: z.array(z.string()).optional(),
});

export const MediaSchema = z.object({
  documents: z.array(z.string()).optional(), // Or replace with DocumentSchema
  images: z.array(z.string()).optional(),
});

export const TricycleDetailsSchema = TricycleInfoSchema.merge(
  OperationalInfoSchema
)
  .merge(ComplianceSchema)
  .merge(MaintenanceSchema)
  .merge(MediaSchema);

export type Tricycle = z.infer<typeof TricycleDetailsSchema> & {
  id: string;
  operator_id?: string;
};
