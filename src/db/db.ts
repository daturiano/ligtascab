import { AttachmentDetails } from '@/lib/types';
import { createClient } from '@/supabase/server';

export const createLog = async (data: unknown) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('logs')
    .insert([data])
    .select()
    .single();

  return { error };
};

export const uploadDocument = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = 'documents',
  tableName: string,
  id?: string
) => {
  const results: Record<string, string | null> = {};

  for (const key in attachmentDetails) {
    const { file, documentId } = attachmentDetails[key];

    if (!file) {
      results[documentId] = null;
      continue;
    }

    const sanitizedTitle = documentId.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileExtension = file.name.split('.').pop();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      results[documentId] = null;
      continue;
    }

    const path = id
      ? `${user.id}/${tableName}/${id}/${documentId}/${sanitizedTitle}.${fileExtension}`
      : `${user.id}/${tableName}/${documentId}/${sanitizedTitle}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Upload error for ${documentId}:`, error);
      results[documentId] = null;
    } else {
      console.log(`Upload successful for ${documentId}:`, data);
      results[documentId] = path;
    }
  }

  return results;
};
