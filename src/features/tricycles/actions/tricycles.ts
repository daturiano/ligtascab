'use server';

import { createLog, uploadDocument } from '@/db/db';
import { AttachmentDetails } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { TricycleFormData } from '../components/create-tricycle-provider';
import {
  createTricycle,
  deleteTricycle,
  getAllTricycles,
  getTricycleById,
  getTricycleByPlateNumber,
} from '../db/tricycles';

export const fetchAllTricyclesFromOperator = async () => {
  const { data, error } = await getAllTricycles();

  if (error) throw new Error('Unable to fetch all tricycles');

  return { data, error };
};

export const fetchTricycleDetailsWithPlateNumber = async (
  plate_number: string
) => {
  const { data, error } = await getTricycleByPlateNumber(plate_number);

  if (error) throw new Error('Unable to fetch tricycle details');

  return { data };
};

export async function createNewTricycle(tricycleFormData: TricycleFormData) {
  try {
    const { tricycleDetails, complianceDetails, maintenanceDetails } =
      tricycleFormData as {
        tricycleDetails: NonNullable<typeof tricycleFormData.tricycleDetails>;
        complianceDetails: NonNullable<
          typeof tricycleFormData.complianceDetails
        >;
        maintenanceDetails: NonNullable<
          typeof tricycleFormData.maintenanceDetails
        >;
      };

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const tricycleData = {
      operator_id: user.id,
      tricycle_details: {
        model: tricycleDetails.model,
        year: tricycleDetails.year,
        seating_capacity: tricycleDetails.seating_capacity,
        body_number: tricycleDetails.body_number,
        fuel_type: tricycleDetails.fuel_type,
        mileage: maintenanceDetails.mileage,
        maintenance_status: maintenanceDetails.maintenance_status,
      },
      compliance_details: {
        registration_number: tricycleDetails.registration_number,
        franchise_number: complianceDetails.franchise_number,
        or_number: complianceDetails.or_number,
        cr_number: complianceDetails.cr_number,
      },
      plate_number: complianceDetails.plate_number,
      registration_expiration: tricycleDetails.registration_expiration,
      franchise_expiration: complianceDetails.franchise_expiration,
      last_maintenance_date: maintenanceDetails.last_maintenance_date,
    };

    const { data: tricycle, error } = await createTricycle(tricycleData);

    if (error || !tricycle) {
      return { success: false, error: 'Failed to create driver.' };
    }

    const logData = {
      data: tricycleData,
      operator_id: user.id,
      tricycle_id: tricycle.id,
      log_event: 'create_tricycle',
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      return { success: false, error: 'Failed to log event.' };
    }

    return { success: true, data: tricycle };
  } catch (err) {
    console.error('Creating new tricycle error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export const removeTricycleFromOperator = async (tricycle_id: string) => {
  const { error } = await deleteTricycle(tricycle_id);

  if (error) throw new Error('Failed to delete tricycle');
};

export const uploadTricycleDocument = async (
  tricycle_id: string,
  attachmentDetails: AttachmentDetails
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  const { data: tricycle, error } = await getTricycleById(tricycle_id);

  if (error) {
    return { success: false, error: 'Failed to retrieve tricycle.' };
  }

  if (!tricycle.id) return null;

  const bucket_name = 'documents';
  const results = await uploadDocument(
    attachmentDetails,
    bucket_name,
    'tricyles',
    tricycle.id
  );

  const logData = {
    data: results,
    operator_id: user.id,
    driver_id: tricycle.id,
    log_event: 'tricycle_documents',
  };

  const { error: LogError } = await createLog(logData);

  if (LogError) {
    return { success: false, error: 'Failed to create audit log.' };
  }

  return { success: true };
};
