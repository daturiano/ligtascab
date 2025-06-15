import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import DriverProfileCard from '@/features/drivers/components/driver-profile-card';
import { DriverShiftsTable } from '@/features/drivers/components/driver-shifts-table';

export default async function DriverProfilePage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const driverId = (await params).driverId;
  const { data: driver } = await fetchDriverDetails(driverId);
  if (!driver) return null;

  return (
    <div className="space-y-6 gap-4 mx-auto mb-12">
      <div className="flex gap-4">
        <DriverProfileCard driver={driver} />
        <DriverShiftsTable id={driver.id} />
      </div>
    </div>
  );
}
