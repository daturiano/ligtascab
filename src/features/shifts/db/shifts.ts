'use server';

import { ShiftLog, Tricycle } from '@/lib/types';
import { createClient } from '@/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';

export const getAvailableTricycles = cache(
  async (): Promise<{
    data: Tricycle['plate_number'][];
    error: PostgrestError | null;
  }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tricycles')
      .select('plate_number')
      .eq('status', 'inactive');

    const sampleData = data?.map((tricycle) => tricycle.plate_number);
    console.log(sampleData);

    return {
      data: data ? data.map((tricycle) => tricycle.plate_number) : [],
      error: error,
    };
  }
);

export const checkDriverStatus = async (id: string): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('drivers')
    .select('status')
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error) {
    return false;
  }

  return true;
};

export const getDriverAssignedVehicle = async (
  id: string
): Promise<{ data: ShiftLog; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('driver_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

export const createShiftLog = async (newLog: ShiftLog): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('shifts')
    .insert([newLog])
    .select()
    .single();

  if (error) {
    console.error('Error inserting log:', error);
    return false;
  }

  return true;
};

export const updateDriverStatus = async (
  id: string,
  status: string
): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('drivers')
    .update({ status: status })
    .eq('id', id)
    .select();

  console.log(id, status);

  if (error) {
    console.error('Error updating driver status:', error);
    return false;
  }

  return true;
};

export const updateTricycleStatus = async (
  plate_number: string,
  status: string
): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tricycles')
    .update({ status: status })
    .eq('plate_number', plate_number)
    .select();

  if (error) {
    console.error('Error updating driver status:', error);
    return false;
  }

  return true;
};

export const getAllShiftLogs = cache(
  async (): Promise<{ data: ShiftLog[]; error: PostgrestError | null }> => {
    const supabase = await createClient();
    const { data: logs, error } = await supabase
      .from('shifts')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: logs || [], error };
  }
);

export const getDriverMostRecentLog = async (
  id: string
): Promise<{ data: ShiftLog; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('driver_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};
