"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentLogs } from "../db/home";
import RecentActivityCard from "./recent-activity-card";

export default function RecentActivities() {
  const { data, isLoading } = useQuery({
    queryKey: ["recent_logs"],
    queryFn: fetchRecentLogs,
  });

  if (isLoading) {
    return (
      <Skeleton className="h-full max-h-[650px] w-full max-w-[400px] rounded-md" />
    );
  }

  return (
    <Card className="h-full max-h-[650px] w-full max-w-[400px] gap-0 rounded-md border-0 p-0">
      <CardTitle className="border-b-1 p-4 text-sm md:p-4 md:text-base">
        Recent Activities
      </CardTitle>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 py-6">
        {data?.map((activity, index) => (
          <RecentActivityCard activity={activity} key={index} />
        ))}
      </CardContent>
    </Card>
  );
}
