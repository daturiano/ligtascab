import { getOperator } from '@/db/db';
import ActiveShifts from '@/features/home/components/active-shifts';
import DashboardHeader from '@/features/home/components/dashboard-header';
import RecentActivities from '@/features/home/components/recent-activities';

export default async function HomePage() {
  const operator = await getOperator();
  if (!operator) return null;

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 h-[calc(100vh-6rem)]">
      <DashboardHeader operator={operator} />
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <RecentActivities />
        <div className="grid grid-rows-2">
          <ActiveShifts />
        </div>
      </div>
    </div>
  );
}
