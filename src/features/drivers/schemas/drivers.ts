import { z } from 'zod';

export const DriverInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Date of birth is required',
    }),
  contact_number: z
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

export const DriverComplianceoSchema = z.object({
  license_number: z.string().min(1, 'License number is required'),
  license_expiration: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: 'License expiration date is required',
    }),
});

export type DriverComplianceDetails = z.infer<typeof DriverComplianceoSchema>;

export type Driver = {
  id?: string;
  operator_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
  created_at?: Date;
  updated_at?: Date;
};
