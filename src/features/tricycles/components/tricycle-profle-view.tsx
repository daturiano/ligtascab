"use client";

import React from "react";
import docuimg from "@/app/public/approve.png";
import qrcode from "@/app/public/qr-code.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Tricycle } from "@/lib/types";
import dynamic from "next/dynamic";

const TricycleProfileCard = dynamic(
  () => import("@/features/tricycles/components/tricycle-profile-card"),
  { ssr: false },
);

const ViewQRCode = dynamic(() => import("@/components/private/view-qr-code"), {
  ssr: false,
});

const ViewTricycleCompliance = dynamic(
  () => import("@/features/tricycles/components/view-tricycle-compliance"),
  {
    ssr: false,
  },
);

const TricycleShiftsTable = dynamic<{ id: string }>(
  () =>
    import("@/features/tricycles/components/tricycle-shifts-table").then(
      (mod) => mod.TricycleShiftsTable,
    ),
  { ssr: false },
);

type TricycleProfileViewProps = {
  user: User;
  tricycle: Tricycle;
};

export default function TricycleProfileView({
  user,
  tricycle,
}: TricycleProfileViewProps) {
  return (
    <div className="flex h-full flex-col space-y-6">
      <Link href={"/tricycles"} className="w-0">
        <ArrowLeft size={28} />
      </Link>
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-[auto_1fr] xl:grid-rows-[auto_1fr]">
        <div className="xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-4">
          <TricycleProfileCard tricycle={tricycle} />
        </div>
        <div className="flex flex-col gap-4 md:justify-between xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2 xl:flex-row">
          <Card className="w-full max-w-[500px] grow xl:max-w-[600px] xl:grow-0">
            <CardHeader>
              <CardTitle>Tricycle&apos;s Compliance Documents</CardTitle>
              <CardDescription>
                Keep the tricycle&apos;s documents always up to date.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex grow gap-4">
              <div className="flex min-h-32 min-w-32 items-center justify-center rounded-md bg-gray-300/60">
                <Image
                  src={docuimg}
                  alt="document image"
                  width={80}
                  height={80}
                  loading="lazy"
                />
              </div>
              <div className="flex w-full flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <ViewTricycleCompliance
                    path={`${user.id}/tricycles/${tricycle.id}`}
                    tricycle={tricycle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-[500px] grow xl:max-w-[600px] xl:grow-0">
            <CardTitle className="px-6">Tricycle&apos;s QR Code</CardTitle>
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
                  Make sure to only attach this QR Code to the correct tricycle.
                  Please do not share this to others.
                </p>
                <div className="flex flex-row gap-2">
                  <ViewQRCode id={tricycle.id}>
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
          <TricycleShiftsTable id={tricycle.id} />
        </div>
      </div>
    </div>
  );
}
