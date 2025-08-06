'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { fetchRecentLogs } from '../db/home';
import RecentActivityCard from './recent-activity-card';

export default function RecentActivities() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recent_logs'],
    queryFn: fetchRecentLogs,
  });

  if (error) {
    return <div>Error loading drivers: {error.message}</div>;
  }

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />;
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
