'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import qrImage from '@/app/public/scan.png';
import QRCodeReader from '@/features/shifts/components/qr-reader';
import { useQuery } from '@tanstack/react-query';
import { fetchAllShiftLogs } from '@/features/shifts/actions/shifts';
import { ShiftTable } from '@/features/shifts/components/shift-table';
import { columns } from '@/features/shifts/components/columns';

export default function ShiftPage() {
  const [isScanning, setIsScanning] = useState(false);

  const { data: shift_logs, error } = useQuery({
    queryKey: ['shift_logs'],
    queryFn: fetchAllShiftLogs,
  });

  if (error) {
    return <div>Error loading logs: {error.message}</div>;
  }

  return (
    <div className="space-y-4 w-full gap-4 lg:px-20 max-w-screen-2xl mx-auto mb-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Shifts</h1>
        <div className="flex gap-6">
          <Card className="w-[450px] min-w-[450px] max-h-[610px]">
            <CardHeader>
              <CardTitle>Log Driver Attendance</CardTitle>
              <CardDescription>
                {isScanning
                  ? 'Log driver attendance using the QR Code and required details.'
                  : 'Press "Start Log Attendance" to start scanning the drivers QR Code.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <QRCodeReader setIsScanning={setIsScanning} />
              ) : (
                <Image src={qrImage} alt="qr code" />
              )}
            </CardContent>
            {!isScanning && (
              <CardFooter>
                <Button
                  className="w-full rounded-2xl"
                  onClick={() => setIsScanning(true)}
                >
                  Start Log Attendance
                </Button>
              </CardFooter>
            )}
          </Card>
          <Card className="w-full">
            <CardContent>
              <ShiftTable
                data={shift_logs ?? []}
                columns={columns}
                filter_by="driver_name"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
