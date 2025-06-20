'use client';

import EditProfileForm from '@/features/drivers/components/edit-profile-form';
import { getDriverById } from '@/features/drivers/db/drivers';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function EditProfilePage() {
  const { driverId } = useParams();

  const { data: driver, error } = useQuery({
    queryKey: ['driver_profile', driverId],
    queryFn: () => getDriverById(driverId as string),
    enabled: !!driverId,
  });

  if (!driverId) return null;
  if (error) return <div>Error: {error.message}</div>;
  if (!driver) return null;

  return (
    <div className="flex flex-col gap-6 flex-1 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="lg:text-3xl text-xl font-semibold">
          Update your driver&apos;s information
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Update your driver&apos;s information for operational use.
        </p>
      </div>
      <EditProfileForm driver={driver.data} />
    </div>
  );
}
