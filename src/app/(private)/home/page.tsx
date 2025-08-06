import { Card } from '@/components/ui/card';
import { getOperator } from '@/db/db';
import ActiveDriversCard from '@/features/home/components/active-drivers-card';
import ActiveShifts from '@/features/home/components/active-shifts';
import DashboardHeader from '@/features/home/components/dashboard-header';
import RecentActivities from '@/features/home/components/recent-activities';

export default async function HomePage() {
  const operator = await getOperator();
  if (!operator) return null;

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 h-[calc(100vh-6.2rem)]">
      <DashboardHeader operator={operator} />
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <RecentActivities />
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <div className="grid grid-cols-3 gap-4">
            <ActiveDriversCard />
            <Card className="rounded-md border-0"></Card>
            <Card className="rounded-md border-0"></Card>
          </div>
          <ActiveShifts />
        </div>
      </div>
    </div>
  );
}
