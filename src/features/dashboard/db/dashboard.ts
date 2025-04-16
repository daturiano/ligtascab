'use server';

import { Operator } from '@/lib/types';
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
