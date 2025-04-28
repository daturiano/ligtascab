'use server';

import { createClient } from '@/supabase/server';
import {
  AttachmentDetails,
  DriverFormData,
} from '../components/create-driver-provider';
import { createDriver, uploadDriverDocument } from '../db/drivers';

export async function submitUserFormData(driverFormData: DriverFormData) {
  try {
    const { driverDetails, complianceDetails } = driverFormData as {
      driverDetails: NonNullable<typeof driverFormData.driverDetails>;
      complianceDetails: NonNullable<typeof driverFormData.complianceDetails>;
    };

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const driverData = {
      operator_id: user.id,
      first_name: driverDetails.first_name,
      last_name: driverDetails.last_name,
      birth_date: driverDetails.date_of_birth,
      address: driverDetails.address,
      emergency_contact_name: driverDetails.emergency_contact_name,
      emergency_contact_number: driverDetails.emergency_contact_number,
      license_number: complianceDetails.license_number,
      license_expiration: complianceDetails.license_expiration,
      phone_number: driverDetails.contact_number,
    };

    const { error } = await createDriver(driverData);

    if (error) {
      throw new Error(`Failed to create new driver`);
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
  license_number: string,
  attachmentDetails: AttachmentDetails
) => {
  const bucket_name = 'documents';
  const { error } = await uploadDriverDocument(
    attachmentDetails,
    bucket_name,
    license_number
  );

  if (error) {
    throw new Error(`Failed to upload documents tricycle`);
  }

  return error;
};
