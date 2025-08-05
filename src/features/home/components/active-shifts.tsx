'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Ellipsis, Loader2 } from 'lucide-react';
import React from 'react';
import { fetchActiveShifts } from '../db/home';
import ActiveShiftCard from './active-shift-card';

export default function ActiveShifts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['active_shifts'],
    queryFn: fetchActiveShifts,
  });

  if (error) {
    return <div>Error loading drivers: {error.message}</div>;
  }

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />;
  }

  if (!data) return null;
  return (
    <Card className="p-0 gap-0 rounded-md shadow-none max-h-[265px]">
      <CardTitle className="border-b-1 p-6 flex flex-row justify-between">
        Active Shifts
        <Ellipsis />
      </CardTitle>
      <CardContent className="flex-1 flex flex-col justify-between gap-2 py-6 overflow-y-auto">
        {data.map((shift, index) => (
          <ActiveShiftCard shift={shift} key={index} />
        ))}
      </CardContent>
    </Card>
  );
}
