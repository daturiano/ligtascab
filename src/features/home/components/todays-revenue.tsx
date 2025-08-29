"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { PhilippinePeso } from "lucide-react";
import { fetchAllShiftLogsToday } from "../actions/home";

export default function TodaysRevenue() {
  const { data: shifts_today, isLoading } = useQuery({
    queryKey: ["shifts_today"],
    queryFn: fetchAllShiftLogsToday,
  });

  const todaysRevenue =
    shifts_today
      ?.filter((shift) => shift.shift_type === "Time-out")
      .reduce(
        (total, shift) => total + Number(shift.revenue_collected || 0),
        0,
      ) ?? 0;

  if (isLoading) {
    return <Skeleton className="max-h-[140px] min-w-[300px] rounded-md" />;
  }

  return (
    <Card className="max-h-[140px] min-w-[300px] rounded-md border-0 px-0 py-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm md:text-base">
          Today&apos;s Revenue
        </CardTitle>
        <div className="flex size-10 items-center justify-center rounded-md bg-[#b9e1d7]">
          <PhilippinePeso size={18} />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="text-primary text-4xl font-bold">₱{todaysRevenue}</p>
      </CardContent>
    </Card>
  );
}
