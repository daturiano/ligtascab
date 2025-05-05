'use server';

import { createClient } from '@/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';
import { AttachmentDetails } from '../components/create-driver-provider';
import { Driver } from '../schemas/drivers';

export const getAllDrivers = cache(
  async (): Promise<{ data: Driver[]; error: PostgrestError | null }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('drivers')
      .select('*', { count: 'exact' })
      .order('status', { ascending: true });

    return {
      data: data ?? [],
      error,
    };
  }
);

export const deleteDriver = async (license_number: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('license_number', license_number);

  return { error };
};

export const createDriver = async (
  driverData: Driver
): Promise<{ data: Driver; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .upsert([driverData])
    .select()
    .single();

  return { data, error };
};

export const getDriverByLicenseNumber = async (
  license_number: string
): Promise<{ data: Driver; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('license_number', license_number)
    .single();

  return { data, error };
};

export const getDriverById = async (
  driver_id: string
): Promise<{ data: Driver; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driver_id)
    .single();

  return { data, error };
};

export async function updateDriverById(
  id: string,
  updatedData: Driver
): Promise<{ data: Driver; error: PostgrestError | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .update([updatedData])
    .eq('id', id)
    .select()
    .maybeSingle();

  return { data, error };
}

export const uploadDocument = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = 'documents',
  driver_id: string
) => {
  const results: Record<string, string | null> = {};

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

    const path = `${user?.id}/drivers/${driver_id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

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
