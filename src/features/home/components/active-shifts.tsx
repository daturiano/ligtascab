'use client';

import empty_shift from '@/app/public/empty_shift.svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import QRReaderCard from '@/features/shifts/components/qr-reader-card';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchActiveShifts } from '../db/home';
import ActiveShiftCard from './active-shift-card';

export default function ActiveShifts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['active_shifts'],
    queryFn: fetchActiveShifts,
  });

  if (error) {
    return <div>Error loading drivers: {error.message}</div>;
  }

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />;
  }

  if (!data) return null;
  return (
    <Card className="p-0 gap-0 rounded-md shadow-none max-h-[340px]">
      <CardHeader className="border-b-1 p-6 gap-0 flex flex-row items-center justify-between max-h-[65px]">
        <CardTitle>Active Shifts</CardTitle>
        <Dialog>
          <DialogTrigger className="flex justify-end">
            <div className="bg-primary rounded-md py-2 px-4 cursor-pointer">
              <p className="text-white text-sm">Create New Shift</p>
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 py-6 overflow-y-auto">
        {data.length > 0 ? (
          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="space-y-2">
              {data.map((shift, index) => (
                <ActiveShiftCard shift={shift} key={index} />
              ))}
            </div>
            {data.length <= 2 && (
              <Dialog>
                <DialogTrigger className="flex justify-end">
                  <div className="bg-primary rounded-md py-2 px-4 cursor-pointer">
                    <p className="text-white text-sm">Create New Shift</p>
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
          <div className="flex-1 flex flex-col gap-4 items-center justify-center">
            <Image
              src={empty_shift}
              alt="empty_shift_image"
              height={140}
              width={140}
            />
            <div className="space-y-2">
              <p className="font-normal">No active shifts right now.</p>
              <Button className="px-16">Start Shift</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
