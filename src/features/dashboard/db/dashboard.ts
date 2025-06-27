'use server';

import { Driver, Operator, Tricycle } from '@/lib/types';
import { createClient } from '@/supabase/server';

export const getOperator = async (): Promise<Operator | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: operator, error } = await supabase
    .from('operators')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return operator;
};

export const searchTricycles = async (
  query: string,
  page: number = 0
): Promise<Tricycle[]> => {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const limit = 5;
  const offset = page * limit;

  const { data, error } = await supabase
    .from('tricycles')
    .select('*')
    .ilike('plate_number', `%${query}%`)
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    console.error('Error searching tricycles:', error);
    return [];
  }

  return data || [];
};

export const searchDrivers = async (
  query: string,
  page: number = 0
): Promise<Driver[]> => {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const limit = 5;
  const offset = page * limit;

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    console.error('Error searching drivers:', error);
    return [];
  }

  return data || [];
};
