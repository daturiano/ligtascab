'use client';

import UpdateLicenseForm from '@/features/drivers/components/update-license-form';
import { useSearchParams } from 'next/navigation';

export default function UpdateLicensePage() {
  const searchParams = useSearchParams();
  const driver_id = searchParams.get('driverId');

  if (!driver_id) return null;
  return (
    <div className="flex flex-col gap-6 flex-1 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="lg:text-3xl text-xl font-semibold">
          Update your driver&apos;s license
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Please upload the front and back image of the driver&apos;s license.
        </p>
      </div>
      <UpdateLicenseForm driver_id={driver_id} />
    </div>
  );
}
