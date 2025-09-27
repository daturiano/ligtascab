"use client";

import license from "@/app/public/license.png";
import qrcode from "@/app/public/qr-code.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DriverProfileCard from "@/features/drivers/components/driver-profile-card";
import { Driver } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Check, UserCheck } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

type DriverProfileViewProps = {
  driver: Driver;
  user: User;
};

const ViewDriverLicense = dynamic(
  () => import("@/features/drivers/components/view-driver-license"),
  { ssr: false },
);
const ViewQRCode = dynamic(() => import("@/components/private/view-qr-code"), {
  ssr: false,
});
const DriverShiftsTable = dynamic<{ id: string }>(
  () =>
    import("@/features/drivers/components/driver-shifts-table").then(
      (mod) => mod.DriverShiftsTable,
    ),
  { ssr: false },
);

export default function DriverProfileView({
  driver,
  user,
}: DriverProfileViewProps) {
  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Link href={"/drivers"} className="w-0">
          <ArrowLeft size={28} />
        </Link>
        {driver.phone_number ? (
          <Badge>
            <Check />
            <p>Verified Driver</p>
          </Badge>
        ) : (
          <Link href={`/drivers/${driver.id}/setup-account`}>
            <Button variant={"outline"}>
              <UserCheck />
              Setup Driver Account
            </Button>
          </Link>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-[auto_1fr] xl:grid-rows-[auto_1fr]">
        <div className="xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-4">
          <DriverProfileCard driver={driver} />
        </div>
        <div className="flex flex-col gap-4 md:justify-between xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2 xl:flex-row">
          <Card className="w-full max-w-[500px] grow xl:max-w-[600px] xl:grow-0">
            <CardTitle className="px-6">Driver&apos;s License</CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="flex min-h-32 min-w-32 items-center justify-center rounded-md bg-gray-300">
                <Image
                  src={license}
                  alt="license"
                  width={80}
                  height={80}
                  loading="lazy"
                />
              </div>
              <div className="flex w-full flex-col justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  Keep the driver&apos;s license always up to date. Failure to
                  do so will disable the usage of this driver.
                </p>
                <div className="flex flex-col gap-2">
                  <ViewDriverLicense
                    path={`${user.id}/drivers/${driver.id}`}
                    license_expiration={driver.license_expiration}
                  />
                  <Link href={`/drivers/${driver.id}/update-license`}>
                    <Button className="w-full flex-1" variant={"outline"}>
                      Update License
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-[500px] grow xl:max-w-[600px] xl:grow-0">
            <CardTitle className="px-6">Driver&apos;s QR Code</CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="flex min-h-32 min-w-32 items-center justify-center rounded-md bg-gray-300">
                <Image
                  src={qrcode}
                  alt="license"
                  width={60}
                  height={60}
                  loading="lazy"
                />
              </div>
              <div className="flex w-full flex-col justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  Make sure to only provide this QR Code to the driver itself.
                  Please do not share this to others.
                </p>
                <div className="flex flex-row gap-2">
                  <ViewQRCode id={driver.id}>
                    <div className="bg-primary w-full cursor-pointer rounded-md p-2 text-sm text-white">
                      View QR Code
                    </div>
                  </ViewQRCode>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex min-h-0 flex-col md:col-start-1 md:col-end-3 xl:col-start-2 xl:col-end-3 xl:row-start-2 xl:row-end-4">
          <DriverShiftsTable id={driver.id} />
        </div>
      </div>
    </div>
  );
}
