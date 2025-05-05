'use server';

import { createLog } from '@/db/db';
import { createClient } from '@/supabase/server';
import {
  AttachmentDetails,
  DriverFormData,
} from '../components/create-driver-provider';
import {
  createDriver,
  deleteDriver,
  getAllDrivers,
  getDriverById,
  getDriverByLicenseNumber,
  uploadDocument,
} from '../db/drivers';

export const fetchDriverDetails = async (id: string) => {
  const { data, error } = await getDriverById(id);

  if (error) throw new Error('Driver not found');

  return { data };
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
  license_number: string,
  attachmentDetails: AttachmentDetails
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  const { data: driver, error } = await getDriverByLicenseNumber(
    license_number
  );

  if (error) {
    return { success: false, error: 'Failed to retrieve driver.' };
  }

  if (!driver.id) return null;

  const bucket_name = 'documents';
  const results = await uploadDocument(
    attachmentDetails,
    bucket_name,
    driver.id
  );

  const logData = {
    data: results,
    operator_id: user.id,
    driver_id: driver.id,
    log_event: 'driver_documents',
  };

  const { error: LogError } = await createLog(logData);

  if (LogError) {
    return { success: false, error: 'Failed to create audit log.' };
  }

  return { success: true };
};
