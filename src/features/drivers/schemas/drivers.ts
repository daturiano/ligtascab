import { z } from 'zod';

export const DriverInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  birth_date: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Date of birth is required',
    }),
  phone_number: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .max(11, 'Contact number must not exceed 11 digits'), // typical PH numbers
  address: z.string().min(1, 'Address is required'),
  emergency_contact_name: z
    .string()
    .min(1, 'Emergency contact name is required'),
  emergency_contact_number: z
    .string()
    .min(10, 'Emergency contact number must be at least 10 digits')
    .max(11, 'Emergency contact number must not exceed 11 digits'),
});

export type DriverDetails = z.infer<typeof DriverInfoSchema>;

export const DriverComplianceSchema = z.object({
  license_number: z.string().min(1, 'License number is required'),
  license_expiration: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'License expiration date is required',
    }),
});

export type DriverComplianceDetails = z.infer<typeof DriverComplianceSchema>;

export const DriverSchema = DriverInfoSchema.merge(
  DriverComplianceSchema
).extend({
  id: z.string(),
  operator_id: z.string(),
  status: z.enum(['active', 'inactive']).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Driver = z.infer<typeof DriverSchema>;
