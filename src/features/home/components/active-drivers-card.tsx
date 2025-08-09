"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllDriversFromOperator } from "@/features/drivers/actions/drivers";
import { useQuery } from "@tanstack/react-query";
import { Contact, TrendingUp } from "lucide-react";

export default function ActiveDriversCard() {
  const { data: drivers, isLoading } = useQuery({
    queryKey: ["active_drivers"],
    queryFn: fetchAllDriversFromOperator,
  });

  const active_drivers = drivers?.data.filter(
    (driver) => driver.status === "active",
  );

  if (isLoading) {
    return <Skeleton className="h-[136px] w-[310px] rounded-md" />;
  }

  return (
    <Card className="max-h-[140px] min-w-[300px] rounded-md border-0 px-0 py-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm md:text-base">Active Drivers</CardTitle>
        <div className="flex size-10 items-center justify-center rounded-md bg-[#b9e1d7]">
          <Contact size={20} />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="text-primary text-4xl font-bold">
          {active_drivers ? active_drivers.length : 0}
          <span className="text-muted-foreground text-sm font-normal">
            /{drivers?.data.length}
          </span>
        </p>
        <div className="flex flex-row items-center gap-1">
          <div className="text-primary/60 flex flex-row items-center gap-1">
            <TrendingUp size={16} />
            <p className="text-sm">+1.25% </p>
          </div>
          <p className="text-muted-foreground text-sm">from last week</p>
        </div>
      </CardContent>
    </Card>
  );
}
