'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAllDriversFromOperator } from '@/features/drivers/actions/drivers';
import { useQuery } from '@tanstack/react-query';
import { Contact, TrendingUp } from 'lucide-react';

export default function ActiveDriversCard() {
  const { data: drivers } = useQuery({
    queryKey: ['active_drivers'],
    queryFn: fetchAllDriversFromOperator,
  });

  const active_drivers = drivers?.data.filter(
    (driver) => driver.status === 'active'
  );

  return (
    <Card className="rounded-md px-0 py-4 max-h-[140px] border-0">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Active Drivers</CardTitle>
        <div className="size-10 bg-[#b9e1d7] rounded-md flex items-center justify-center">
          <Contact size={20} />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="font-bold text-4xl text-primary">
          {active_drivers ? active_drivers.length : 0}
          <span className="text-sm text-muted-foreground font-normal">
            /{drivers?.data.length}
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
