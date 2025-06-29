'use server';

import { createClient } from '@/supabase/server';
import { cache } from 'react';
import {
  CreateDriver,
  DriverComplianceDetails,
  DriverDetails,
} from '../schemas/drivers';

export const getAllDrivers = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('drivers')
    .select('*', { count: 'exact' })
    .order('status', { ascending: true });

  return {
    data: data ?? [],
    error,
  };
});

export const deleteDriver = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const createDriver = async (driverData: CreateDriver) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .upsert([driverData])
    .select()
    .single();

  return { data, error };
};

export const getDriverByLicenseNumber = async (license_number: string) => {
  const supabase = await createClient();
  console.log(license_number);

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('license_number', license_number)
    .single();

  return { data, error };
};

export const getDriverById = async (driver_id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driver_id)
    .single();

  return { data, error };
};

export async function updateDriverById(id: string, updatedData: DriverDetails) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .update([updatedData])
    .eq('id', id)
    .select()
    .maybeSingle();

  return { data, error };
}

export const getAllDriverShiftLogs = cache(async (id: string) => {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('driver_id', id)
    .order('created_at', { ascending: false });

  return { data: logs || [], error };
});

export const updateLicense = async (driverData: DriverComplianceDetails) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('drivers')
    .update([driverData])
    .eq('license_number', driverData.license_number)
    .select();

  console.log(error, data);

  return { data, error };
};
