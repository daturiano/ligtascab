import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, {
      message: 'password must be at least 6 characters',
    })
    .max(30),
  confirm_password: z
    .string()
    .min(6, {
      message: 'password must be at least 6 characters',
    })
    .max(30),
});

export const PersonalDetailsSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  birth_date: z.date(),
  phone_number: z.string().min(10).max(10),
  dial_code: z.string(),
});

export const AddressSchema = z.object({
  province: z.string(),
  municipality: z.string(),
  address: z.string(),
  postal_code: z
    .string()
    .min(4, 'Postal code must be exactly 4 digits')
    .max(4, 'Postal code must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Postal code must contain only numbers'),
});

export const CredentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, {
    message: 'password must be at least 6 characters',
  }),
});
