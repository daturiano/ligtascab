"use client";

import dynamic from "next/dynamic";

const ActiveDriversCard = dynamic(
  () => import("@/features/home/components/active-drivers-card"),
  { ssr: false },
);

const ActiveShifts = dynamic(
  () => import("@/features/home/components/active-shifts"),
  { ssr: false },
);

const ActiveTricycleCard = dynamic(
  () => import("@/features/home/components/active-tricycles.card"),
  { ssr: false },
);

const DashboardHeader = dynamic(
  () => import("@/features/home/components/dashboard-header"),
  { ssr: false },
);

const RecentActivities = dynamic(
  () => import("@/features/home/components/recent-activities"),
  { ssr: false },
);

const TodaysRevenue = dynamic(
  () => import("@/features/home/components/todays-revenue"),
  { ssr: false },
);

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
