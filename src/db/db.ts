import { createClient } from '@/supabase/server';

export const createLog = async (data: unknown) => {
  const supabase = await createClient();

  const { error } = await supabase.from('logs').insert([data]).select();

  if (error) {
    throw new Error('Error creating log', error);
  }

  return { error };
};
