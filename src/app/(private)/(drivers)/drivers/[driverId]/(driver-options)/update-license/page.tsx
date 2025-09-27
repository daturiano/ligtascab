"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const UpdateLicenseForm = dynamic(
  () => import("@/features/drivers/components/update-license-form"),
  { ssr: false },
);

export default function UpdateLicensePage() {
  const { driverId } = useParams();

  if (!driverId) return null;
  return (
    <div className="mx-auto flex max-w-screen-xl flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold lg:text-3xl">
          Update your driver&apos;s license
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Please upload the front and back image of the driver&apos;s license.
        </p>
      </div>
      <UpdateLicenseForm driver_id={driverId as string} />
    </div>
  );
}
