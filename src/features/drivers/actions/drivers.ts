'use server';

import { createLog, uploadDocument } from '@/db/db';
import { AttachmentDetails, Driver } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';
import { createClient } from '@/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DriverFormData } from '../components/create-driver-provider';
import {
  createDriver,
  deleteDriver,
  getAllDrivers,
  getDriverById,
  updateDriverById,
  updateLicense,
} from '../db/drivers';
import { DriverComplianceSchema, DriverDetails } from '../schemas/drivers';

export const fetchDriverDetails = async (
  id: string
): Promise<{ data: Driver }> => {
  const { data, error } = await getDriverById(id);

  if (error || !data) throw new Error(error?.message || 'Driver not found');

  return { data };
};

export const fetchAllDriversFromOperator = async (): Promise<{
  data: Driver[];
}> => {
  const { data, error } = await getAllDrivers();

  if (error || !data) throw new Error(error?.message || 'No available drivers');

  return { data };
};

export async function createNewDriver(driverFormData: DriverFormData): Promise<{
  data: Driver;
}> {
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
      throw new Error('User is not authenticated');
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
      throw new Error(error?.message || 'Unable to create new driver');
    }

    const logData = {
      data: driverData,
      operator_id: user.id,
      driver_id: driver.id,
      log_event: 'create_driver',
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      throw new Error(logError.message || 'Unable to log create new driver');
    }

    return { data: driver };
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export const removeDriverFromOperator = async (
  driver: Driver
): Promise<{ data: Driver }> => {
  const { data, error } = await deleteDriver(driver.id);

  if (error || !data) {
    throw new Error(error?.message || 'Unable to delete driver');
  }

  const logData = {
    data: { data },
    operator_id: driver.operator_id,
    driver_id: driver.id,
    log_event: 'delete_driver',
  };

  const { error: logError } = await createLog(logData);

  if (logError) {
    throw new Error(logError.message || 'Unable to log delete driver');
  }

  return { data: data };
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
    throw new Error('User not authenticated');
  }

  const { data: driver, error } = await getDriverById(driver_id);

  if (error || !driver) {
    throw new Error(error?.message || 'Unable to get driver by id');
  }

  const bucket_name = 'documents';
  const results = await uploadDocument(
    attachmentDetails,
    bucket_name,
    'drivers',
    driver.id
  );

  const logData = {
    data: { results },
    operator_id: user.id,
    driver_id: driver.id,
    log_event: 'driver_documents',
  };

  const { error: LogError } = await createLog(logData);

  if (LogError) {
    throw new Error(
      LogError.message || 'unable to create log for update document'
    );
  }
};

export const updateDriverLicense = async (
  driver_id: string,
  data: z.infer<typeof DriverComplianceSchema>
): Promise<{ data: Driver }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: prevData, error: getDriverError } = await getDriverById(
      driver_id
    );

    if (getDriverError || !prevData) {
      throw new Error(
        getDriverError?.message || 'Unable to get driver previous data'
      );
    }

    const { data: driver, error } = await updateLicense(data, driver_id);

    if (error || !driver) {
      throw new Error(error?.message || 'Unable to update driver license');
    }

    const logData = {
      data: { prevData: prevData, updatedData: driver },
      operator_id: user.id,
      driver_id: prevData.id,
      log_event: 'update_driver',
    };

    const { error: LogError } = await createLog(logData);

    if (LogError) {
      throw new Error(
        LogError.message || 'unable to create log for update document'
      );
    }

    revalidatePath(`/drivers/${driver.id}`);

    return { data: driver };
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export const updateDriverDetails = async (
  prevData: Driver,
  updatedData: DriverDetails
): Promise<{ data: Driver }> => {
  const { data: driver, error } = await updateDriverById(
    prevData.id,
    updatedData
  );

  if (error || !driver) {
    throw new Error(error?.message || 'Unable to update driver by id');
  }

  const logData = {
    data: { prevData: prevData, updatedData: updatedData },
    operator_id: prevData.id,
    driver_id: prevData.id,
    log_event: 'update_driver',
  };

  const { error: LogError } = await createLog(logData);

  if (LogError) {
    throw new Error(
      LogError.message || 'unable to create log for update document'
    );
  }

  revalidatePath(`/drivers/${driver.id}`);

  return { data: driver };
};
