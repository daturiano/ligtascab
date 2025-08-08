'use client';

import ActiveDriversCard from '@/features/home/components/active-drivers-card';
import ActiveShifts from '@/features/home/components/active-shifts';
import ActiveTricycleCard from '@/features/home/components/active-tricycles.card';
import DashboardHeader from '@/features/home/components/dashboard-header';
import RecentActivities from '@/features/home/components/recent-activities';
import TodaysRevenue from '@/features/home/components/todays-revenue';

export default function HomePage() {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 h-[calc(100vh-6.2rem)]">
      <DashboardHeader />
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <RecentActivities />
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <div className="grid grid-cols-3 gap-4">
            <ActiveDriversCard />
            <ActiveTricycleCard />
            <TodaysRevenue />
          </div>
          <ActiveShifts />
        </div>
      </div>
    </div>
  );
}
