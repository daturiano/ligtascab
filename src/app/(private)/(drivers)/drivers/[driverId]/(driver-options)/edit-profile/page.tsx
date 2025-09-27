"use client";

import { getDriverById } from "@/features/drivers/db/drivers";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const EditProfileForm = dynamic(
  () => import("@/features/drivers/components/edit-profile-form"),
  {
    ssr: false,
  },
);

export default function EditProfilePage() {
  const { driverId } = useParams();

  const { data: driver, error } = useQuery({
    queryKey: ["driver_profile", driverId],
    queryFn: () => getDriverById(driverId as string),
    enabled: !!driverId,
  });

  if (!driverId) return null;
  if (error) return <div>Error: {error.message}</div>;
  if (!driver) return null;

  return (
    <div className="mx-auto flex max-w-screen-xl flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold lg:text-3xl">
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
