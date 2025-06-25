import { z } from 'zod';

export const TricycleInfoSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Year is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  registration_expiration: z
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

export const TricycleRegistrationSchema = z.object({
  registration_number: z.string().min(1, 'Registration number is required'),
  registration_expiration: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Registration expiry is required',
    }),
});

export type TricycleRegistrationDetails = z.infer<
  typeof TricycleRegistrationSchema
>;

export const ComplianceSchema = z.object({
  plate_number: z.string().min(1, 'Plate number is required'),
  or_number: z.string().min(1, 'Official Receipt is required'),
  cr_number: z.string().min(1, 'Certificate of Registration is required'),
  franchise_number: z.string().min(1, 'Franchise Number is required'),
  franchise_expiration: z
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

export const TricycleReceiptSchema = z.object({
  or_number: z.string().min(1, 'Official receipt number is required'),
});

export const TricycleSchema = z.object({
  id: z.string(),
  operator_id: z.string(),
  tricycle_details: z.object({
    model: z.string(),
    year: z.string(),
    seating_capacity: z.string(),
    body_number: z.string(),
    fuel_type: z.string(),
    mileage: z.string(),
    maintenance_status: z.string(),
  }),
  compliance_details: z.object({
    registration_number: z.string(),
    franchise_number: z.string(),
    or_number: z.string(),
    cr_number: z.string(),
  }),
  status: z.string().optional(),
  plate_number: z.string(),
  registration_expiration: z.date(),
  franchise_expiration: z.date(),
  last_maintenance_date: z.date(),
  image: z.string().optional(),
});

export const TricycleUpdateSchema = z.object({
  operator_id: z.string().optional(),
  tricycle_details: z
    .object({
      model: z.string().optional(),
      year: z.string().optional(),
      seating_capacity: z.string().optional(),
      body_number: z.string().optional(),
      fuel_type: z.string().optional(),
      mileage: z.string().optional(),
      maintenance_status: z.string().optional(),
    })
    .optional(),
  compliance_details: z
    .object({
      registration_number: z.string().optional(),
      franchise_number: z.string().optional(),
      or_number: z.string().optional(),
      cr_number: z.string().optional(),
    })
    .optional(),
  status: z.string().optional(),
  plate_number: z.string().optional(),
  registration_expiration: z.date().optional(),
  franchise_expiration: z.date().optional(),
  last_maintenance_date: z.date().optional(),
  image: z.string().optional(),
});

export type TricycleUpdate = z.infer<typeof TricycleUpdateSchema>;
