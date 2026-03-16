import { z } from "zod";

/**
 * Driver CSV Row Schema
 * Validates flat CSV input before database insertion
 */
export const DriverCSVRowSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  birth_date: z.date({
    required_error: "Birth date is required",
    invalid_type_error: "Invalid birth date format",
  }),
  address: z.string().min(1, "Address is required"),
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_number: z
    .string()
    .min(10, "Emergency contact number must be at least 10 digits")
    .max(11, "Emergency contact number must not exceed 11 digits"),
  license_number: z.string().min(1, "License number is required"),
  license_expiration: z.date({
    required_error: "License expiration is required",
    invalid_type_error: "Invalid license expiration format",
  }),
  phone_number: z
    .string()
    .min(13, "Phone number must be in +63 format (13 characters)")
    .max(13, "Phone number must be in +63 format (13 characters)"),
});

export type DriverCSVRow = z.infer<typeof DriverCSVRowSchema>;

/**
 * Tricycle CSV Row Schema
 * Validates flat CSV input before database insertion
 */
export const TricycleCSVRowSchema = z.object({
  plate_number: z.string().min(1, "Plate number is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  body_number: z.string().min(1, "Body number is required"),
  seating_capacity: z.string().min(1, "Seating capacity is required"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  mileage: z.string().min(1, "Mileage is required"),
  maintenance_status: z.enum(["ok", "due", "critical"], {
    errorMap: () => ({ message: "Status must be 'ok', 'due', or 'critical'" }),
  }),
  registration_number: z.string().min(1, "Registration number is required"),
  or_number: z.string().min(1, "Official receipt number is required"),
  cr_number: z.string().min(1, "Certificate of registration is required"),
  franchise_number: z.string().min(1, "Franchise number is required"),
  registration_expiration: z.date({
    required_error: "Registration expiration is required",
    invalid_type_error: "Invalid registration expiration format",
  }),
  franchise_expiration: z.date({
    required_error: "Franchise expiration is required",
    invalid_type_error: "Invalid franchise expiration format",
  }),
  last_maintenance_date: z.date({
    required_error: "Last maintenance date is required",
    invalid_type_error: "Invalid maintenance date format",
  }),
});

export type TricycleCSVRow = z.infer<typeof TricycleCSVRowSchema>;

/**
 * Row validation result
 */
export interface RowValidationResult<T> {
  rowIndex: number;
  isValid: boolean;
  isDuplicate: boolean;
  data: T | null;
  errors: string[];
}

/**
 * Parse result containing all rows with their validation status
 */
export interface ParseResult<T> {
  validRows: RowValidationResult<T>[];
  invalidRows: RowValidationResult<T>[];
  duplicates: string[];
  totalRows: number;
}

/**
 * Batch create result
 */
export interface BatchCreateResult<T> {
  successful: T[];
  failed: Array<{ data: T; error: string }>;
  summary: {
    total: number;
    created: number;
    failed: number;
    skipped: number;
  };
}

/**
 * Driver with credentials for download
 */
export interface DriverWithCredentials {
  first_name: string;
  last_name: string;
  phone_number: string;
  temp_password: string;
  license_number: string;
  driver_id: string;
}
