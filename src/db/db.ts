import { AttachmentDetails } from '@/lib/types';
import { createClient } from '@/supabase/server';

export const createLog = async (data: unknown) => {
  const supabase = await createClient();

  const { error } = await supabase.from('logs').insert([data]).select();

  return { error };
};

export const uploadDocument = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = 'documents',
  tableName: string,
  id: string
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

    const path = `${user?.id}/${tableName}/${id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

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
