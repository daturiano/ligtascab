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
    <div className="space-y-4 gap-4 mx-auto mb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Shifts</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="justify-between min-w-[350px] max-w-[350px] lg:max-w-[450px] lg:max-h-[610px] max-h-[500px]">
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
          <Card className="w-full min-w-[350px]">
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
