'use server';

import { createClient } from '@/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';
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
