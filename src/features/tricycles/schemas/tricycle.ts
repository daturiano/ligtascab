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

export const ComplianceSchema = z.object({
  plate_number: z.string().min(1, 'Plate number is required'),
  or_number: z.string().min(1, 'Official Receipt is required'),
  cr_number: z.string().min(1, 'Certificate of Registration is required'),
  franchise_number: z.string().min(1, 'Franchise Number is required'),
  franchise_expiry: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Franchise expiry is required',
    }),
});

export type ComplianceDetails = z.infer<typeof ComplianceSchema>;

export const MaintenanceSchema = z.object({
  last_maintenance_date: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Last maintenance daet is required',
    }),
  maintenance_status: z.enum(['ok', 'due', 'critical']),
  mileage: z.string().min(1, 'Estimated mileage is required'),
});

export type MaintenanceDetails = z.infer<typeof MaintenanceSchema>;

export const TricycleDetailsSchema =
  TricycleInfoSchema.merge(ComplianceSchema).merge(MaintenanceSchema);

export type Tricycle = z.infer<typeof TricycleDetailsSchema> & {
  id: string;
  operator_id?: string;
};
