'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { PhilippinePeso, TrendingUp } from 'lucide-react';
import { fetchAllShiftLogsToday } from '../actions/home';
import { Skeleton } from '@/components/ui/skeleton';

export default function TodaysRevenue() {
  const { data: shifts_today, isLoading } = useQuery({
    queryKey: ['shifts_today'],
    queryFn: fetchAllShiftLogsToday,
  });

  const todaysRevenue =
    shifts_today
      ?.filter((shift) => shift.shift_type === 'Time-out')
      .reduce(
        (total, shift) => total + Number(shift.revenue_collected || 0),
        0
      ) ?? 0;

  if (isLoading) {
    return <Skeleton className="h-[136px] w-[310px] rounded-md" />;
  }

  return (
    <Card className="rounded-md px-0 py-4 max-h-[140px] border-0">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Today&apos;s Revenue</CardTitle>
        <div className="size-10 bg-[#b9e1d7] rounded-md flex items-center justify-center">
          <PhilippinePeso size={18} />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="font-bold text-4xl text-primary">₱{todaysRevenue}</p>
        <div className="flex flex-col items-start gap-0">
          <div className="flex flex-row gap-1 items-center text-primary/60">
            <TrendingUp size={16} />
            <p className="text-sm">+1.25% </p>
          </div>
          <p className="text-sm text-muted-foreground">than last month</p>
        </div>
      </CardContent>
    </Card>
  );
}
