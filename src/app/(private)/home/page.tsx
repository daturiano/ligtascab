"use client";

import ActiveDriversCard from "@/features/home/components/active-drivers-card";
import ActiveShifts from "@/features/home/components/active-shifts";
import ActiveTricycleCard from "@/features/home/components/active-tricycles.card";
import DashboardHeader from "@/features/home/components/dashboard-header";
import RecentActivities from "@/features/home/components/recent-activities";
import TodaysRevenue from "@/features/home/components/todays-revenue";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-6.2rem)] flex-col gap-4 md:grid md:grid-rows-[auto_1fr]">
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <RecentActivities />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden md:grid md:grid-cols-3">
            <ActiveDriversCard />
            <ActiveTricycleCard />
            <TodaysRevenue />
          </div>
          <div className="flex-1">
            <ActiveShifts />
          </div>
        </div>
      </div>
    </div>
  );
}
