'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAllTricyclesFromOperator } from '@/features/tricycles/actions/tricycles';
import { useQuery } from '@tanstack/react-query';
import { CarFront, TrendingUp } from 'lucide-react';

export default function ActiveTricycleCard() {
  const { data: tricycles, isLoading } = useQuery({
    queryKey: ['active_tricycles'],
    queryFn: fetchAllTricyclesFromOperator,
  });

  const active_tricycles = tricycles?.data.filter(
    (tricycle) => tricycle.status === 'active'
  );

  if (isLoading) {
    return <Skeleton className="h-[136px] w-[310px] rounded-md" />;
  }

  return (
    <Card className="rounded-md px-0 py-4 max-h-[140px] border-0">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Active Tricycles</CardTitle>
        <div className="size-10 bg-[#b9e1d7] rounded-md flex items-center justify-center">
          <CarFront size={20} />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="font-bold text-4xl text-primary">
          {active_tricycles ? active_tricycles.length : 0}
          <span className="text-sm text-muted-foreground font-normal">
            /{tricycles?.data.length}
          </span>
        </p>
        <div className="flex flex-row items-center gap-1">
          <div className="flex flex-row gap-1 items-center text-primary/60">
            <TrendingUp size={16} />
            <p className="text-sm">+1.25% </p>
          </div>
          <p className="text-sm text-muted-foreground">from last week</p>
        </div>
      </CardContent>
    </Card>
  );
}
