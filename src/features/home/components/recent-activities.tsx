'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchRecentLogs } from '../db/home';
import RecentActivityCard from './recent-activity-card';

export default function RecentActivities() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent_logs'],
    queryFn: fetchRecentLogs,
  });

  if (isLoading) {
    return <Skeleton className="w-[418px] h-[520px] rounded-md" />;
  }

  return (
    <Card className="p-0 gap-0 rounded-md border-0 max-w-[500px]">
      <CardTitle className="border-b-1 p-6">Recent Activities</CardTitle>
      <CardContent className="flex-1 flex flex-col justify-between py-6">
        {data?.map((activity, index) => (
          <RecentActivityCard activity={activity} key={index} />
        ))}
      </CardContent>
    </Card>
  );
}
