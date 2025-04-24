'use server';

import { Tricycle, Tricycle2 } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { AttachmentDetails } from '../components/create-tricycle-provider';

export const getAllTricycles = cache(async (): Promise<Tricycle[]> => {
  const supabase = await createClient();
  const { data: tricycles, error } = await supabase
    .from('tricycles')
    .select('*', { count: 'exact' })
    .order('status', { ascending: true });

  if (error) {
    throw new Error('Error fetching vehicles:', error);
  }

  return tricycles ?? [];
});

export const getTricycleByRegNumber = async (
  registration_number: string
): Promise<Tricycle2> => {
  const supabase = await createClient();

  const { data: tricycle } = await supabase
    .from('tricycles')
    .select('*')
    .eq('registration_number', registration_number)
    .single();

  return tricycle;
};

export const createTricycle = async (tricycleData: Tricycle2) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tricycles')
    .insert([tricycleData])
    .select();

  if (error) throw new Error('Unable to create new tricycle', error);

  return { error, data };
};

export const uploadTricycleDocument = async (
  attachmentDetails: AttachmentDetails | undefined,
  bucketName: string = 'documents',
  registration_number: string
) => {
  const results: Record<string, string | null> = {};

  console.log(attachmentDetails);
  const tricycle = await getTricycleByRegNumber(registration_number);
  console.log(tricycle);

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

    const path = `${user?.id}/${tricycle.id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

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
