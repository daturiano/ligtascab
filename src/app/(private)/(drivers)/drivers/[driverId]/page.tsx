import { getDriverById } from '@/features/drivers/db/drivers';

export default async function page({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const driverId = (await params).driverId;
  const driver = await getDriverById(driverId);
  if (!driver) return null;
  return (
    <div className="space-y-4 w-full gap-4 lg:px-20 max-w-screen-2xl mx-auto">
      {driver.id}
    </div>
  );
}
