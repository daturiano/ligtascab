import { Card, CardHeader } from '@/components/ui/card';
import { getOperator } from '@/db/db';
import ActivityComponent from '@/features/home/components/activity-component';
import Header from '@/features/home/components/header';

export default async function HomePage() {
  const operator = await getOperator();
  if (!operator) return null;
  return (
    <div className="grid grid-rows-[auto_1fr] gap-3 h-[calc(100vh-6rem)]">
      <Header operator={operator} />
      <Card className="rounded-md flex-1 p-0">
        <CardHeader className="p-0">
          <ActivityComponent />
        </CardHeader>
      </Card>
    </div>
  );
}
