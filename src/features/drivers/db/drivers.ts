'use server';

import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { AttachmentDetails } from '../components/create-driver-provider';
import { Driver } from '../schemas/drivers';

export const getAllDrivers = cache(async (): Promise<Driver[]> => {
  const supabase = await createClient();
  const { data: drivers, error } = await supabase
    .from('drivers')
    .select('*', { count: 'exact' })
    .order('status', { ascending: true });

  if (error) {
    throw new Error('Error fetching drivers:', error);
  }

  return drivers ?? [];
});

export const deleteDriver = async (license_number: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('license_number', license_number);

  if (error) throw new Error('Unable to delete driver', error);
};

export const createDriver = async (driverData: Driver) => {
  console.log(driverData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .upsert([driverData])
    .select();

  if (error) {
    console.log(error);
    throw new Error('Unable to create new driver', error);
  }

  return { error, data };
};

export const getDriverByLicenseNumber = async (
  license_number: string
): Promise<Driver> => {
  const supabase = await createClient();

  const { data: driver } = await supabase
    .from('drivers')
    .select('*')
    .eq('license_number', license_number)
    .single();

  return driver;
};

export const getDriverById = async (driver_id: string): Promise<Driver> => {
  const supabase = await createClient();

  const { data: driver, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driver_id)
    .single();

  if (error) throw new Error('Cannot get driver', error);

  return driver;
};

export const uploadDriverDocument = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = 'documents',
  license_number: string
) => {
  const results: Record<string, string | null> = {};

  const driver = await getDriverByLicenseNumber(license_number);

  for (const key in attachmentDetails) {
    const { file, documentId, documentTitle } = attachmentDetails[key];

    if (!file) {
      results[documentId] = null;
      continue;
    }

    const sanitizedTitle = documentTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const fileExtension = file.name.split('.').pop();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = `${user?.id}/drivers/${driver.id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    results[documentId] = error ? null : path;
  }

  return results;
};
