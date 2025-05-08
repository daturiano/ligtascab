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

//Schema & type for creating a new driver
export const CreateDriverSchema = DriverInfoSchema.merge(
  DriverComplianceSchema
).extend({
  operator_id: z.string(),
});

export type CreateDriver = z.infer<typeof CreateDriverSchema>;

//Schema & type for updating the driver
export const UpdateDriverSchema = DriverInfoSchema.merge(
  DriverComplianceSchema
).extend({
  id: z.string(),
  updated_at: z.date(),
});

export type UpdateDriver = z.infer<typeof UpdateDriverSchema>;

//Schema & type for existing driver
export const DriverSchema = CreateDriverSchema.extend({
  id: z.string(),
  operator_id: z.string(),
  status: z.enum(['active', 'inactive']),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Driver = z.infer<typeof DriverSchema>;
