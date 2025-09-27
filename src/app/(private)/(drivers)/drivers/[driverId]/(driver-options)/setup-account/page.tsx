"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const DriverSetupAccountForm = dynamic(
  () => import("@/features/drivers/components/driver-setup-account-form"),
  { ssr: false },
);

export default function SetupAccountPage() {
  const { driverId } = useParams();

  if (!driverId) return null;
  return (
    <div className="mx-auto flex max-w-screen-xl flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold lg:text-3xl">
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
