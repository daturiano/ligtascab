'use server';

import { AttachmentDetails, Tricycle } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

export const getAllTricycles = cache(
  async (): Promise<{ data: Tricycle[]; error: PostgrestError | null }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tricycles')
      .select('*', { count: 'exact' })
      .order('status', { ascending: true });

    return {
      data: data ?? [],
      error,
    };
  }
);

export const getTricycleByPlateNumber = async (
  plate_number: string
): Promise<Tricycle> => {
  const supabase = await createClient();

  const { data: tricycle } = await supabase
    .from('tricycles')
    .select('*')
    .eq('plate_number', plate_number)
    .single();

  return tricycle;
};

export async function deleteTricycle(
  tricycle_id: string
): Promise<{ error: PostgrestError | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tricycles')
    .delete()
    .eq('id', tricycle_id);

  return { error };
}

export const createTricycle = async (
  tricycleData: Tricycle
): Promise<{ data: Tricycle; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tricycles')
    .upsert([tricycleData])
    .select()
    .single();

  return { data, error };
};

export const getTricycleById = async (
  tricycle_id: string
): Promise<{ data: Tricycle; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tricycles')
    .select('*')
    .eq('id', tricycle_id)
    .single();

  return { data, error };
};

export const uploadDocuments = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = 'documents',
  tricycle_id: string
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

    const path = `${user?.id}/tricycles/${tricycle_id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

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
