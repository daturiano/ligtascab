"use client";

import empty_shift from "@/app/public/empty_shift.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import QRReaderCard from "@/features/shifts/components/qr-reader-card";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { fetchActiveShifts } from "../db/home";
import ActiveShiftCard from "./active-shift-card";

export default function ActiveShifts() {
  const { data, isLoading } = useQuery({
    queryKey: ["active_shifts"],
    queryFn: fetchActiveShifts,
  });

  if (isLoading) {
    return <Skeleton className="h-[333px] w-[990px] rounded-md" />;
  }

  if (!data) return null;
  return (
    <Card className="gap-0 rounded-md border-0 p-0">
      <CardHeader className="flex max-h-[65px] flex-row items-center justify-between gap-0 border-b-1 p-6">
        <CardTitle className="text-sm md:text-base">Active Shifts</CardTitle>
        {data.length > 0 && (
          <Dialog>
            <DialogTrigger className="flex justify-end">
              <div className="bg-primary cursor-pointer rounded-md px-4 py-2">
                <p className="text-sm text-white">Create New Shift</p>
              </div>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="flex flex-col items-center"
            >
              <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <QRReaderCard />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto py-6">
        {data.length > 0 ? (
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="space-y-4">
              {data.map((shift, index) => (
                <ActiveShiftCard shift={shift} key={index} />
              ))}
            </div>
            {data.length <= 2 && (
              <Dialog>
                <DialogTrigger className="flex justify-end">
                  <div className="bg-primary cursor-pointer rounded-md px-4 py-2">
                    <p className="text-sm text-white">Create New Shift</p>
                  </div>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="flex flex-col items-center"
                >
                  <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <QRReaderCard />
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <Image
              src={empty_shift}
              alt="empty_shift_image"
              height={140}
              width={140}
            />
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-normal md:text-base">
                No active shifts right now.
              </p>
              <Dialog>
                <DialogTrigger className="flex justify-center">
                  <div className="bg-primary min-w-44 cursor-pointer rounded-md px-4 py-2">
                    <p className="text-sm text-white">Create New Shift</p>
                  </div>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="flex flex-col items-center"
                >
                  <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <QRReaderCard />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
