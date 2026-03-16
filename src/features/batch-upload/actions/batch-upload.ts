"use server";

import { createClient } from "@/supabase/server";
import supabaseAdmin from "@/supabase/admin";
import { createLog } from "@/db/db";
import { generateTempPassword } from "../utils/password-generator";
import {
  DriverCSVRow,
  TricycleCSVRow,
  BatchCreateResult,
  DriverWithCredentials,
} from "../schemas/batch-upload";
import { CreateDriver } from "@/features/drivers/schemas/drivers";
import { CreateTricycle } from "@/features/tricycles/schemas/tricycle";

/**
 * Check for existing drivers by license numbers
 * Returns array of license numbers that already exist
 */
export async function checkExistingDrivers(
  licenseNumbers: string[]
): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("drivers")
    .select("license_number")
    .in("license_number", licenseNumbers);

  if (error) {
    throw new Error(`Failed to check existing drivers: ${error.message}`);
  }

  return data?.map((d) => d.license_number) ?? [];
}

/**
 * Check for existing tricycles by plate numbers
 * Returns array of plate numbers that already exist
 */
export async function checkExistingTricycles(
  plateNumbers: string[]
): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .select("plate_number")
    .in("plate_number", plateNumbers);

  if (error) {
    throw new Error(`Failed to check existing tricycles: ${error.message}`);
  }

  return data?.map((t) => t.plate_number) ?? [];
}

/**
 * Batch create drivers with auth accounts
 * Creates Supabase auth users and driver records
 */
export async function batchCreateDrivers(
  drivers: DriverCSVRow[]
): Promise<BatchCreateResult<DriverWithCredentials>> {
  const supabase = await createClient();

  // Get authenticated operator
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const successful: DriverWithCredentials[] = [];
  const failed: Array<{ data: DriverWithCredentials; error: string }> = [];

  for (const driver of drivers) {
    const tempPassword = generateTempPassword();

    try {
      // Create auth user with phone
      const { data: authData, error: createUserError } =
        await supabaseAdmin.auth.admin.createUser({
          phone: driver.phone_number,
          password: tempPassword,
          phone_confirm: true,
          user_metadata: {
            is_new_user: true,
            role: "driver",
          },
        });

      if (createUserError) {
        failed.push({
          data: {
            first_name: driver.first_name,
            last_name: driver.last_name,
            phone_number: driver.phone_number,
            temp_password: tempPassword,
            license_number: driver.license_number,
            driver_id: "",
          },
          error: createUserError.message,
        });
        continue;
      }

      // Prepare driver data for database
      const driverData: CreateDriver = {
        first_name: driver.first_name,
        last_name: driver.last_name,
        birth_date: driver.birth_date,
        address: driver.address,
        emergency_contact_name: driver.emergency_contact_name,
        emergency_contact_number: driver.emergency_contact_number,
        license_number: driver.license_number,
        license_expiration: driver.license_expiration,
        operator_id: user.id,
      };

      // Insert driver record with user_id and phone_number
      const { data: driverRecord, error: insertError } = await supabase
        .from("drivers")
        .insert([
          {
            ...driverData,
            user_id: authData.user.id,
            phone_number: driver.phone_number,
            status: "inactive",
          },
        ])
        .select()
        .single();

      if (insertError) {
        // Rollback: delete the auth user we just created
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

        failed.push({
          data: {
            first_name: driver.first_name,
            last_name: driver.last_name,
            phone_number: driver.phone_number,
            temp_password: tempPassword,
            license_number: driver.license_number,
            driver_id: "",
          },
          error: insertError.message,
        });
        continue;
      }

      // Create audit log
      await createLog({
        data: {
          ...driverData,
          batch_upload: true,
        },
        operator_id: user.id,
        driver_id: driverRecord.id,
        log_event: "batch_create_driver",
      });

      successful.push({
        first_name: driver.first_name,
        last_name: driver.last_name,
        phone_number: driver.phone_number,
        temp_password: tempPassword,
        license_number: driver.license_number,
        driver_id: driverRecord.id,
      });
    } catch (error) {
      failed.push({
        data: {
          first_name: driver.first_name,
          last_name: driver.last_name,
          phone_number: driver.phone_number,
          temp_password: tempPassword,
          license_number: driver.license_number,
          driver_id: "",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    successful,
    failed,
    summary: {
      total: drivers.length,
      created: successful.length,
      failed: failed.length,
      skipped: 0,
    },
  };
}

/**
 * Batch create tricycles
 * Transforms flat CSV data to nested structure
 */
export async function batchCreateTricycles(
  tricycles: TricycleCSVRow[]
): Promise<BatchCreateResult<TricycleCSVRow>> {
  const supabase = await createClient();

  // Get authenticated operator
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const successful: TricycleCSVRow[] = [];
  const failed: Array<{ data: TricycleCSVRow; error: string }> = [];

  for (const tricycle of tricycles) {
    try {
      // Transform flat CSV data to nested database structure
      const tricycleData: CreateTricycle = {
        operator_id: user.id,
        plate_number: tricycle.plate_number,
        tricycle_details: {
          model: tricycle.model,
          year: tricycle.year,
          body_number: tricycle.body_number,
          seating_capacity: tricycle.seating_capacity,
          fuel_type: tricycle.fuel_type,
          mileage: tricycle.mileage,
          maintenance_status: tricycle.maintenance_status,
        },
        compliance_details: {
          registration_number: tricycle.registration_number,
          or_number: tricycle.or_number,
          cr_number: tricycle.cr_number,
          franchise_number: tricycle.franchise_number,
        },
        registration_expiration: tricycle.registration_expiration,
        franchise_expiration: tricycle.franchise_expiration,
        last_maintenance_date: tricycle.last_maintenance_date,
      };

      // Insert tricycle record with inactive status
      const { data: tricycleRecord, error: insertError } = await supabase
        .from("tricycles")
        .insert([
          {
            ...tricycleData,
            status: "inactive",
          },
        ])
        .select()
        .single();

      if (insertError) {
        failed.push({
          data: tricycle,
          error: insertError.message,
        });
        continue;
      }

      // Create audit log
      await createLog({
        data: {
          ...tricycleData,
          batch_upload: true,
        },
        operator_id: user.id,
        tricycle_id: tricycleRecord.id,
        log_event: "batch_create_tricycle",
      });

      successful.push(tricycle);
    } catch (error) {
      failed.push({
        data: tricycle,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    successful,
    failed,
    summary: {
      total: tricycles.length,
      created: successful.length,
      failed: failed.length,
      skipped: 0,
    },
  };
}
