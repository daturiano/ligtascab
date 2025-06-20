'use server';

import { createLog, uploadDocument } from '@/db/db';
import { AttachmentDetails } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { z } from 'zod';
import { DriverFormData } from '../components/create-driver-provider';
import {
  createDriver,
  deleteDriver,
  getAllDrivers,
  getAllDriverShiftLogs,
  getDriverById,
  updateDriverById,
  updateLicense,
} from '../db/drivers';
import { DriverComplianceSchema, DriverDetails } from '../schemas/drivers';
import { revalidatePath } from 'next/cache';

export const fetchDriverDetails = async (id: string) => {
  const { data, error } = await getDriverById(id);

  return { data, error };
};

export const fetchAllDriversFromOperator = async () => {
  const { data, error } = await getAllDrivers();

  if (error) throw new Error('Unable to fetch all drivers');

  return { data, error };
};

export async function createNewDriver(driverFormData: DriverFormData) {
  try {
    const { driverDetails, complianceDetails } = driverFormData as {
      driverDetails: NonNullable<typeof driverFormData.driverDetails>;
      complianceDetails: NonNullable<typeof driverFormData.complianceDetails>;
    };

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated.' };
    }

    const driverData = {
      operator_id: user.id,
      first_name: driverDetails.first_name,
      last_name: driverDetails.last_name,
      birth_date: driverDetails.birth_date,
      address: driverDetails.address,
      emergency_contact_name: driverDetails.emergency_contact_name,
      emergency_contact_number: driverDetails.emergency_contact_number,
      license_number: complianceDetails.license_number,
      license_expiration: complianceDetails.license_expiration,
      phone_number: driverDetails.phone_number,
    };

    const { data: driver, error } = await createDriver(driverData);

    if (error || !driver) {
      return { success: false, error: 'Failed to create driver.' };
    }

    const logData = {
      data: driverData,
      operator_id: user.id,
      driver_id: driver.id,
      log_event: 'create_driver',
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      return { success: false, error: 'Failed to log event.' };
    }

    return { success: true };
  } catch (err) {
    console.error('submitUserFormData error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export const removeDriverFromOperator = async (id: string) => {
  const { error } = await deleteDriver(id);

  if (error) throw new Error('Failed to delete driver');
};

export const uploadDriverDocument = async (
  driver_id: string,
  attachmentDetails: AttachmentDetails
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  const { data: driver, error } = await getDriverById(driver_id);

  console.log(driver);

  if (error) {
    return { success: false, error: 'Failed to retrieve driver.' };
  }

  console.log(error);

  if (!driver.id) {
    return { success: false, error: 'Driver ID not found.' };
  }

  const bucket_name = 'documents';
  const results = await uploadDocument(
    attachmentDetails,
    bucket_name,
    'drivers',
    driver.id
  );

  console.log(results);

  // const logData = {
  //   data: results,
  //   operator_id: user.id,
  //   driver_id: driver.id,
  //   log_event: 'driver_documents',
  // };

  // const { error: LogError } = await createLog(logData);

  // if (LogError) {
  //   return { success: false, error: 'Failed to create audit log.' };
  // }

  return { success: true };
};

export const fetchAllDriverShiftLogs = async (id: string) => {
  const { data: shift_logs, error } = await getAllDriverShiftLogs(id);

  if (error) throw new Error('Unable to fetch driver shift logs');

  return shift_logs;
};

export const updateDriverLicense = async (
  data: z.infer<typeof DriverComplianceSchema>
) => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data: driver, error } = await updateLicense(data);

    if (error || !driver) {
      return { success: false, error: error };
    }

    return { success: true, data: driver };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Creating new operator error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred.',
    };
  }
};

export const updateDriverDetails = async (
  id: string,
  updatedData: DriverDetails
) => {
  const { data, error } = await updateDriverById(id, updatedData);

  if (error) throw new Error('Failed to delete driver');

  revalidatePath(`/drivers/${id}`);

  return { data, error };
};
