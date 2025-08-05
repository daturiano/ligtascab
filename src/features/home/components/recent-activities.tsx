/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Ellipsis } from 'lucide-react';
import { fetchRecentLogs } from '../db/home';
import RecentActivityCard from './recent-activity-card';

export default function RecentActivities() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recent_logs'],
    queryFn: fetchRecentLogs,
  });

  if (!data) return null;

  return (
    <Card className="p-0 gap-0 rounded-md shadow-none max-w-[500px] bg-background">
      <CardTitle className="border-b-1 p-6 flex flex-row justify-between">
        Recent Activities
        <Ellipsis />
      </CardTitle>
      <CardContent className="flex-1 flex flex-col justify-between py-6">
        {data.map((activity, index) => (
          <RecentActivityCard activity={activity} key={index} />
        ))}
      </CardContent>
    </Card>
  );
}
