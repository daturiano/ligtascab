'use server';

import { Tricycle } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { cache } from 'react';

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
