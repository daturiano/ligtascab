import DriverProfileCard from '@/features/drivers/components/driver-profile-card';
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
    <div className="space-y-4 w-full lg:px-20 max-w-screen-2xl mx-auto flex">
      <DriverProfileCard driver={driver} />
      <div className="w-full">
        <p></p>
      </div>
    </div>
  );
}
