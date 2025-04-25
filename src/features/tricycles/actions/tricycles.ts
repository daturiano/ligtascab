'use server';

import { createClient } from '@/supabase/server';
import {
  AttachmentDetails,
  TricycleFormData,
} from '../components/create-tricycle-provider';
import { createTricycle, uploadTricycleDocument } from '../db/tricycles';

export async function submitUserFormData(tricycleFormData: TricycleFormData) {
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
      registration_expiration: tricycleDetails.registration_expiry,
      franchise_expiration: complianceDetails.franchise_expiry,
      last_maintenance_date: maintenanceDetails.last_maintenance_date,
    };

    const { error } = await createTricycle(tricycleData);

    if (error) {
      throw new Error(`Failed to create new tricycle`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Form submission error:', error);

    return {
      success: false,
      error: error,
    };
  }
}

export const uploadDocumentFormData = async (
  registration_number: string,
  attachmentDetails: AttachmentDetails
) => {
  const bucket_name = 'documents';
  const { error } = await uploadTricycleDocument(
    attachmentDetails,
    bucket_name,
    registration_number
  );

  if (error) {
    throw new Error(`Failed to upload documents tricycle`);
  }

  return error;
};
