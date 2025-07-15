'use client';

import DriverSetupAccountForm from '@/features/drivers/components/driver-setup-account-form';
import { useParams } from 'next/navigation';

export default function SetupAccountPage() {
  const { driverId } = useParams();

  if (!driverId) return null;
  return (
    <div className="flex flex-col gap-6 flex-1 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="lg:text-3xl text-xl font-semibold">
          Setup your driver&apos;s account
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Setup your driver&apos;s account so that they can access their
          informations by logging in.
        </p>
      </div>
      <DriverSetupAccountForm driver_id={driverId as string} />
    </div>
  );
}
