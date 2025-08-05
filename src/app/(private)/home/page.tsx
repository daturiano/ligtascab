import { getOperator } from '@/db/db';
import DashboardHeader from '@/features/home/components/dashboard-header';
import RecentActivities from '@/features/home/components/recent-activities';

export default async function HomePage() {
  const operator = await getOperator();
  if (!operator) return null;

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3 h-[calc(100vh-6rem)]">
      <DashboardHeader operator={operator} />
      <div className="grid grid-cols-[auto_1fr]">
        <RecentActivities />
      </div>
    </div>
  );
}
