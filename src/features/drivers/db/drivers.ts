'use server';

import { Driver } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { cache } from 'react';

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
